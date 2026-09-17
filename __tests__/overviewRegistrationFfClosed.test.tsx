// __tests__/overviewRegistrationFfClosed.test.tsx
//
// 9,748 MEYS + 69 CYS participants hold an unpaid Fully Funded registration
// fee created after their FF window closed. The dashboard overview
// (OverviewRegistrationSection) is the surface they see without digging, so
// when they're still on the closed category it must say why in plain
// English and offer the Self Funded switch, not the generic "Switch
// Available" copy that never mentions closure.

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import type { PortalDashboardSummary } from '@/components/dashboard/DashboardDataContext';

let dashboardSummary: PortalDashboardSummary | null = null;

vi.mock('@/components/dashboard/DashboardDataContext', () => ({
  useDashboardData: () => ({
    dashboardSummary,
    isDashboardSummaryLoading: false,
  }),
}));
vi.mock('@/lib/dashboard/switchCategoryFeedback', () => ({
  flushSwitchCategoryFeedback: vi.fn(),
  queueSwitchCategoryFeedback: vi.fn(),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() } }));

import OverviewRegistrationSection from '@/components/dashboard/sections/dashboardOverview/OverviewRegistrationSection';

function activeApplication(
  overrides: Partial<NonNullable<PortalDashboardSummary['activeApplication']>>,
): PortalDashboardSummary {
  return {
    activeApplication: {
      id: 'app-1',
      category: 'fully_funded',
      canSwitchCategory: true,
      ...overrides,
    },
  };
}

describe('OverviewRegistrationSection - Fully Funded window closed', () => {
  it('explains the closure and offers the Self Funded switch when a switch is possible', () => {
    dashboardSummary = activeApplication({
      fullyFundedRegistrationClosed: true,
      canSwitchCategory: true,
    });

    render(<OverviewRegistrationSection />);

    expect(screen.getByText(/Fully Funded registration has closed/i)).toBeInTheDocument();
    expect(screen.getByText(/this fee can no longer be paid/i)).toBeInTheDocument();
    expect(screen.getByText(/Self Funded registration is still open/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to Self Funded/i })).toBeEnabled();
  });

  it('shows the backend reason instead of a CTA when the switch is blocked', () => {
    dashboardSummary = activeApplication({
      fullyFundedRegistrationClosed: true,
      canSwitchCategory: false,
      switchCategoryMessage: 'You have a payment being verified. Cancel it first to switch.',
    });

    render(<OverviewRegistrationSection />);

    expect(screen.getByText(/Fully Funded registration has closed/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You have a payment being verified\. Cancel it first to switch\./i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Switch to Self Funded/i })).toBeDisabled();
  });

  it('does not show the closure copy for an open Fully Funded window', () => {
    dashboardSummary = activeApplication({
      fullyFundedRegistrationClosed: false,
      canSwitchCategory: true,
    });

    render(<OverviewRegistrationSection />);

    expect(screen.queryByText(/Fully Funded registration has closed/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Switch Available/i)).toBeInTheDocument();
  });

  it('does not show the closure copy when already Self Funded', () => {
    dashboardSummary = activeApplication({
      category: 'self_funded',
      fullyFundedRegistrationClosed: true,
      canSwitchCategory: true,
    });

    render(<OverviewRegistrationSection />);

    expect(screen.queryByText(/Fully Funded registration has closed/i)).not.toBeInTheDocument();
  });
});
