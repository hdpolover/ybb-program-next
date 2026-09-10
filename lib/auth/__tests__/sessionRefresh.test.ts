// lib/auth/__tests__/sessionRefresh.test.ts
//
// Covers the fix for N-2026-09-10-F: middleware refreshing an expiring
// access token via the refreshToken cookie that, until now, nothing in this
// repo ever read. See lib/auth/sessionRefresh.ts for the full incident
// writeup -- these tests exist to pin down the two failure modes that
// matter most: an API blip must never look like a dead refresh token (no
// wrongful logout), and N parallel requests must collapse into ONE upstream
// refresh call (no self-inflicted rotation race).

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  decodeJwtExpirySeconds,
  isAccessTokenExpiredOrExpiring,
  refreshSession,
  refreshSessionForRequest,
  __resetRefreshStateForTests,
} from '@/lib/auth/sessionRefresh';

function base64url(input: object): string {
  const json = JSON.stringify(input);
  return Buffer.from(json, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function makeToken(expSeconds: number | undefined): string {
  const header = base64url({ alg: 'HS256', typ: 'JWT' });
  const payload = expSeconds === undefined ? base64url({}) : base64url({ exp: expSeconds });
  return `${header}.${payload}.fake-signature`;
}

function makeRequest(cookieHeader: string, pathname = '/api/portal/payments'): NextRequest {
  return new NextRequest(`http://localhost${pathname}`, {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

describe('decodeJwtExpirySeconds', () => {
  it('reads the exp claim off a well-formed token', () => {
    const token = makeToken(1_700_000_000);
    expect(decodeJwtExpirySeconds(token)).toBe(1_700_000_000);
  });

  it('returns null for a token with too few segments', () => {
    expect(decodeJwtExpirySeconds('not-a-jwt')).toBeNull();
  });

  it('returns null when the payload segment is not valid JSON', () => {
    expect(decodeJwtExpirySeconds('header.###.sig')).toBeNull();
  });

  it('returns null when the payload has no exp claim', () => {
    expect(decodeJwtExpirySeconds(makeToken(undefined))).toBeNull();
  });
});

describe('isAccessTokenExpiredOrExpiring', () => {
  const nowMs = 1_700_000_000_000;
  const nowSeconds = nowMs / 1000;

  it('treats a missing token as expired', () => {
    expect(isAccessTokenExpiredOrExpiring(undefined, nowMs)).toBe(true);
  });

  it('treats a malformed token as expired', () => {
    expect(isAccessTokenExpiredOrExpiring('garbage', nowMs)).toBe(true);
  });

  it('is false when exp is well beyond the skew window', () => {
    const token = makeToken(nowSeconds + 3600);
    expect(isAccessTokenExpiredOrExpiring(token, nowMs)).toBe(false);
  });

  it('is true once exp is inside the 60s skew window', () => {
    const token = makeToken(nowSeconds + 30);
    expect(isAccessTokenExpiredOrExpiring(token, nowMs)).toBe(true);
  });

  it('is true once exp has already passed', () => {
    const token = makeToken(nowSeconds - 10);
    expect(isAccessTokenExpiredOrExpiring(token, nowMs)).toBe(true);
  });
});

describe('refreshSessionForRequest', () => {
  const freshAccessToken = () => makeToken(Date.now() / 1000 + 3600);
  const expiredAccessToken = () => makeToken(Date.now() / 1000 - 10);

  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('takes the fast path and does not call fetch when the access token is fresh', async () => {
    const request = makeRequest(`${ACCESS_TOKEN_COOKIE}=${freshAccessToken()}; ${REFRESH_TOKEN_COOKIE}=rt-1`);
    const response = await refreshSessionForRequest(request);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(response.cookies.get(ACCESS_TOKEN_COOKIE)).toBeUndefined();
  });

  it('passes the request through untouched when there is no refresh token to redeem', async () => {
    const request = makeRequest(`${ACCESS_TOKEN_COOKIE}=${expiredAccessToken()}`);
    const response = await refreshSessionForRequest(request);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(response.cookies.get(ACCESS_TOKEN_COOKIE)).toBeUndefined();
  });

  it('refreshes and sets both cookies when the token is expired', async () => {
    fetchSpy.mockResolvedValue(
      new Response(
        JSON.stringify({
          statusCode: 200,
          message: 'Success',
          data: { accessToken: 'new-access', refreshToken: 'new-refresh' },
        }),
        { status: 200 },
      ),
    );

    const request = makeRequest(`${ACCESS_TOKEN_COOKIE}=${expiredAccessToken()}; ${REFRESH_TOKEN_COOKIE}=rt-refresh-fires`);
    const response = await refreshSessionForRequest(request);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(response.cookies.get(ACCESS_TOKEN_COOKIE)?.value).toBe('new-access');
    expect(response.cookies.get(REFRESH_TOKEN_COOKIE)?.value).toBe('new-refresh');
  });

  it('clears both cookies on an explicit 401 from the refresh endpoint', async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ statusCode: 401, message: 'invalid refresh token' }), { status: 401 }),
    );

    const request = makeRequest(`${ACCESS_TOKEN_COOKIE}=${expiredAccessToken()}; ${REFRESH_TOKEN_COOKIE}=rt-dead`);
    const response = await refreshSessionForRequest(request);

    expect(response.cookies.get(ACCESS_TOKEN_COOKIE)?.value).toBe('');
    expect(response.cookies.get(REFRESH_TOKEN_COOKIE)?.value).toBe('');
  });

  it('passes through without touching cookies on a network error', async () => {
    fetchSpy.mockRejectedValue(new TypeError('fetch failed'));

    const request = makeRequest(`${ACCESS_TOKEN_COOKIE}=${expiredAccessToken()}; ${REFRESH_TOKEN_COOKIE}=rt-network-blip`);
    const response = await refreshSessionForRequest(request);

    expect(response.cookies.get(ACCESS_TOKEN_COOKIE)).toBeUndefined();
    expect(response.cookies.get(REFRESH_TOKEN_COOKIE)).toBeUndefined();
  });

  it('passes through without touching cookies on a 5xx from the refresh endpoint', async () => {
    fetchSpy.mockResolvedValue(new Response(JSON.stringify({ message: 'boom' }), { status: 503 }));

    const request = makeRequest(`${ACCESS_TOKEN_COOKIE}=${expiredAccessToken()}; ${REFRESH_TOKEN_COOKIE}=rt-5xx`);
    const response = await refreshSessionForRequest(request);

    expect(response.cookies.get(ACCESS_TOKEN_COOKIE)).toBeUndefined();
    expect(response.cookies.get(REFRESH_TOKEN_COOKIE)).toBeUndefined();
  });
});

