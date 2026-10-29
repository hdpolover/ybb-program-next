// components/dashboard/sections/settings/__tests__/MarketingEmailsPreference.test.tsx
//
// Marketing email consent is opt-in only: the switch must load as OFF by default,
// send exactly { marketingEmails: <boolean> } when flipped, and never show "on"
// unless the API confirmed it.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { toast } from 'sonner';
import MarketingEmailsPreference from '@/components/dashboard/sections/settings/MarketingEmailsPreference';

function stubFetch(initial: boolean, postResult: { ok: boolean; marketingEmails?: boolean }) {
  const posts: unknown[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: string, init?: RequestInit) => {
      if (init?.method === 'POST') {
        posts.push(JSON.parse(String(init.body)));
        return {
          ok: postResult.ok,
          status: postResult.ok ? 200 : 500,
          json: async () => ({ statusCode: 200, data: { marketingEmails: postResult.marketingEmails } }),
        } as Response;
      }
      return { ok: true, status: 200, json: async () => ({ statusCode: 200, data: { marketingEmails: initial } }) } as Response;
    }),
  );
  return posts;
}

describe('MarketingEmailsPreference', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it('renders the switch off when the stored value is false', async () => {
    stubFetch(false, { ok: true, marketingEmails: true });
    render(<MarketingEmailsPreference />);

    const toggle = await screen.findByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('opts in by posting only marketingEmails and reflects the confirmed value', async () => {
    const posts = stubFetch(false, { ok: true, marketingEmails: true });
    render(<MarketingEmailsPreference />);

    await userEvent.click(await screen.findByRole('switch'));

    await waitFor(() => expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true'));
    expect(posts).toEqual([{ marketingEmails: true }]);
  });

  it('opts out when currently on', async () => {
    const posts = stubFetch(true, { ok: true, marketingEmails: false });
    render(<MarketingEmailsPreference />);

    await userEvent.click(await screen.findByRole('switch'));

    await waitFor(() => expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false'));
    expect(posts).toEqual([{ marketingEmails: false }]);
  });

  it('stays off and shows an error when saving fails', async () => {
    stubFetch(false, { ok: false });
    render(<MarketingEmailsPreference />);

    await userEvent.click(await screen.findByRole('switch'));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });
});
