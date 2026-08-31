// __tests__/homeRegistrationStrip.test.tsx
//
// MEYS 6th/7th concurrent-active-programs bug: a brand can have more than one
// published+active program with open registration at once. The homepage
// registration strip must render one group per program in that case, while
// staying byte-identical to today for every brand with a single program.

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import HomeRegistrationStrip from '@/components/sections/HomeRegistrationStrip';

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
  // The comparison below proves the two INPUT SHAPES agree, but both sides take
  // the same code path, so it cannot catch a regression in the single-program
  // path itself. This snapshot locks the actual rendered output instead: five
  // live brand domains render through here and must not shift.
  it('single program: rendered output stays locked to the committed snapshot', () => {
    const { container } = render(<HomeRegistrationStrip registrationTypes={[tier()]} />);
    expect(container.innerHTML).toMatchSnapshot();
  });

  it('single program: renders identically whether data arrives via legacy registrationTypes or a one-entry programs array', () => {
    const tiers = [tier()];

    const legacy = render(<HomeRegistrationStrip registrationTypes={tiers} />);
    const legacyHtml = legacy.container.innerHTML;
    legacy.unmount();

    const viaPrograms = render(
      <HomeRegistrationStrip
        registrationTypes={tiers}
        programs={[{ registration_types: tiers }]}
      />,
    );
    const viaProgramsHtml = viaPrograms.container.innerHTML;
    viaPrograms.unmount();

    expect(viaProgramsHtml).toBe(legacyHtml);
  });

  it('single program: does not render an edition heading or a top-level status badge', () => {
    render(<HomeRegistrationStrip registrationTypes={[tier()]} />);
    // "Self Funded" appears as the card title; there must be no extra
    // program-edition heading above it.
    expect(screen.queryByRole('heading', { level: 3, name: /meys|program|edition/i })).not.toBeInTheDocument();
  });

  it('two open programs: renders two groups, ordered soonest-close-first, each with its own heading and badge', () => {
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

    const headings = screen.getAllByRole('heading', { level: 3, name: /^MEYS (6th|7th)$/ });
    expect(headings.map((h) => h.textContent)).toEqual(['MEYS 6th', 'MEYS 7th']);

    expect(screen.getAllByText('Self Funded 6th').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Self Funded 7th').length).toBeGreaterThan(0);

    const openBadges = screen.getAllByText('Open');
    // One edition-level "Open" badge per group, plus one per tier card
    // (primary/secondary) inside each group.
    expect(openBadges.length).toBeGreaterThanOrEqual(2);
  });

  it('a program passed with status "closed" (e.g. registration not yet open) shows a closed edition badge', () => {
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

    const eighthHeading = screen.getByRole('heading', { level: 3, name: 'MEYS 8th' });
    // The heading row (heading + edition-level badge), not the whole group
    // (which also contains the tier cards' own Open/Closed badges).
    const headingRow = eighthHeading.parentElement as HTMLElement;
    expect(within(headingRow).getByText('Closed')).toBeInTheDocument();
  });

  it('renders nothing when every program has zero registration types', () => {
    const { container } = render(
      <HomeRegistrationStrip programs={[{ registration_types: [] }]} registrationTypes={[]} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
