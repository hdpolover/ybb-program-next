// lib/auth/sessionRefresh.ts
//
// Root cause under fix: JWT_EXPIRES_IN=1h in production, a refreshToken
// cookie every login route sets and NO code in this repo has ever read, and
// both cookies carry no maxAge so nothing bounds a session but that 1h
// access-token exp. ~13k applicants were getting hard-logged-out mid draft
// save every hour while holding a perfectly good 7-day credential sitting
// unused in their cookie jar. This module is the read side of that cookie:
// middleware.ts calls it on every /api/* request to redeem an expiring
// access token before the route handler ever sees it.
//
// The API rotates refreshToken on every /v1/auth/refresh call and fails
// CLOSED -- the old token is invalidated server-side, so a second call
// presenting it gets 401. A page load fires many parallel /api/* requests,
// so naive per-request refresh means the first call wins and every sibling
// request gets a dead-token 401, which would make the "fix" log people out
// *more* often, just at a moment that is harder to reproduce. The two
// de-dup maps below exist solely to prevent that -- see their comment for
// why in-flight collapsing alone does not cover it.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { withTimeoutSignal } from '@/lib/api/fetchWithTimeout';

export const ACCESS_TOKEN_COOKIE = 'accessToken';
export const REFRESH_TOKEN_COOKIE = 'refreshToken';

// How far ahead of actual expiry we treat a token as "already expired" and
// go fetch a new one. Covers the gap between this check running and the
// route handler's own fetch to the API actually landing -- without it, a
// token that reads as valid here can expire in flight and still 401
// downstream.
export const REFRESH_SKEW_SECONDS = 60;

// The refresh call is a single small POST with no business logic behind it;
// 10s matches DEFAULT_API_TIMEOUT_MS in lib/api/httpClient.ts, which is
// already calibrated as "well past the slowest healthy call" for this API.
const REFRESH_TIMEOUT_MS = 10_000;

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export type RefreshOutcome =
  // The API said, unambiguously, that this refresh token is dead (401/403).
  // Safe to clear both cookies and fall through to logged-out behaviour.
  | { kind: 'unauthorized' }
  // A network error, timeout, 5xx, or a 2xx body missing the tokens we asked
  // for. NOT proof the refresh token is bad -- an API blip must never look
  // like a dead session, or a transient outage logs out the entire site.
  // Caller must leave cookies untouched and let the request proceed as-is.
  | { kind: 'passthrough' }
  | { kind: 'refreshed'; tokens: SessionTokens };

/**
 * Pulls the `exp` claim off a JWT without verifying its signature.
 *
 * Middleware has no signing key and doesn't need one here: this is only used
 * to decide "is it worth calling refresh", and the API re-verifies the token
 * on every real request regardless of what we decide. A token this can't
 * parse is treated as expired by the caller, never as valid -- the failure
 * mode of guessing "still good" on a malformed token is a request that goes
 * out with a token the API will reject anyway, one round trip later than it
 * needed to.
 */
export function decodeJwtExpirySeconds(token: string): number | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

/**
 * True when `accessToken` is absent, unparseable, already expired, or due to
 * expire within REFRESH_SKEW_SECONDS. This is the fast path's gate: the vast
 * majority of /api/* requests hit a token that's nowhere near expiry, and for
 * those this does one atob() call and nothing else -- no fetch, no cookie
 * writes.
 */
export function isAccessTokenExpiredOrExpiring(
  accessToken: string | undefined,
  nowMs: number = Date.now(),
): boolean {
  if (!accessToken) return true;

  const expSeconds = decodeJwtExpirySeconds(accessToken);
  if (expSeconds === null) return true;

  return expSeconds * 1000 - nowMs <= REFRESH_SKEW_SECONDS * 1000;
}

async function callRefreshEndpoint(refreshToken: string): Promise<RefreshOutcome> {
  const url = new URL('/v1/auth/refresh', getServerApiBaseUrl());
  const { signal, cleanup } = withTimeoutSignal(REFRESH_TIMEOUT_MS);

  try {
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      signal,
    });

    // Explicit "this token is dead" from the API -- the only case where
    // clearing cookies is correct.
    if (res.status === 401 || res.status === 403) {
      return { kind: 'unauthorized' };
    }

    if (!res.ok) {
      return { kind: 'passthrough' };
    }

    // Same transform-interceptor unwrap as the login routes: the API wraps
    // every response in { statusCode, message, data }, but that shape isn't
    // contractual enough to assume, so fall back to top-level fields too.
    const json = (await res.json().catch(() => null)) as {
      data?: { accessToken?: string; refreshToken?: string } | null;
      accessToken?: string;
      refreshToken?: string;
    } | null;

    const accessToken = json?.data?.accessToken ?? json?.accessToken;
    const nextRefreshToken = json?.data?.refreshToken ?? json?.refreshToken;

    if (!accessToken || !nextRefreshToken) {
      // A 2xx with a body we can't use is an upstream contract violation,
      // not proof of a dead refresh token -- don't log the user out over it.
      return { kind: 'passthrough' };
    }

    return { kind: 'refreshed', tokens: { accessToken, refreshToken: nextRefreshToken } };
  } catch {
    // Network failure or withTimeoutSignal's abort. Either way, we don't
    // know the refresh token's actual state, so treat it as still-good and
    // let the request through unchanged.
    return { kind: 'passthrough' };
  } finally {
    cleanup();
  }
}

