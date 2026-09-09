// components/dashboard/sections/__tests__/AmbassadorReferralFunnelSection.test.tsx
//
// Referrals now span every programme of the brand, not just the ambassador's
// home programme, so the table needs a Programme column and filter that
// combines correctly with the existing status filter.

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AmbassadorData } from '@/lib/dashboard/ambassador';

const mockUseAmbassadorSectionData = vi.fn();

vi.mock('@/components/dashboard/sections/useAmbassadorSectionData', () => ({
  useAmbassadorSectionData: () => mockUseAmbassadorSectionData(),
}));

import AmbassadorReferralFunnelSection from '@/components/dashboard/sections/AmbassadorReferralFunnelSection';

function ambassadorData(): AmbassadorData {
  return {
    id: 'amb-1',
    fullName: 'Jane Doe',
    referralCode: 'JANE10',
    shareLink: 'https://ybb.id/r/JANE10',
    totalReferrals: 3,
    successfulReferrals: 1,
    isActive: true,
    programName: 'Indonesia Youth Summit',
    referrals: [
      {
        id: 'ref-1',
        participantId: 'p-1',
        participantName: 'Alice Tan',
        programId: 'prog-1',
        programName: 'Indonesia Youth Summit',
        status: 'referred',
        referredAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'ref-2',
        participantId: 'p-2',
        participantName: 'Budi Santoso',
        programId: 'prog-2',
        programName: 'China Leaders Camp',
        status: 'completed',
        referredAt: '2026-01-02T00:00:00.000Z',
        completedAt: '2026-01-20T00:00:00.000Z',
      },
      {
        id: 'ref-3',
        participantId: 'p-3',
        participantName: 'Chandra Wijaya',
        // No programme fields — an older referral row.
        status: 'referred',
        referredAt: '2026-01-03T00:00:00.000Z',
      },
    ],
  };
}

describe('AmbassadorReferralFunnelSection', () => {
  it('renders a Programme column with each referral row programme', () => {
    mockUseAmbassadorSectionData.mockReturnValue({ data: ambassadorData(), loading: false, error: null });
    render(<AmbassadorReferralFunnelSection />);

    expect(screen.getByRole('columnheader', { name: 'Programme' })).toBeInTheDocument();
    const table = screen.getByRole('table');
    expect(within(table).getByText('Indonesia Youth Summit')).toBeInTheDocument();
    expect(within(table).getByText('China Leaders Camp')).toBeInTheDocument();
  });

  it('falls back to a dash when a referral row has no programme (older row)', () => {
    mockUseAmbassadorSectionData.mockReturnValue({ data: ambassadorData(), loading: false, error: null });
    render(<AmbassadorReferralFunnelSection />);

    const row = screen.getByText('Chandra Wijaya').closest('tr');
    expect(row).not.toBeNull();
    expect(row!.textContent).toContain('-');
  });

  it('filters referrals by programme', async () => {
    mockUseAmbassadorSectionData.mockReturnValue({ data: ambassadorData(), loading: false, error: null });
    render(<AmbassadorReferralFunnelSection />);

    const user = userEvent.setup();
    const programSelect = screen.getByDisplayValue('All programmes');
    await user.selectOptions(programSelect, 'China Leaders Camp');

    expect(screen.queryByText('Alice Tan')).not.toBeInTheDocument();
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    expect(screen.queryByText('Chandra Wijaya')).not.toBeInTheDocument();
  });

  it('combines the programme filter with the status filter', async () => {
    mockUseAmbassadorSectionData.mockReturnValue({ data: ambassadorData(), loading: false, error: null });
    render(<AmbassadorReferralFunnelSection />);

    const user = userEvent.setup();
    const statusSelect = screen.getByDisplayValue('All statuses');
    await user.selectOptions(statusSelect, 'Completed');
    const programSelect = screen.getByDisplayValue('All programmes');
    await user.selectOptions(programSelect, 'Indonesia Youth Summit');

    // Alice (referred, Indonesia) is excluded by status; Budi (completed, China)
    // is excluded by programme — nothing should match both filters.
    expect(screen.getByText('No referrals found')).toBeInTheDocument();
  });
});
