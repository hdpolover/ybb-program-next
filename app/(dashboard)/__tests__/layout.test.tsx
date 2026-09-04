// app/(dashboard)/__tests__/layout.test.tsx
//
// Covers the actual gate the dashboard renders behind: a session/host brand
// mismatch replaces the dashboard entirely with the explanation state, a
// match (or anything the guard can't determine, e.g. an unresolved host
// brand — see dashboardBrandGuard.test.ts) renders the dashboard as normal.

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const getDashboardBrandGuard = vi.fn();
vi.mock('@/lib/server/dashboardBrandGuard', () => ({
  getDashboardBrandGuard: () => getDashboardBrandGuard(),
}));

vi.mock('@/components/dashboard/BrandMismatchState', () => ({
  default: (props: { hostBrandName: string }) => (
    <div data-testid="brand-mismatch-state">Wrong programme: {props.hostBrandName}</div>
  ),
}));

import DashboardBrandGuardLayout from '@/app/(dashboard)/layout';

describe('DashboardBrandGuardLayout', () => {
  it('renders the dashboard children through when the brand matches', async () => {
    getDashboardBrandGuard.mockResolvedValue({ type: 'ok' });

    const jsx = await DashboardBrandGuardLayout({ children: <div>Real dashboard content</div> });
    render(jsx);

    expect(screen.getByText('Real dashboard content')).toBeInTheDocument();
    expect(screen.queryByTestId('brand-mismatch-state')).toBeNull();
  });

  it('renders the mismatch explanation instead of the dashboard when brands differ', async () => {
    getDashboardBrandGuard.mockResolvedValue({
      type: 'mismatch',
      hostBrandName: 'Korea Youth Summit',
      sessionBrand: { name: 'Middle East Youth Summit', url: 'middleeastyouthsummit.com' },
      registerUrl: null,
    });

    const jsx = await DashboardBrandGuardLayout({ children: <div>Real dashboard content</div> });
    render(jsx);

    expect(screen.getByTestId('brand-mismatch-state')).toBeInTheDocument();
    expect(screen.getByText(/Korea Youth Summit/)).toBeInTheDocument();
    expect(screen.queryByText('Real dashboard content')).toBeNull();
  });

  it('renders the dashboard through when the guard cannot resolve the host brand (fails open)', async () => {
    // Same "ok" shape the guard returns for an unresolved/unknown host brand
    // (see dashboardBrandGuard.test.ts) — never a mismatch by default.
    getDashboardBrandGuard.mockResolvedValue({ type: 'ok' });

    const jsx = await DashboardBrandGuardLayout({ children: <div>Real dashboard content</div> });
    render(jsx);

    expect(screen.getByText('Real dashboard content')).toBeInTheDocument();
    expect(screen.queryByTestId('brand-mismatch-state')).toBeNull();
  });
});
