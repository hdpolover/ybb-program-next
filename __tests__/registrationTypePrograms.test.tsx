// __tests__/registrationTypePrograms.test.tsx
//
// MEYS 6th/7th concurrent-active-programs bug: the /programs page used to
// resolve and render only ONE program (newest by year), contradicting the
// sticky countdown banner which picks the soonest-closing open edition. The
// registration section now renders an edition tab bar mirroring
// HomeRegistrationStrip, defaulting to the same edition the banner names.
//
// The tab bar is a NAVIGATION (`/programs?edition=<slug>` links), not client
// state: the whole page is server-rendered per edition, so "selected" always
// follows `selectedEditionSlug` (the edition the SERVER actually rendered),
// never a click handler.

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RegistrationTypePrograms from '@/components/programs/registrationTypes';

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

describe('RegistrationTypePrograms (programs page)', () => {
  it('single edition: no tab bar', () => {
    render(<RegistrationTypePrograms pricingTiers={[tier()]} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('one entry in the `programs` array: still no tab bar', () => {
    render(
      <RegistrationTypePrograms
        programs={[{ status: 'open', registration_dates: { open: null, close: null }, registration_types: [tier()] } as never]}
      />,
    );
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('two editions: renders a tab bar of `/programs?edition=<slug>` links, defaulting to the closest-deadline edition', () => {
    render(
      <RegistrationTypePrograms
        programs={
          [
            {
              program_id: 'p-6th',
              program_name: 'MEYS 6th',
              program_slug: 'meys-6th',
              status: 'open',
              registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-11-30T00:00:00.000Z' },
              registration_types: [tier({ id: 't-6th', name: 'Self Funded 6th' })],
            },
            {
              program_id: 'p-7th',
              program_name: 'MEYS 7th',
              program_slug: 'meys-7th',
              status: 'open',
              registration_dates: { open: '2026-06-01T00:00:00.000Z', close: '2027-03-20T00:00:00.000Z' },
              registration_types: [tier({ id: 't-7th', name: 'Self Funded 7th' })],
            },
          ] as never
        }
      />,
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.textContent)).toEqual(['MEYS 6th', 'MEYS 7th']);
    expect(screen.getByRole('tab', { name: 'MEYS 6th' })).toHaveAttribute('href', '/programs?edition=meys-6th');
    expect(screen.getByRole('tab', { name: 'MEYS 7th' })).toHaveAttribute('href', '/programs?edition=meys-7th');

    // No `selectedEditionSlug` prop: falls back to the soonest-closing OPEN
    // edition (6th), matching the sticky countdown banner (home.strategy.ts
    // orders `programs` the same way).
    expect(screen.getByRole('tab', { name: 'MEYS 6th' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getAllByText('Self Funded 6th').length).toBeGreaterThan(0);
    expect(screen.queryByText('Self Funded 7th')).not.toBeInTheDocument();
  });

  it('selected state follows `selectedEditionSlug` (the edition the server actually rendered), not tab order', () => {
    render(
      <RegistrationTypePrograms
        selectedEditionSlug="meys-7th"
        programs={
          [
            {
              program_id: 'p-6th',
              program_name: 'MEYS 6th',
              program_slug: 'meys-6th',
              status: 'open',
              registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-11-30T00:00:00.000Z' },
              registration_types: [tier({ id: 't-6th', name: 'Self Funded 6th' })],
            },
            {
              program_id: 'p-7th',
              program_name: 'MEYS 7th',
              program_slug: 'meys-7th',
              status: 'open',
              registration_dates: { open: '2026-06-01T00:00:00.000Z', close: '2027-03-20T00:00:00.000Z' },
              registration_types: [tier({ id: 't-7th', name: 'Self Funded 7th' })],
            },
          ] as never
        }
      />,
    );

    expect(screen.getByRole('tab', { name: 'MEYS 7th' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'MEYS 6th' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getAllByText('Self Funded 7th').length).toBeGreaterThan(0);
    expect(screen.queryByText('Self Funded 6th')).not.toBeInTheDocument();
  });

  it('defaults to the running edition with the closest deadline, not the first/newest entry', () => {
    render(
      <RegistrationTypePrograms
        programs={
          [
            // Listed first but not open yet (registration hasn't started) —
            // default must skip it in favor of the running edition below.
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
          ] as never
        }
      />,
    );

    expect(screen.getByRole('tab', { name: 'MEYS 7th' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'MEYS 8th' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getAllByText('Self Funded 7th').length).toBeGreaterThan(0);
    expect(screen.queryByText('Self Funded 8th')).not.toBeInTheDocument();
  });
});
