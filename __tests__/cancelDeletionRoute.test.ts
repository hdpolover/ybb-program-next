// __tests__/cancelDeletionRoute.test.ts
//
// This file exists because of a specific near-miss: the cancel PAGE was changed
// to classify on the API's outcome code while the BFF route that proxies to that
// API was, silently, not changed to forward it. The page tests still passed —
// they stub /api/auth/cancel-deletion directly, so they never exercise this
// route at all — and the whole change was inert while looking correct.
//
// So these assert the one thing those tests structurally cannot: that the code
// survives the hop through this route, on BOTH the success and the failure path.
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/server/envContext', () => ({
  resolveBrandDomainFromRequest: () => 'example.com',
}));
vi.mock('@/lib/server/apiBaseUrl', () => ({
  getServerApiBaseUrl: () => 'http://api.internal',
}));
vi.mock('@/lib/server/bffSecurity', () => ({
  getCsrfGuardRejection: () => null,
}));
vi.mock('@/lib/server/forwardedFor', () => ({
  forwardedForHeader: () => ({}),
}));

import { POST } from '@/app/api/auth/cancel-deletion/route';

function req(body: unknown) {
  return new Request('http://localhost/api/auth/cancel-deletion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('cancel-deletion BFF route', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('forwards the API errorCode on a failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 400,
        json: async () => ({
          statusCode: 400,
          message: 'This account has already been permanently deleted and cannot be restored.',
          errorCode: 'account_already_deleted',
        }),
      })) as unknown as typeof fetch,
    );

    const body = await (await POST(req({ requestId: 'r1', token: 't1' }))).json();
    expect(body.errorCode).toBe('account_already_deleted');
  });

  it('surfaces the code nested under data on a success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        status: 200,
        json: async () => ({
          statusCode: 200,
          data: { code: 'deletion_already_cancelled', message: 'Already cancelled.' },
        }),
      })) as unknown as typeof fetch,
    );

    const body = await (await POST(req({ requestId: 'r1', token: 't1' }))).json();
    expect(body.errorCode).toBe('deletion_already_cancelled');
  });
});
