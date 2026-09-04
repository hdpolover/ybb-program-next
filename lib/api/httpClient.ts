import { withTimeoutSignal, isFetchTimeoutError } from '@/lib/api/fetchWithTimeout';

// Every apiGet/apiPost had an unbounded wait, so one stalled upstream pinned an
// SSR render (and its worker) forever. 10s is well past the slowest healthy
// landing call; pass `timeoutMs` to widen it for a genuinely long endpoint.
export const DEFAULT_API_TIMEOUT_MS = 10_000;

export interface ApiGetOptions {
  query?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  timeoutMs?: number;
}

export interface ApiPostOptions {
  query?: Record<string, string | number | boolean | undefined>;
  headers?: HeadersInit;
  body?: unknown;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  timeoutMs?: number;
}

export class ApiRequestError extends Error {
  status: number;
  statusText: string;
  url: string;

  constructor(params: { status: number; statusText: string; url: string }) {
    super(`API request failed: ${params.status} ${params.statusText} (${params.url})`);
    this.name = 'ApiRequestError';
    this.status = params.status;
    this.statusText = params.statusText;
    this.url = params.url;
  }
}

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    const serverBaseUrl = process.env.API_INTERNAL_URL?.trim();
    if (!serverBaseUrl) {
      throw new Error('API_INTERNAL_URL must be configured for server-side API calls.');
    }

    return serverBaseUrl.replace(/\/+$/, '');
  }

  return window.location.origin;
}

// A timeout is surfaced as the ApiRequestError callers already branch on
// (504), never as a bare AbortError, so existing status handling keeps working.
async function fetchWithApiTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const { signal, cleanup } = withTimeoutSignal(timeoutMs);
  try {
    return await fetch(url, { ...init, signal });
  } catch (error) {
    if (isFetchTimeoutError(error)) {
      throw new ApiRequestError({ status: 504, statusText: 'Gateway Timeout', url });
    }
    throw error;
  } finally {
    cleanup();
  }
}

function buildApiUrl(path: string): URL {
  if (typeof window === 'undefined') {
    return new URL(path, getApiBaseUrl());
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(`/api/proxy${normalizedPath}`, getApiBaseUrl());
}

/**
 * The caller's address, for server-side calls the API will rate limit.
 *
 * Route handlers run in the Next container, so unless the client address is
 * passed through, the API sees that one container as the client for every
 * proxied request and rate limits the entire site as a single caller. Nine
 * handlers already do this explicitly with forwardedForHeader() - all of them
 * auth routes, where per-IP limiting matters most - but the other fifty-odd do
 * not, and most of those cannot: they call apiGet without a `request` object at
 * all (see app/api/metadata/countries/route.ts).
 *
 * Reading the headers here rather than threading `request` through fifty
 * handlers means every server-side call gets it, including ones added later
 * that nobody remembers to wire up.
 *
 * Authenticated traffic was never affected - the API's UserAwareThrottlerGuard
 * keys those on the token's subject - so this specifically fixes ANONYMOUS
 * requests, which all shared one bucket against the global tiers.
 *
 * `x-forwarded-for` is passed verbatim, never rebuilt or appended to: the edge
 * appends the address it actually observed, so the rightmost entry is the
 * trustworthy one and the API reads that end. Adding an entry here would put an
 * untrusted value last and let callers choose their own throttle bucket. See
 * lib/server/forwardedFor.ts, which documents the same rule for the handlers
 * that call it directly.
 *
 * Returns {} in the browser, and on any failure. next/headers throws outside a
 * request scope - during static generation, for instance - and a rate-limit
 * hint is never worth failing a request over.
 */
async function inboundClientIpHeaders(): Promise<Record<string, string>> {
  if (typeof window !== 'undefined') return {};

  try {
    const { headers } = await import('next/headers');
    const inbound = await headers();
    const forwarded: Record<string, string> = {};

    const xff = inbound.get('x-forwarded-for')?.trim();
    if (xff) forwarded['x-forwarded-for'] = xff;

    const cfIp = inbound.get('cf-connecting-ip')?.trim();
    if (cfIp) forwarded['cf-connecting-ip'] = cfIp;

    return forwarded;
  } catch {
    return {};
  }
}

export async function apiGet<T>(path: string, options: ApiGetOptions = {}): Promise<T> {
  const url = buildApiUrl(path);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetchWithApiTimeout(
    url.toString(),
    {
      method: 'GET',
      cache: options.cache ?? 'no-store',
      next: options.next,
      headers: {
        'Content-Type': 'application/json',
        // Before options.headers, so a handler that already forwards the
        // address explicitly still wins.
        ...(await inboundClientIpHeaders()),
        ...(options.headers ?? {}),
      },
    },
    options.timeoutMs ?? DEFAULT_API_TIMEOUT_MS,
  );

  if (!res.ok) {
    throw new ApiRequestError({ status: res.status, statusText: res.statusText, url: url.toString() });
  }

  return (await res.json()) as T;
}

export async function apiPost<T>(path: string, options: ApiPostOptions = {}): Promise<T> {
  const url = buildApiUrl(path);

  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetchWithApiTimeout(
    url.toString(),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Before options.headers, so a handler that already forwards the
        // address explicitly still wins.
        ...(await inboundClientIpHeaders()),
        ...(options.headers ?? {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: options.cache,
      next: options.next,
    },
    options.timeoutMs ?? DEFAULT_API_TIMEOUT_MS,
  );

  if (!res.ok) {
    throw new ApiRequestError({ status: res.status, statusText: res.statusText, url: url.toString() });
  }

  return (await res.json()) as T;
}

// Generic helper for APIs that wrap payloads in { statusCode, message, data }
export type ApiEnvelope<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export async function apiGetWithEnvelope<TData>(
  path: string,
  options: ApiGetOptions = {},
): Promise<TData> {
  const json = await apiGet<ApiEnvelope<TData>>(path, options);

  if (json.statusCode !== 200 || !json.data) {
    throw new Error(json.message || 'Unexpected API response');
  }

  return json.data;
}
