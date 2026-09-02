// lib/api/__tests__/httpClient.test.ts
//
// apiGet/apiPost had no timeout, so a stalled backend pinned an SSR render
// (and its worker) forever. They now abort at DEFAULT_API_TIMEOUT_MS and
// surface the ApiRequestError shape callers already branch on, not a bare
// AbortError.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiGet, ApiRequestError, DEFAULT_API_TIMEOUT_MS } from '@/lib/api/httpClient';

// Stands in for a backend that accepts the connection and never answers.
function hangingFetch() {
  return vi.fn((_url: string, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () =>
        reject(new DOMException('Aborted', 'AbortError')),
      );
    }),
  );
}

describe('apiGet timeout', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('rejects with a 504 ApiRequestError once the default timeout elapses', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', hangingFetch());

    const pending = apiGet('/v1/landing/settings').catch((e) => e);
    await vi.advanceTimersByTimeAsync(DEFAULT_API_TIMEOUT_MS);

    const error = await pending;
    expect(error).toBeInstanceOf(ApiRequestError);
    expect(error.status).toBe(504);
  });

  it('honours an explicit timeoutMs override', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', hangingFetch());

    const pending = apiGet('/v1/landing/settings', { timeoutMs: 1_000 }).catch((e) => e);
    await vi.advanceTimersByTimeAsync(1_000);

    expect((await pending).status).toBe(504);
  });

  it('passes a successful response through untouched', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    );

    await expect(apiGet<{ ok: boolean }>('/v1/landing/settings')).resolves.toEqual({ ok: true });
  });
});
