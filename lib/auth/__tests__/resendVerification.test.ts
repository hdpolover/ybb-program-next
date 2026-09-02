// lib/auth/__tests__/resendVerification.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resendVerificationEmail } from '../resendVerification';

function mockFetch(status: number, body: unknown) {
  const res = {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
  return vi.fn(async () => res);
}

describe('resendVerificationEmail', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('reports success when the request succeeds', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { message: 'Verification email sent successfully.' }));
    const result = await resendVerificationEmail('ada@gmail.com');
    expect(result.status).toBe('sent');
  });

  it('recognises "already verified" regardless of the status code', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { message: 'Email is already verified' }));
    expect((await resendVerificationEmail('ada@gmail.com')).status).toBe('already-verified');

    vi.stubGlobal('fetch', mockFetch(400, { message: 'Email is already verified' }));
    expect((await resendVerificationEmail('ada@gmail.com')).status).toBe('already-verified');
  });

  it('reports the backend throttle (3 per hour) as rate-limited', async () => {
    vi.stubGlobal('fetch', mockFetch(429, { message: 'ThrottlerException: Too Many Requests' }));
    const result = await resendVerificationEmail('ada@gmail.com');
    expect(result.status).toBe('rate-limited');
    expect(result.message).toMatch(/wait/i);
  });

  it('never reports a server failure as a success, and does not echo internals', async () => {
    vi.stubGlobal('fetch', mockFetch(500, { message: 'getaddrinfo ENOTFOUND smtp-internal' }));
    const result = await resendVerificationEmail('ada@gmail.com');
    expect(result.status).toBe('error');
    expect(result.message).not.toMatch(/ENOTFOUND/);
  });

  it('surfaces a network failure instead of swallowing it', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('Failed to fetch');
      }),
    );
    expect((await resendVerificationEmail('ada@gmail.com')).status).toBe('error');
  });

  it('refuses an empty address without calling the API', async () => {
    const fetchMock = mockFetch(200, {});
    vi.stubGlobal('fetch', fetchMock);
    const result = await resendVerificationEmail('   ');
    expect(result.status).toBe('error');
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
