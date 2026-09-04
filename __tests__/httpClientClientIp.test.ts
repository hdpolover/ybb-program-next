// @vitest-environment node
//
// Runs in the NODE environment on purpose. The rest of the suite is jsdom, where
// `window` is defined and inboundClientIpHeaders short-circuits to {} — so a
// jsdom test here would pass without ever exercising the server path it exists
// to cover.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const headersMock = vi.fn();
vi.mock('next/headers', () => ({ headers: () => headersMock() }));

const makeInbound = (entries: Record<string, string>) => ({
  get: (name: string) => entries[name.toLowerCase()] ?? null,
});

let fetchSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetModules();
  process.env.API_INTERNAL_URL = 'http://api.internal';
  fetchSpy = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => ({ data: null }),
  });
  vi.stubGlobal('fetch', fetchSpy);
});

afterEach(() => {
  vi.unstubAllGlobals();
  headersMock.mockReset();
});

const sentHeaders = () => fetchSpy.mock.calls[0][1].headers as Record<string, string>;

describe('server-side calls forward the caller address', () => {
  it('passes both address headers through to the API', async () => {
    headersMock.mockReturnValue(
      makeInbound({ 'x-forwarded-for': '203.0.113.7, 172.70.1.1', 'cf-connecting-ip': '203.0.113.7' }),
    );
    const { apiGet } = await import('@/lib/api/httpClient');

    await apiGet('/v1/metadata/countries');

    expect(sentHeaders()['x-forwarded-for']).toBe('203.0.113.7, 172.70.1.1');
    expect(sentHeaders()['cf-connecting-ip']).toBe('203.0.113.7');
  });

  // The API reads the RIGHTMOST entry, because the edge appends the address it
  // actually observed. Appending or reordering here would put an untrusted value
  // last and hand callers their own throttle bucket.
  it('passes x-forwarded-for verbatim, without appending or reordering', async () => {
    const chain = '203.0.113.7, 198.51.100.4, 172.70.1.1';
    headersMock.mockReturnValue(makeInbound({ 'x-forwarded-for': chain }));
    const { apiGet } = await import('@/lib/api/httpClient');

    await apiGet('/v1/home');

    expect(sentHeaders()['x-forwarded-for']).toBe(chain);
  });

  it('omits a header that is absent rather than sending an empty one', async () => {
    headersMock.mockReturnValue(makeInbound({ 'x-forwarded-for': '203.0.113.7' }));
    const { apiGet } = await import('@/lib/api/httpClient');

    await apiGet('/v1/home');

    expect(sentHeaders()).not.toHaveProperty('cf-connecting-ip');
  });

  // next/headers throws outside a request scope. A rate-limit hint is never
  // worth failing a request over.
  it('still makes the request when there is no request scope', async () => {
    headersMock.mockImplementation(() => {
      throw new Error('called outside a request scope');
    });
    const { apiGet } = await import('@/lib/api/httpClient');

    await expect(apiGet('/v1/home')).resolves.toBeDefined();
    expect(sentHeaders()).not.toHaveProperty('x-forwarded-for');
  });

  it('lets a handler that forwards the address explicitly win', async () => {
    headersMock.mockReturnValue(makeInbound({ 'x-forwarded-for': 'from-ambient' }));
    const { apiGet } = await import('@/lib/api/httpClient');

    await apiGet('/v1/home', { headers: { 'x-forwarded-for': 'from-handler' } });

    expect(sentHeaders()['x-forwarded-for']).toBe('from-handler');
  });
});
