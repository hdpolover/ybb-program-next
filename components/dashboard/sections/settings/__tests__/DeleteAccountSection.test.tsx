// components/dashboard/sections/settings/__tests__/DeleteAccountSection.test.tsx
//
// Account deletion (ybb-platform PR #176) deactivates the account on the very
// first successful call, so the confirm gate has to be real — an accidental
// click here is not reversible from inside the dashboard. These lock: the
// confirm button stays disabled until "DELETE" is typed exactly, a successful
// request signs the user out and hands the returned consequences to the
// landing page via the URL, and a failed request (e.g. a request already in
// progress) leaves the account alone and shows the error inline.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), refresh: vi.fn() }),
}));

import DeleteAccountSection from '@/components/dashboard/sections/settings/DeleteAccountSection';

type FetchCall = { url: string; body: Record<string, unknown> | null };

function stubFetch(deletionRequestResponse: { ok: boolean; status: number; body: unknown }) {
  const calls: FetchCall[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });

    if (url === '/api/auth/deletion-request') {
      return {
        ok: deletionRequestResponse.ok,
        status: deletionRequestResponse.status,
        json: async () => deletionRequestResponse.body,
      } as Response;
    }

    if (url === '/api/auth/logout') {
      return { ok: true, status: 200, json: async () => ({ statusCode: 200, message: 'Success', data: null }) } as Response;
    }

    throw new Error(`Unexpected fetch: ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return calls;
}

describe('DeleteAccountSection', () => {
  beforeEach(() => {
    push.mockClear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not show the confirmation input until "Delete My Account" is clicked', () => {
    stubFetch({ ok: true, status: 201, body: {} });
    render(<DeleteAccountSection />);
    expect(screen.queryByRole('button', { name: /permanently delete my account/i })).not.toBeInTheDocument();
  });

  it('keeps the confirm button disabled until the exact phrase "DELETE" is typed', async () => {
    stubFetch({ ok: true, status: 201, body: {} });
    const user = userEvent.setup();
    render(<DeleteAccountSection />);

    await user.click(screen.getByRole('button', { name: /^delete my account$/i }));
    const confirmButton = screen.getByRole('button', { name: /permanently delete my account/i });
    expect(confirmButton).toBeDisabled();

    const input = screen.getByLabelText(/type delete to confirm account deletion/i);
    await user.type(input, 'delete');
    expect(confirmButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, 'DELETE');
    expect(confirmButton).toBeEnabled();
  });

  it('on success: signs out, then redirects with the returned consequences in the query string', async () => {
    const calls = stubFetch({
      ok: true,
      status: 201,
      body: {
        statusCode: 201,
        message: 'Success',
        data: {
          id: 'req-1',
          userId: 'user-1',
          status: 'approved',
          createdAt: '2026-09-04T00:00:00.000Z',
          scheduledDeletionDate: '2026-10-04T00:00:00.000Z',
          consequences: {
            hasPaidInvoice: true,
            paidInvoiceCount: 2,
            hasNonDraftApplication: true,
            nonDraftApplicationCount: 1,
          },
        },
      },
    });

    const user = userEvent.setup();
    render(<DeleteAccountSection />);

    await user.click(screen.getByRole('button', { name: /^delete my account$/i }));
    await user.type(screen.getByLabelText(/type delete to confirm account deletion/i), 'DELETE');
    await user.click(screen.getByRole('button', { name: /permanently delete my account/i }));

    await waitFor(() => expect(push).toHaveBeenCalled());

    expect(calls.some((c) => c.url === '/api/auth/deletion-request')).toBe(true);
    expect(calls.some((c) => c.url === '/api/auth/logout')).toBe(true);

    const destination = push.mock.calls[0][0] as string;
    expect(destination).toMatch(/^\/auth\/account-deletion-scheduled\?/);
    const params = new URLSearchParams(destination.split('?')[1]);
    expect(params.get('scheduledDeletionDate')).toBe('2026-10-04T00:00:00.000Z');
    expect(params.get('paidInvoiceCount')).toBe('2');
    expect(params.get('nonDraftApplicationCount')).toBe('1');
  });

  it('on failure: shows the error inline, does not sign out or navigate away', async () => {
    stubFetch({
      ok: false,
      status: 409,
      body: { statusCode: 409, message: 'You already have a deletion request in progress.', data: null },
    });

    const user = userEvent.setup();
    render(<DeleteAccountSection />);

    await user.click(screen.getByRole('button', { name: /^delete my account$/i }));
    await user.type(screen.getByLabelText(/type delete to confirm account deletion/i), 'DELETE');
    await user.click(screen.getByRole('button', { name: /permanently delete my account/i }));

    expect(await screen.findByText(/already have a deletion request in progress/i)).toBeInTheDocument();
    expect(push).not.toHaveBeenCalled();
  });
});
