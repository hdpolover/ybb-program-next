// __tests__/joinProgramRoute.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

let accessToken: string | undefined = 'tok';
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: (n: string) => (n === 'accessToken' && accessToken ? { value: accessToken } : undefined) }),
}));
vi.mock('@/lib/server/envContext', () => ({ resolveBrandDomainFromRequest: () => 'example.com' }));
vi.mock('@/lib/server/apiBaseUrl', () => ({ getServerApiBaseUrl: () => 'http://api.internal' }));

import { POST } from '@/app/api/portal/join-program/route';

const req = (body: unknown) =>
  new Request('http://localhost/api/portal/join-program', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

function mockBackend(status: number, payload: unknown) {
  const fetchMock = vi.fn(async () => ({ ok: status < 400, status, json: async () => payload }));
  vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);
  return fetchMock;
}

describe('join-program BFF route', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    accessToken = 'tok';
  });

  it('rejects a missing token without calling the backend', async () => {
    accessToken = undefined;
    const fetchMock = mockBackend(200, {});
    expect((await POST(req({ programId: 'p1' }))).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([{}, { programId: '' }, { programId: '   ' }, { programId: 5 }])('rejects invalid body %j', async (body) => {
    const fetchMock = mockBackend(200, {});
    expect((await POST(req(body))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('forwards programId with bearer token to the join endpoint', async () => {
    const fetchMock = mockBackend(200, { data: { status: 'created', programId: 'p1', programName: 'JYS 5th' } });
    const res = await POST(req({ programId: ' p1 ' }));
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, { body: string; headers: Record<string, string> }];
    expect(url).toBe('http://api.internal/v1/portal/programs/join');
    expect(JSON.parse(init.body)).toEqual({ programId: 'p1' });
    expect(init.headers.Authorization).toBe('Bearer tok');
    expect((await res.json()).data.status).toBe('created');
  });

  it('passes an unwrapped backend payload through as data', async () => {
    mockBackend(200, { status: 'existing', programId: 'p1', programName: 'JYS 5th' });
    expect((await (await POST(req({ programId: 'p1' }))).json()).data.status).toBe('existing');
  });

  it('maps backend errors, keeping status and errorCode', async () => {
    mockBackend(403, { statusCode: 403, message: 'nope', errorCode: 'X' });
    const res = await POST(req({ programId: 'p1' }));
    expect(res.status).toBe(403);
    expect(await res.json()).toMatchObject({ message: 'nope', errorCode: 'X' });
  });
});