describe('refreshSession single-flight', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('collapses N concurrent callers for the same refresh token into ONE upstream fetch', async () => {
    let resolveFetch: (response: Response) => void = () => {};
    const pendingFetch = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    fetchSpy.mockImplementation(() => pendingFetch);

    const sameToken = 'rt-single-flight-key';
    const callers = [
      refreshSession(sameToken),
      refreshSession(sameToken),
      refreshSession(sameToken),
      refreshSession(sameToken),
      refreshSession(sameToken),
    ];

    // All five siblings are in flight against the one fetch above; resolve it
    // once, and every caller must settle off the same response.
    resolveFetch(
      new Response(
        JSON.stringify({ data: { accessToken: 'shared-access', refreshToken: 'shared-refresh' } }),
        { status: 200 },
      ),
    );

    const outcomes = await Promise.all(callers);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    for (const outcome of outcomes) {
      expect(outcome).toEqual({
        kind: 'refreshed',
        tokens: { accessToken: 'shared-access', refreshToken: 'shared-refresh' },
      });
    }
  });

  it('issues a separate fetch for a different refresh token', async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ data: { accessToken: 'a', refreshToken: 'b' } }), { status: 200 }),
    );

    await Promise.all([refreshSession('token-x'), refreshSession('token-y')]);

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});

// The race that the in-flight map alone does NOT cover, and the reason a
// second map exists. A page load stamps every parallel XHR with the OLD
// cookie before any response comes back; the stragglers arrive after the
// in-flight entry has settled and cleared, still holding a token the API has
// already rotated away. Without the result cache each of those takes the
// 401 path, and the 401 path clears cookies — the logout this whole module
// exists to prevent, on a race that only appears under real traffic.
describe('refreshSessionForRequest — late arrivals holding an already-rotated token', () => {
  const expiredAccessToken = () => makeToken(Date.now() / 1000 - 10);

  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    __resetRefreshStateForTests();
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    __resetRefreshStateForTests();
  });

  it('serves a straggler from the rotation cache instead of letting the API 401 it', async () => {
    fetchSpy.mockResolvedValue(
      new Response(JSON.stringify({ data: { accessToken: 'new-at', refreshToken: 'new-rt' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }) as never,
    );

    const cookie = `${ACCESS_TOKEN_COOKIE}=${expiredAccessToken()}; ${REFRESH_TOKEN_COOKIE}=spent-rt`;

    // First request rotates spent-rt -> new-rt and settles completely.
    const first = await refreshSessionForRequest(makeRequest(cookie));
    expect(first.cookies.get(ACCESS_TOKEN_COOKIE)?.value).toBe('new-at');
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    // A straggler arrives AFTER that settled, still carrying spent-rt. The
    // API would 401 it; it must never reach the API at all.
    const straggler = await refreshSessionForRequest(makeRequest(cookie));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(straggler.cookies.get(ACCESS_TOKEN_COOKIE)?.value).toBe('new-at');
    expect(straggler.cookies.get(REFRESH_TOKEN_COOKIE)?.value).toBe('new-rt');
  });

  it('does not cache a rejection, so a genuinely dead token still clears cookies every time', async () => {
    fetchSpy.mockResolvedValue(new Response('', { status: 401 }) as never);

    const cookie = `${ACCESS_TOKEN_COOKIE}=${expiredAccessToken()}; ${REFRESH_TOKEN_COOKIE}=dead-rt`;

    for (const _attempt of [1, 2]) {
      const response = await refreshSessionForRequest(makeRequest(cookie));
      // NextResponse.cookies.delete sets an expiry-in-the-past cookie.
      expect(response.cookies.get(ACCESS_TOKEN_COOKIE)?.value).toBe('');
      expect(response.cookies.get(REFRESH_TOKEN_COOKIE)?.value).toBe('');
    }

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
