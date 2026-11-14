// __tests__/turnstileForwarding.test.ts
//
// The browser sends x-turnstile-token to the BFF; the BFF must hand it to the
// API on the same header name or the API (when enforcing) 403s every login.
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
vi.mock('@/lib/server/bffSecurity', () => ({
  getCsrfGuardRejection: () => null,
}));
vi.mock('@/lib/api/programs', () => ({
  getProgramDetail: async () => ({ id: 'p1' }),
}));
vi.mock('@/lib/api/authContext', () => ({
  fetchAuthContext: async () => ({
    brandId: 'b1',
    programId: 'p1',
    programSlug: 'slug',
    localProviderId: 'lp1',
    requireEmailVerification: true,
  }),
}));

import { POST as register } from '@/app/api/auth/register/route';
import { POST as localLogin } from '@/app/api/auth/local-login/route';
import { POST as forgotPassword } from '@/app/api/auth/forgot-password/route';
import { POST as resendVerification } from '@/app/api/auth/resend-verification/route';

const routes = [
  ['register', register, { email: 'a@b.co', password: 'Passw0rd!' }],
  ['local-login', localLogin, { email: 'a@b.co', password: 'Passw0rd!' }],
  ['forgot-password', forgotPassword, { email: 'a@b.co' }],
  ['resend-verification', resendVerification, { email: 'a@b.co' }],
] as const;

function req(name: string, body: unknown, headers: Record<string, string>) {
  return new Request(`http://localhost/api/auth/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

async function upstreamHeaders(
  handler: (r: Request) => Promise<Response>,
  name: string,
  body: unknown,
  headers: Record<string, string>,
): Promise<Record<string, string>> {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => ({ data: { accessToken: 'a', refreshToken: 'r' } }),
  }));
  vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
  await handler(req(name, body, headers));
  const [, init] = fetchMock.mock.calls[0] as unknown as [string, { headers: Record<string, string> }];
  return init.headers;
}

describe('turnstile token forwarding through the auth BFF routes', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it.each(routes)('%s forwards x-turnstile-token to the API', async (name, handler, body) => {
    const sent = await upstreamHeaders(handler, name, body, { 'x-turnstile-token': 'tok-123' });
    expect(sent['x-turnstile-token']).toBe('tok-123');
  });

  it.each(routes)('%s sends no header when the browser sent none', async (name, handler, body) => {
    const sent = await upstreamHeaders(handler, name, body, {});
    expect(sent).not.toHaveProperty('x-turnstile-token');
  });

  it('drops an oversized token instead of forwarding junk', async () => {
    const sent = await upstreamHeaders(forgotPassword, 'forgot-password', { email: 'a@b.co' }, {
      'x-turnstile-token': 'x'.repeat(2049),
    });
    expect(sent).not.toHaveProperty('x-turnstile-token');
  });
});
