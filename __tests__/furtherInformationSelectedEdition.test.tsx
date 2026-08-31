// __tests__/furtherInformationSelectedEdition.test.tsx
//
// app/page.tsx bug: FurtherInformation always showed the section-level
// (newest-edition) guidebooks regardless of which tab the visitor had
// selected in HomeRegistrationStrip. Both share a SelectedEditionProvider
// now (components/sections/SelectedEditionContext.tsx). These tests cover:
// switching tabs updates the band, single-edition brands are unchanged, and
// the band still works when rendered outside the provider.

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HomeRegistrationStrip from '@/components/sections/HomeRegistrationStrip';
import FurtherInformationSection from '@/components/sections/FurtherInformation';
import { SelectedEditionProvider } from '@/components/sections/SelectedEditionContext';

function tier(overrides: Partial<{ id: string; name: string }> = {}) {
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

const twoEditionPrograms = [
  {
    program_name: 'MEYS 6th',
    status: 'open' as const,
    registration_dates: { open: '2026-01-01T00:00:00.000Z', close: '2026-12-05T00:00:00.000Z' },
    registration_types: [tier({ id: 't-6th', name: 'Self Funded 6th' })],
  },
  {
    program_name: 'MEYS 7th',
    status: 'open' as const,
    registration_dates: { open: '2026-06-01T00:00:00.000Z', close: '2027-03-20T00:00:00.000Z' },
    registration_types: [tier({ id: 't-7th', name: 'Self Funded 7th' })],
  },
];

const guidebookEditions = [
  [{ href: '6th-guide.pdf', label: '6th Guidebook', locale: 'eng' as const }],
  [{ href: '7th-guide.pdf', label: '7th Guidebook', locale: 'eng' as const }],
];

describe('FurtherInformation follows the selected edition', () => {
  it('switching tabs changes which edition\'s guidebooks the band renders', () => {
    render(
      <SelectedEditionProvider defaultIndex={0}>
        <HomeRegistrationStrip programs={twoEditionPrograms as never} />
        <FurtherInformationSection guidebookEditions={guidebookEditions} />
      </SelectedEditionProvider>,
    );

    expect(screen.getByRole('link', { name: '6th Guidebook' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '7th Guidebook' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'MEYS 7th' }));

    expect(screen.getByRole('link', { name: '7th Guidebook' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '6th Guidebook' })).not.toBeInTheDocument();
  });

  it('single edition: renders exactly as before (no tab bar, static guidebooks prop used)', () => {
    render(
      <FurtherInformationSection
        guidebooks={[{ href: 'solo-guide.pdf', label: 'Solo Guidebook', locale: 'eng' }]}
      />,
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Solo Guidebook' })).toBeInTheDocument();
  });

  it('renders correctly outside the provider (fallback path)', () => {
    render(
      <FurtherInformationSection
        guidebooks={[{ href: 'fallback-guide.pdf', label: 'Fallback Guidebook', locale: 'eng' }]}
        guidebookEditions={guidebookEditions}
      />,
    );

    // No provider present: guidebookEditions is ignored, static guidebooks wins.
    expect(screen.getByRole('link', { name: 'Fallback Guidebook' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '6th Guidebook' })).not.toBeInTheDocument();
  });
});
