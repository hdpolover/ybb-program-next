// __tests__/firebaseLoginRoute.test.ts
//
// Same shape of near-miss as cancelDeletionRoute.test.ts. The login page was
// changed to send applicationCategory on the Google signup path, and the API's
// FirebaseLoginDto has always accepted it — but this BFF route in between never
// forwarded it, so every Google signup silently fell through to
// ensureProgramApplication's default category. Nothing failed; the fix was just
// inert. These assert what survives the hop.
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/server/envContext', () => ({
  resolveBrandDomainFromRequest: () => 'example.com',
}));
vi.mock('@/lib/server/apiBaseUrl', () => ({
  getServerApiBaseUrl: () => 'http://api.internal',
}));
vi.mock('@/lib/server/forwardedFor', () => ({
  forwardedForHeader: () => ({}),
}));
vi.mock('@/lib/api/authContext', () => ({
  fetchAuthContext: async () => ({ brandId: 'b1', programId: 'p1', programSlug: 'slug' }),
}));

import { POST } from '@/app/api/auth/firebase-login/route';

function req(body: unknown) {
  return new Request('http://localhost/api/auth/firebase-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function forwardedBody(clientBody: Record<string, unknown>): Promise<Record<string, unknown>> {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ statusCode: 200, message: 'ok', data: {} }),
  }));
  vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

  await POST(req(clientBody));

  const [, init] = fetchMock.mock.calls[0] as unknown as [string, { body: string }];
  return JSON.parse(init.body) as Record<string, unknown>;
}

describe('firebase-login BFF route', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('forwards the chosen applicationCategory to the API', async () => {
    const sent = await forwardedBody({ idToken: 't', applicationCategory: 'fully_funded' });
    expect(sent.applicationCategory).toBe('fully_funded');
  });

  it('forwards captured ad click ids so server-side conversions stay attributed', async () => {
    const sent = await forwardedBody({
      idToken: 't',
      adAttribution: { fbp: 'fb.1.2.3', ttclid: 'ttc123' },
    });
    expect(sent.adAttribution).toEqual({ fbp: 'fb.1.2.3', ttclid: 'ttc123' });
  });

  it('omits both keys entirely when the client sent neither', async () => {
    const sent = await forwardedBody({ idToken: 't' });
    expect(sent).not.toHaveProperty('applicationCategory');
    expect(sent).not.toHaveProperty('adAttribution');
  });
});
