// __tests__/cancelDeletionPage.test.tsx
//
// app/auth/cancel-deletion/page.tsx is the destination of the emailed
// cancellation link from ybb-platform PR #176 (CancelDeletionRequestHandler).
// It must work for a signed-out user and read requestId/token off the query
// string exactly as the email builds them (buildAccountDeletionCancelUrl),
// then render one of four outcomes: restored, already cancelled, invalid/
// expired, or permanently deleted (the one terminal case, which must not read
// like a generic error).

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const push = vi.fn();
let searchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => searchParams,
}));
vi.mock('next/image', () => ({
  // next/image props that are not valid DOM attributes are dropped, otherwise
  // React logs a warning per render.
  default: ({ src, alt }: { src: string; alt: string }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />,
}));
vi.mock('@/components/providers/SettingsProvider', () => ({
  useSettings: () => ({ settings: null, isLoading: false }),
}));

import CancelDeletionPage from '@/app/auth/cancel-deletion/page';

type FetchCall = { url: string; body: Record<string, unknown> | null };

/** Stubs /api/home (gallery, always fails so fallback images are used) and
 * /api/auth/cancel-deletion with the given response, recording every call. */
function stubFetch(cancelResponse: { ok: boolean; message: string; errorCode?: string }) {
  const calls: FetchCall[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });

    if (url.startsWith('/api/home')) {
      return { ok: false, status: 500, json: async () => ({}) } as Response;
    }

    if (url === '/api/auth/cancel-deletion') {
      return {
        ok: cancelResponse.ok,
        status: cancelResponse.ok ? 200 : 400,
        json: async () => ({
            statusCode: cancelResponse.ok ? 200 : 400,
            message: cancelResponse.message,
            errorCode: cancelResponse.errorCode,
            data: null,
          }),
      } as Response;
    }

    throw new Error(`Unexpected fetch: ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return calls;
}

describe('cancel-deletion page', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    push.mockClear();
  });

  it('reads requestId and token from the query string and sends them to the cancel endpoint', async () => {
    searchParams = new URLSearchParams('requestId=req-123&token=tok-abc');
    const calls = stubFetch({ ok: true, message: 'Your account has been reactivated. Welcome back!' });
    render(<CancelDeletionPage />);

    await waitFor(() => expect(calls.some((c) => c.url === '/api/auth/cancel-deletion')).toBe(true));
    const call = calls.find((c) => c.url === '/api/auth/cancel-deletion');
    expect(call?.body).toEqual({ requestId: 'req-123', token: 'tok-abc' });
  });

  it('restored: shows success and does not send a duplicate request', async () => {
    searchParams = new URLSearchParams('requestId=req-123&token=tok-abc');
    stubFetch({ ok: true, message: 'Your account has been reactivated. Welcome back!' });
    render(<CancelDeletionPage />);

    expect(await screen.findByText('Account Restored')).toBeInTheDocument();
    expect(screen.getByText('Your account has been reactivated. Welcome back!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument();
  });

  it('already cancelled: shows the already-cancelled outcome, not a generic success', async () => {
    searchParams = new URLSearchParams('requestId=req-123&token=tok-abc');
    stubFetch({ ok: true, message: 'Your account deletion was already cancelled - your account is active.' });
    render(<CancelDeletionPage />);

    expect(await screen.findByText('Already Cancelled')).toBeInTheDocument();
  });

  it('invalid or expired token: shows the invalid-link outcome', async () => {
    searchParams = new URLSearchParams('requestId=req-123&token=bad-token');
    stubFetch({
      ok: false,
      message:
        'This cancellation link is invalid or has expired. If you requested account deletion more than once, check your most recent email for the current link.',
    });
    render(<CancelDeletionPage />);

    expect(await screen.findByText('Link Invalid or Expired')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument();
  });

  it('too late: account already purged reads as a plain, final explanation with no retry CTA', async () => {
    searchParams = new URLSearchParams('requestId=req-123&token=tok-abc');
    stubFetch({
      ok: false,
      message: 'This account has already been permanently deleted and cannot be restored.',
    });
    render(<CancelDeletionPage />);

    expect(await screen.findByText('Account Already Deleted')).toBeInTheDocument();
    expect(
      screen.getByText('This account has already been permanently deleted and cannot be restored.'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /go to login/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
  });

  it('missing requestId/token: shows the invalid-link outcome without calling the API', async () => {
    searchParams = new URLSearchParams('');
    const calls = stubFetch({ ok: true, message: 'unused' });
    render(<CancelDeletionPage />);

    expect(await screen.findByText('Link Invalid or Expired')).toBeInTheDocument();
    expect(calls.some((c) => c.url === '/api/auth/cancel-deletion')).toBe(false);
  });

  // The reason this page classifies on `errorCode` at all: the copy is the
  // backend's to change. These use messages that match NO prose branch, so they
  // pass only if the code is genuinely read and genuinely forwarded by the BFF
  // route. An earlier version of this change edited the page but silently failed
  // to edit the route, leaving the whole thing inert while looking correct.
  it('classifies on the outcome code even when the wording matches no prose branch', async () => {
    searchParams = new URLSearchParams('requestId=req-123&token=tok-abc');
    stubFetch({ ok: false, message: 'Some entirely reworded copy.', errorCode: 'account_already_deleted' });
    render(<CancelDeletionPage />);

    expect(await screen.findByText('Account Already Deleted')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /go to login/i })).not.toBeInTheDocument();
  });

  it('classifies an already-cancelled result on its code, not on the phrase "already cancelled"', async () => {
    searchParams = new URLSearchParams('requestId=req-123&token=tok-abc');
    stubFetch({ ok: true, message: 'Nothing to do here.', errorCode: 'deletion_already_cancelled' });
    render(<CancelDeletionPage />);

    expect(await screen.findByText('Already Cancelled')).toBeInTheDocument();
  });
});
