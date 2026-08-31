// __tests__/signupEditionChoice.test.tsx
//
// MEYS 6th/7th incident (2026-08-30): the 7th edition was published for part
// of a day, and 872 signups that believed they were joining the 6th were
// silently assigned to the 7th, because signup picked the brand's newest open
// program and never showed which one. These lock the three cases: choose when
// there are several, name it when there is one, and never break signup when
// the editions cannot be loaded.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

const SIXTH = {
  program_id: 'p6',
  program_name: 'Middle East Youth Summit 6th',
  program_slug: 'meys-6th',
  year: 2026,
  status: 'open',
  registration_dates: { open: '2026-06-01T00:00:00.000Z', close: '2026-10-31T00:00:00.000Z' },
  program_dates: { start: '2026-12-01T00:00:00.000Z', end: '2026-12-05T00:00:00.000Z' },
  registration_types: [],
};

const SEVENTH = {
  program_id: 'p7',
  program_name: 'Middle East Youth Summit 7th',
  program_slug: 'meys-7th',
  year: 2027,
  status: 'open',
  registration_dates: { open: '2026-08-01T00:00:00.000Z', close: '2027-01-31T00:00:00.000Z' },
  program_dates: { start: '2027-03-10T00:00:00.000Z', end: '2027-03-14T00:00:00.000Z' },
  registration_types: [],
};

type FetchCall = { url: string; body: Record<string, unknown> | null };

/** Stubs /api/home with `editions` (or a failure when null) and records every
 * call, so a test can assert what /api/auth/register was actually sent. */
function stubFetch(editions: unknown[] | null) {
  const calls: FetchCall[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, body: init?.body ? JSON.parse(String(init.body)) : null });

    if (url.startsWith('/api/home')) {
      if (editions === null) return { ok: false, status: 500, json: async () => ({}) } as Response;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          data: { sections: [{ type: 'registration_overview', content: { programs: editions } }] },
        }),
      } as Response;
    }

    return {
      ok: true,
      status: 201,
      json: async () => ({ statusCode: 201, data: { needsEmailVerification: true } }),
    } as Response;
  });
  vi.stubGlobal('fetch', fetchMock);
  return calls;
}

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText('you@example.com'), 'someone@example.com');
  const passwords = screen.getAllByPlaceholderText('••••••••');
  await user.type(passwords[0], 'Password1!');
  await user.type(passwords[1], 'Password1!');
  // The terms checkbox is the only one in signup mode, and it carries no
  // accessible name of its own (pre-existing, not touched here).
  await user.click(screen.getAllByRole('checkbox')[0]);
  await user.click(screen.getByRole('button', { name: /create account/i }));
  return user;
}

function registerBody(calls: FetchCall[]) {
  return calls.find((call) => call.url.startsWith('/api/auth/register'))?.body ?? null;
}

describe('signup edition choice', () => {
  beforeEach(() => {
    searchParams = new URLSearchParams('mode=signup');
    push.mockClear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('two editions: renders a selector and submits the chosen programSlug', async () => {
    const calls = stubFetch([SIXTH, SEVENTH]);
    render(<LoginPage />);

    const radios = await screen.findAllByRole('radio');
    expect(radios).toHaveLength(2);
    expect(screen.getByText('Middle East Youth Summit 6th')).toBeInTheDocument();
    expect(screen.getByText('Middle East Youth Summit 7th')).toBeInTheDocument();
    // Enough context to tell the two apart, which is what was missing.
    expect(screen.getByText(/Event Dec 01, 2026 to Dec 05, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Registration closes 31 Oct 2026/)).toBeInTheDocument();

    // Default is the running edition with the closest deadline (the 6th).
    expect(radios[0]).toBeChecked();

    const user = userEvent.setup();
    await user.click(radios[1]);
    expect(radios[1]).toBeChecked();

    await fillAndSubmit();

    await waitFor(() => expect(registerBody(calls)).not.toBeNull());
    expect(registerBody(calls)).toMatchObject({
      email: 'someone@example.com',
      programSlug: 'meys-7th',
    });
  });

  it('?programSlug= preselects that edition and is what gets submitted', async () => {
    searchParams = new URLSearchParams('mode=signup&programSlug=meys-7th');
    const calls = stubFetch([SIXTH, SEVENTH]);
    render(<LoginPage />);

    const radios = await screen.findAllByRole('radio');
    await waitFor(() => expect(radios[1]).toBeChecked());
    expect(radios[0]).not.toBeChecked();

    await fillAndSubmit();
    await waitFor(() => expect(registerBody(calls)).not.toBeNull());
    expect(registerBody(calls)).toMatchObject({ programSlug: 'meys-7th' });
  });

  it('one edition: names the edition and renders no selector', async () => {
    const calls = stubFetch([SIXTH]);
    render(<LoginPage />);

    expect(
      await screen.findByText(/You are registering for/),
    ).toHaveTextContent('You are registering for Middle East Youth Summit 6th.');
    expect(screen.queryAllByRole('radio')).toHaveLength(0);

    await fillAndSubmit();
    await waitFor(() => expect(registerBody(calls)).not.toBeNull());
    expect(registerBody(calls)).toMatchObject({ programSlug: 'meys-6th' });
  });

  it('editions fetch failure: signup still works, server picks the program', async () => {
    const calls = stubFetch(null);
    render(<LoginPage />);

    await fillAndSubmit();

    await waitFor(() => expect(registerBody(calls)).not.toBeNull());
    const body = registerBody(calls) as Record<string, unknown>;
    expect(body).toMatchObject({ email: 'someone@example.com' });
    expect(body.programSlug).toBeUndefined();
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.queryByText(/You are registering for/)).not.toBeInTheDocument();
  });
});
