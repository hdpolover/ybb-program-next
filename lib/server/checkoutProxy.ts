// lib/server/checkoutProxy.ts
//
// Shared BFF plumbing for /api/checkout/*: forwards to the API's /v1/checkout
// surface, unwraps the transform-interceptor envelope and re-emits one stable
// shape { statusCode, message, code?, data } for the browser.
import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { forwardedForHeader } from '@/lib/server/forwardedFor';
import { getMessage, isRecord } from '@/lib/api/response';

const UPSTREAM_TIMEOUT_MS = 15_000;

type Upstream = { method: 'GET' | 'POST'; path: string; query?: Record<string, string>; body?: unknown };

export type UpstreamResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; response: NextResponse };

function extractCode(json: unknown): string | undefined {
  if (!isRecord(json)) return undefined;
  const candidates = [
    json.code,
    isRecord(json.data) ? json.data.code : undefined,
    isRecord(json.message) ? json.message.code : undefined,
  ];
  return candidates.find((c): c is string => typeof c === 'string');
}

/** Calls the API; failures come back as a ready-to-return browser response. */
export async function callCheckoutApi(request: Request, upstream: Upstream): Promise<UpstreamResult> {
  try {
    const url = new URL(`/v1/checkout${upstream.path}`, getServerApiBaseUrl());
    for (const [key, value] of Object.entries(upstream.query ?? {})) url.searchParams.set(key, value);

    const res = await fetch(url.toString(), {
      method: upstream.method,
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': resolveBrandDomainFromRequest(request),
        ...forwardedForHeader(request),
      },
      ...(upstream.body !== undefined ? { body: JSON.stringify(upstream.body) } : {}),
      cache: 'no-store',
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const json: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const code = extractCode(json);
      return {
        ok: false,
        response: NextResponse.json(
          {
            statusCode: res.status,
            message: getMessage(json) ?? `Request failed: ${res.status}`,
            ...(code ? { code } : {}),
            data: null,
          },
          { status: res.status },
        ),
      };
    }
    return { ok: true, status: res.status, data: isRecord(json) && 'data' in json ? json.data ?? null : json };
  } catch (error) {
    console.error('[api/checkout] upstream error', {
      path: upstream.path,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      ok: false,
      response: NextResponse.json(
        { statusCode: 502, message: 'Checkout is temporarily unavailable. Please try again.', data: null },
        { status: 502 },
      ),
    };
  }
}

export async function proxyCheckout(request: Request, upstream: Upstream): Promise<NextResponse> {
  const result = await callCheckoutApi(request, upstream);
  if (!result.ok) return result.response;
  return NextResponse.json({ statusCode: result.status, message: 'Success', data: result.data }, { status: result.status });
}
