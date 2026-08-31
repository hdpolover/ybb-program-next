// __tests__/homeRegistrationStrip.test.tsx
//
// MEYS 6th/7th concurrent-active-programs bug: a brand can have more than one
// published+active program with open registration at once. The homepage
// registration strip renders ONE edition at a time behind a tab bar in that
// case (its own cards, guidelines and Instagram feed), while staying
// byte-identical to today for every brand with a single program.

import { describe, it, expect } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import HomeRegistrationStrip from '@/components/sections/HomeRegistrationStrip';
import { pickDefaultEditionIndex } from '@/lib/registration/edition';

function tier(overrides: Partial<{
  id: string;
  name: string;
  price: string;
  currency: string;
  fee_type: string;
  allowed_categories: string[];
  benefits: string[];
  validity_periods: { start_date: string; end_date: string }[];
}> = {}) {
  return {
    id: 'tier-1',
    name: 'Self Funded',
    price: '15.00',
    currency: 'USD',
    fee_type: 'registration_fee',
    allowed_categories: ['self_funded'],
    benefits: ['Guaranteed participation'],
    validity_periods: [{ start_date: '2026-01-01T00:00:00.000Z', end_date: '2026-12-05T00:00:00.000Z' }],
    ...overrides,
  };
}

describe('HomeRegistrationStrip', () => {
  // Locks what a single-edition brand actually renders. Five other live brand
  // domains go through here. The fixture uses the PRODUCTION shape (a one entry
  // `programs` array), because the API always sends it: a snapshot of the legacy
  // registrationTypes-only shape would guard a path nothing in production takes.
  it('single edition: rendered output stays locked to the committed snapshot', () => {
    const { container } = render(
      <HomeRegistrationStrip
        registrationTypes={[tier()]}
        programs={
          [
            {
              program_name: 'Solo Program',
              status: 'open',
              registration_dates: {
                open: '2026-01-01T00:00:00.000Z',
                close: '2026-12-05T00:00:00.000Z',
              },
              registration_types: [tier()],
            },
          ] as never
        }
      />,
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  it('single program: does not render an edition heading, a top-level status badge, or a tab bar', () => {
    render(<HomeRegistrationStrip registrationTypes={[tier()]} />);
    // "Self Funded" appears as the card title; there must be no extra
    // program-edition heading above it.
    expect(screen.queryByRole('heading', { level: 3, name: /meys|program|edition/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('one entry in the `programs` array: still no tab bar (tabs only appear for 2+ editions)', () => {
    render(<HomeRegistrationStrip programs={[{ registration_types: [tier()] }]} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('two open programs: renders a tab bar and only the selected edition\'s cards, guidelines and feed', () => {
    render(
      <HomeRegistrationStrip
        programs={[
          {
            program_id: 'p-6th',
            program_name: 'MEYS 6th',
            status: 'open',
            registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-12-05T00:00:00.000Z' },
            registration_types: [tier({ id: 't-6th', name: 'Self Funded 6th' })],
            guidelines: [{ id: 'g-6th', title: '6th Guidebook', type: 'pdf', url: 'guide-6th.pdf' }],
            ig_feed: [{ id: 'feed-6th', permalink: 'https://instagram.com/p/6th' }],
          },
          {
            program_id: 'p-7th',
            program_name: 'MEYS 7th',
            status: 'open',
            registration_dates: { open: '2026-06-01T00:00:00.000Z', close: '2027-03-20T00:00:00.000Z' },
            registration_types: [tier({ id: 't-7th', name: 'Self Funded 7th' })],
            guidelines: [{ id: 'g-7th', title: '7th Guidebook', type: 'pdf', url: 'guide-7th.pdf' }],
            ig_feed: [{ id: 'feed-7th', permalink: 'https://instagram.com/p/7th' }],
          },
        ]}
      />,
    );

    // Tab bar lists both editions.
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(['MEYS 6th', 'MEYS 7th']);

    // Only the selected (default: soonest-closing open, i.e. 6th) edition's
    // content renders — not both stacked.
    expect(screen.getAllByText('Self Funded 6th').length).toBeGreaterThan(0);
    expect(screen.queryByText('Self Funded 7th')).not.toBeInTheDocument();
    expect(screen.getByText('6th Guidebook')).toBeInTheDocument();
    expect(screen.queryByText('7th Guidebook')).not.toBeInTheDocument();
  });

  it('defaults the selected tab to the soonest-closing OPEN edition, not just the first entry', () => {
    render(
      <HomeRegistrationStrip
        programs={[
          // Listed first but NOT open (registration hasn't started yet) —
          // the default selection must skip it.
          {
            program_id: 'p-8th',
            program_name: 'MEYS 8th',
            status: 'closed',
            registration_dates: { open: '2027-06-01T00:00:00.000Z', close: '2028-03-20T00:00:00.000Z' },
            registration_types: [tier({ id: 't-8th', name: 'Self Funded 8th' })],
          },
          {
            program_id: 'p-7th',
            program_name: 'MEYS 7th',
            status: 'open',
            registration_dates: { open: '2026-06-01T00:00:00.000Z', close: '2027-03-20T00:00:00.000Z' },
            registration_types: [tier({ id: 't-7th', name: 'Self Funded 7th' })],
          },
        ]}
      />,
    );

    expect(screen.getByRole('tab', { name: 'MEYS 7th' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'MEYS 8th' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getAllByText('Self Funded 7th').length).toBeGreaterThan(0);
    expect(screen.queryByText('Self Funded 8th')).not.toBeInTheDocument();
  });

  it('clicking a tab swaps the displayed edition, and each tab is keyboard-focusable', () => {
    render(
      <HomeRegistrationStrip
        programs={[
          {
            program_id: 'p-6th',
            program_name: 'MEYS 6th',
            status: 'open',
            registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-12-05T00:00:00.000Z' },
            registration_types: [tier({ id: 't-6th', name: 'Self Funded 6th' })],
          },
          {
            program_id: 'p-7th',
            program_name: 'MEYS 7th',
            status: 'open',
            registration_dates: { open: '2026-06-01T00:00:00.000Z', close: '2027-03-20T00:00:00.000Z' },
            registration_types: [tier({ id: 't-7th', name: 'Self Funded 7th' })],
          },
        ]}
      />,
    );

    const seventhTab = screen.getByRole('tab', { name: 'MEYS 7th' });
    expect(seventhTab.tagName).toBe('BUTTON'); // real button: keyboard-operable by default
    seventhTab.focus();
    expect(seventhTab).toHaveFocus();

    fireEvent.click(seventhTab);

    expect(seventhTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText('Self Funded 7th').length).toBeGreaterThan(0);
    expect(screen.queryByText('Self Funded 6th')).not.toBeInTheDocument();
  });

  it('a program passed with status "closed" (e.g. registration not yet open) shows a closed edition badge once selected', () => {
    render(
      <HomeRegistrationStrip
        programs={[
          {
            program_id: 'p-6th',
            program_name: 'MEYS 6th',
            status: 'open',
            registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-12-05T00:00:00.000Z' },
            registration_types: [tier({ id: 't-6th' })],
          },
          {
            program_id: 'p-8th',
            program_name: 'MEYS 8th',
            status: 'closed',
            registration_dates: { open: '2027-06-01T00:00:00.000Z', close: '2028-03-20T00:00:00.000Z' },
            registration_types: [],
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'MEYS 8th' }));

    const eighthHeading = screen.getByRole('heading', { level: 3, name: 'MEYS 8th' });
    // The heading row (heading + edition-level badge), not the whole group.
    const headingRow = eighthHeading.parentElement as HTMLElement;
    expect(within(headingRow).getByText('Closed')).toBeInTheDocument();
  });

  it('renders nothing when every program has zero registration types', () => {
    const { container } = render(
      <HomeRegistrationStrip programs={[{ registration_types: [] }]} registrationTypes={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  describe('per-card "closes in" countdown', () => {
    // The countdown exists to disambiguate a brand showing several editions.
    // A single-edition brand keeps the layout it has today, so these fixtures
    // deliberately carry TWO editions.
    it('shows a countdown on a card whose validity window is currently open', () => {
      render(
        <HomeRegistrationStrip
          programs={[
            {
              program_name: 'Edition A',
              status: 'open',
              registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-12-05T00:00:00.000Z' },
              registration_types: [
                tier({ validity_periods: [{ start_date: '2026-01-01T00:00:00.000Z', end_date: '2026-12-05T00:00:00.000Z' }] }),
              ],
            },
            {
              program_name: 'Edition B',
              status: 'open',
              registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2027-12-05T00:00:00.000Z' },
              registration_types: [tier()],
            },
          ]}
        />,
      );
      expect(screen.getByText(/^Closes in \d+ (day|hour)s?$/)).toBeInTheDocument();
    });

    it('shows no countdown for a single edition, which keeps the existing layout', () => {
      render(
        <HomeRegistrationStrip
          programs={[
            {
              program_name: 'Solo',
              status: 'open',
              registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-12-05T00:00:00.000Z' },
              registration_types: [
                tier({ validity_periods: [{ start_date: '2026-01-01T00:00:00.000Z', end_date: '2026-12-05T00:00:00.000Z' }] }),
              ],
            },
          ]}
        />,
      );
      expect(screen.queryByText(/^Closes in/)).not.toBeInTheDocument();
    });

    it('shows nothing when the card\'s window has already ended', () => {
      render(
        <HomeRegistrationStrip
          programs={[
            {
              // Mirrors MEYS 6th today: the program is still open, but this
              // tier's own pricing window has already ended.
              program_name: 'Edition A',
              status: 'open',
              registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-12-05T00:00:00.000Z' },
              registration_types: [
                tier({ validity_periods: [{ start_date: '2020-01-01T00:00:00.000Z', end_date: '2020-02-01T00:00:00.000Z' }] }),
              ],
            },
            // A second edition, so the countdown path is actually reached and
            // this asserts "the window ended", not "there is only one edition".
            {
              program_name: 'Edition B',
              status: 'open',
              registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2027-12-05T00:00:00.000Z' },
              registration_types: [tier()],
            },
          ]}
        />,
      );
      expect(screen.queryByText(/^Closes in/)).not.toBeInTheDocument();
    });

  });
});

describe('pickDefaultEditionIndex', () => {
  it('picks the running edition with the closest deadline', () => {
    // Editions arrive ordered soonest-close-first, so that is the first open one.
    expect(
      pickDefaultEditionIndex([
        { status: 'closed', year: 2026 },
        { status: 'open', year: 2027 },
        { status: 'open', year: 2028 },
      ]),
    ).toBe(1);
  });

  it('falls back to the newest edition when none is open', () => {
    expect(
      pickDefaultEditionIndex([
        { status: 'closed', year: 2026 },
        { status: 'closed', year: 2028 },
        { status: 'closed', year: 2027 },
      ]),
    ).toBe(1);
  });

  it('returns 0 for an empty list', () => {
    expect(pickDefaultEditionIndex([])).toBe(0);
  });
});
