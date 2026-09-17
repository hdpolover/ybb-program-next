// @vitest-environment node
//
// __tests__/signedCopyUploadRoute.test.ts
//
// Node, not the suite's default jsdom: this route reads a multipart body via
// request.formData(), and jsdom's Request cannot produce one - the handler
// throws before it ever reaches fetch, so every assertion here failed against
// a 500 that had nothing to do with the code under test. The sibling
// cancelDeletionRoute test gets away with jsdom only because it posts JSON.
//
// The agreement-letter upload proxy had no deadline, so a stalled API left the
// participant's upload button spinning forever with no error and no way to tell
// whether the file had been saved. That is the shape the "tidak bisa upload
// agreement letter" reports took: not a rejection, an absence of any outcome.
//
// These pin the two halves that have to stay true together: a hang becomes a
// definite, readable failure, AND that new catch does not swallow ordinary
// upstream errors into the same generic message.
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/server/envContext', () => ({
  resolveBrandDomainFromRequest: () => 'middleeastyouthsummit.com',
}));
vi.mock('@/lib/server/apiBaseUrl', () => ({
  getServerApiBaseUrl: () => 'http://api.internal',
}));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => ({ value: 'access-token' }) }),
}));

import { POST } from '@/app/api/portal/documents/[documentId]/signed-copy/route';

function req() {
  const form = new FormData();
  form.append('file', new Blob(['signed'], { type: 'application/pdf' }), 'signed.pdf');
  return new Request('http://localhost/api/portal/documents/doc-1/signed-copy', {
    method: 'POST',
    body: form,
  });
}

const params = Promise.resolve({ documentId: 'doc-1' });

function call() {
  // The handler is typed for NextRequest but only uses Request behaviour here.
  return POST(req() as never, { params });
}

describe('signed-copy upload BFF route', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('turns a hung upstream into a 504 that says the file was not saved', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        // What AbortSignal.timeout produces when the deadline passes.
        const err = new Error('The operation was aborted due to timeout');
        err.name = 'TimeoutError';
        throw err;
      }) as unknown as typeof fetch,
    );

    const res = await call();
    const body = await res.json();

    expect(res.status).toBe(504);
    // The participant must be told the upload did NOT land - an ambiguous
    // "something went wrong" leaves them unsure whether to re-upload.
    expect(body.message).toMatch(/not saved/i);
  });

  it('passes a deadline to fetch rather than waiting forever', async () => {
    const spy = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ data: null }) }));
    vi.stubGlobal('fetch', spy as unknown as typeof fetch);

    await call();

    expect(spy).toHaveBeenCalledTimes(1);
    const init = spy.mock.calls[0][1] as RequestInit;
    expect(init.signal).toBeDefined();
  });

  it('still forwards an ordinary upstream rejection with its own status and reason', async () => {
    // The file service rejects unsupported types; that reason is the actionable
    // one and must not be flattened into the timeout message.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 400,
        json: async () => ({
          statusCode: 400,
          message: 'File type application/zip not allowed. Allowed types: application/pdf',
        }),
      })) as unknown as typeof fetch,
    );

    const res = await call();
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.message).toMatch(/application\/zip not allowed/);
  });

  it('refuses an oversized upload from Content-Length with a readable 413, without reading the body', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);
    const formData = vi.fn(async () => new FormData());
    // A stand-in rather than a real Request: undici computes Content-Length
    // from the body, and the point here is a header that promises 25 MB.
    const oversized = {
      headers: new Headers({
        'content-type': 'multipart/form-data; boundary=x',
        'content-length': String(25 * 1024 * 1024),
      }),
      formData,
    };

    const res = await POST(oversized as never, { params });
    const body = await res.json();

    expect(res.status).toBe(413);
    expect(body.message).toMatch(/larger than 10 MB/);
    expect(formData).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('turns a broken or truncated multipart body into a 400 that says to retry, not a 500', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);
    // What arrives when the connection drops mid-upload, or when the body is
    // cut short before the route: a multipart header with no closing boundary.
    const truncated = new Request('http://localhost/api/portal/documents/doc-1/signed-copy', {
      method: 'POST',
      headers: { 'content-type': 'multipart/form-data; boundary=----abc' },
      body: '------abc\r\nContent-Disposition: form-data; name="file"; filename="signed.pdf"\r\nContent-Type: application/pdf\r\n\r\n%PDF-1.4 partial',
    });

    const res = await POST(truncated as never, { params });
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.message).toMatch(/did not arrive completely/i);
    expect(body.message).toMatch(/not saved/i);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("replaces the API's terse multer 413 with the limit and what to do", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 413,
        json: async () => ({ statusCode: 413, message: 'File too large' }),
      })) as unknown as typeof fetch,
    );

    const res = await call();
    const body = await res.json();

    expect(res.status).toBe(413);
    expect(body.message).toMatch(/larger than 10 MB/);
  });
});
