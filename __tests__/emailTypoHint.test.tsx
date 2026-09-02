// __tests__/emailTypoHint.test.tsx
//
// Registration triage (2026-09): a ticket claimed non-Gmail domains could not
// register. 600 real sends said otherwise — the only repeated bounce was
// `gamil.com`. These lock the two halves of the fix at the signup form: the
// hint appears for a near-miss, and it never stands between anyone and submit.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const push = vi.fn();
let searchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => searchParams,
}));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />,
}));
vi.mock('@/lib/firebase', () => ({ auth: {}, googleProvider: {} }));
vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signInWithRedirect: vi.fn(),
  getRedirectResult: vi.fn(async () => null),
}));
vi.mock('@/components/providers/SettingsProvider', () => ({
  useSettings: () => ({ settings: null, isLoading: false }),
}));
vi.mock('@/lib/analytics/metaPixel', () => ({ trackLead: vi.fn() }));

import LoginPage from '@/app/login/page';

type FetchCall = { url: string; body: Record<string, unknown> | null };

function stubFetch() {
  const calls: FetchCall[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });
      if (url.startsWith('/api/home')) {
        return { ok: false, status: 500, json: async () => ({}) } as Response;
      }
      return {
        ok: true,
        status: 201,
        json: async () => ({ statusCode: 201, data: { needsEmailVerification: true } }),
      } as Response;
    }),
  );
  return calls;
}

function registerBody(calls: FetchCall[]) {
  return calls.find(call => call.url.startsWith('/api/auth/register'))?.body ?? null;
}

async function fillSignup(user: ReturnType<typeof userEvent.setup>, email: string) {
  await user.type(screen.getByPlaceholderText('you@example.com'), email);
  const passwords = screen.getAllByPlaceholderText('••••••••');
  await user.type(passwords[0], 'Password1!');
  await user.type(passwords[1], 'Password1!');
  await user.click(screen.getAllByRole('checkbox')[0]);
}

describe('signup email typo hint', () => {
  beforeEach(() => {
    searchParams = new URLSearchParams('mode=signup');
    push.mockClear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('suggests the intended provider on blur and rewrites the field when accepted', async () => {
    stubFetch();
    const user = userEvent.setup();
    render(<LoginPage />);

    const email = screen.getByPlaceholderText('you@example.com');
    await user.type(email, 'ada@gamil.com');
    expect(screen.queryByRole('button', { name: 'ada@gmail.com' })).not.toBeInTheDocument();

    await user.tab();
    const suggestion = await screen.findByRole('button', { name: 'ada@gmail.com' });
    await user.click(suggestion);

    expect(email).toHaveValue('ada@gmail.com');
    expect(screen.queryByRole('button', { name: 'ada@gmail.com' })).not.toBeInTheDocument();
  });

  it('is reachable and dismissible by keyboard alone', async () => {
    stubFetch();
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText('you@example.com'), 'ada@gamil.com');
    await user.tab();
    await screen.findByRole('button', { name: 'ada@gmail.com' });

    const dismiss = screen.getByRole('button', { name: /dismiss email suggestion/i });
    dismiss.focus();
    await user.keyboard('{Enter}');

    expect(screen.queryByRole('button', { name: 'ada@gmail.com' })).not.toBeInTheDocument();
  });

  it('never blocks submission of the typed address — the hint is advice only', async () => {
    const calls = stubFetch();
    const user = userEvent.setup();
    render(<LoginPage />);

    await fillSignup(user, 'ada@gamil.com');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    expect(registerBody(calls)).toMatchObject({ email: 'ada@gamil.com' });
  });

  // The false report that started this work. A university domain must be silent.
  it.each(['student@iiu.edu.pk', 'student@tsue.uz', 'ada@gmail.com'])(
    'stays silent for %s',
    async address => {
      stubFetch();
      const user = userEvent.setup();
      render(<LoginPage />);

      await user.type(screen.getByPlaceholderText('you@example.com'), address);
      await user.tab();

      expect(screen.queryByText(/did you mean/i)).not.toBeInTheDocument();
    },
  );
});