// Per-instance de-dup, keyed by the refresh token being redeemed. TWO maps,
// because in-flight de-dup alone is not enough and the gap between them is
// exactly the bug this whole module exists to prevent.
//
// `inflightRefreshes` collapses requests that OVERLAP IN TIME: three XHRs
// hitting middleware together make one upstream call, not three.
//
// `recentlyRotated` covers the ones that do not overlap, which is the case
// that actually bites. A page load fires ~10 parallel /api/* calls; the
// browser stamped every one of them with the OLD cookie before any response
// came back. The first few collapse and rotate T -> T'. Numbers four through
// ten land a few tens of milliseconds later, after the in-flight entry has
// already settled and been cleared, still presenting T -- which the API has
// now invalidated, so each gets a 401, and a 401 clears cookies. The user is
// logged out by the very code meant to keep them signed in, on a race that
// only shows up under real parallel traffic and never in a unit test.
//
// So a successful rotation is remembered against the token it consumed for a
// short window, and a late arrival holding that same spent token is handed
// the tokens it should have had instead of being sent upstream to be told
// its credential is dead. Only SUCCESS is cached: caching an 'unauthorized'
// would pin a logout for the length of the TTL.
//
// This is per-instance and does not coordinate across replicas. Today
// ybb-program-next runs as a single container so that covers it; if it is
// ever scaled out, two instances can still both redeem the same token and
// the loser WILL take the 401 path and clear cookies. That is a real
// limitation, not a theoretical one -- it needs shared state (Redis) to
// close properly, and this comment is the marker for whoever scales it.
const REFRESH_RESULT_TTL_MS = 60_000;

const inflightRefreshes = new Map<string, Promise<RefreshOutcome>>();
const recentlyRotated = new Map<string, { tokens: SessionTokens; expiresAtMs: number }>();

function pruneRecentlyRotated(nowMs: number): void {
  for (const [token, entry] of recentlyRotated) {
    if (entry.expiresAtMs <= nowMs) {
      recentlyRotated.delete(token);
    }
  }
}

export function refreshSession(refreshToken: string): Promise<RefreshOutcome> {
  const nowMs = Date.now();
  pruneRecentlyRotated(nowMs);

  const alreadyRotated = recentlyRotated.get(refreshToken);
  if (alreadyRotated) {
    return Promise.resolve({ kind: 'refreshed', tokens: alreadyRotated.tokens });
  }

  const existing = inflightRefreshes.get(refreshToken);
  if (existing) return existing;

  const promise = callRefreshEndpoint(refreshToken)
    .then((outcome) => {
      if (outcome.kind === 'refreshed') {
        recentlyRotated.set(refreshToken, {
          tokens: outcome.tokens,
          expiresAtMs: Date.now() + REFRESH_RESULT_TTL_MS,
        });
      }
      return outcome;
    })
    .finally(() => {
      inflightRefreshes.delete(refreshToken);
    });

  inflightRefreshes.set(refreshToken, promise);
  return promise;
}

// Test seam: the maps are module state, so a test that rotates a token would
// otherwise leak that result into every later test in the file.
export function __resetRefreshStateForTests(): void {
  inflightRefreshes.clear();
  recentlyRotated.clear();
}

function setSessionCookies(response: NextResponse, tokens: SessionTokens): void {
  // Deliberately identical to local-login/route.ts's cookie options: no
  // maxAge (session cookie), httpOnly, secure in prod, sameSite lax. This
  // refresh only ever swaps the values of a session that already exists --
  // it must not silently upgrade or downgrade the cookie's own lifetime
  // semantics.
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  response.cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, cookieOptions);
  response.cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, cookieOptions);
}

/**
 * The middleware entrypoint: given the incoming request, returns the
 * NextResponse middleware.ts should return for an /api/* route (excluding
 * /api/auth/*, which the caller must exclude itself).
 *
 * Fast path (the overwhelming majority of calls): access token isn't near
 * expiry, do nothing, return NextResponse.next() with zero I/O.
 *
 * No refresh token on the request: there is nothing this module can redeem,
 * so pass the request through untouched and let the route handler's normal
 * 401 handling take over -- that is unrelated pre-existing behaviour, not
 * something to paper over here.
 */
export async function refreshSessionForRequest(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!isAccessTokenExpiredOrExpiring(accessToken)) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.next();
  }

  const outcome = await refreshSession(refreshToken);

  if (outcome.kind === 'passthrough') {
    return NextResponse.next();
  }

  if (outcome.kind === 'unauthorized') {
    const response = NextResponse.next();
    response.cookies.delete(ACCESS_TOKEN_COOKIE);
    response.cookies.delete(REFRESH_TOKEN_COOKIE);
    return response;
  }

  // Rewrite the outgoing request's own Cookie header so the route handler
  // downstream reads the NEW access token instead of the expired one it
  // arrived with -- request.cookies.set mutates request.headers in place,
  // so re-wrapping it in `new Headers(...)` (the documented Next.js pattern)
  // is enough to propagate it to the request NextResponse.next() forwards.
  request.cookies.set(ACCESS_TOKEN_COOKIE, outcome.tokens.accessToken);
  const response = NextResponse.next({ request: { headers: new Headers(request.headers) } });
  setSessionCookies(response, outcome.tokens);
  return response;
}
