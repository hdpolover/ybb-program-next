// components/dashboard/__tests__/BrandMismatchState.test.tsx

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn(), refresh: vi.fn() }),
}));

import BrandMismatchState from '@/components/dashboard/BrandMismatchState';

describe('BrandMismatchState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('names both the brand the account belongs to and the brand being viewed', () => {
    render(
      <BrandMismatchState
        hostBrandName="Korea Youth Summit"
        sessionBrand={{ name: 'Middle East Youth Summit', url: 'middleeastyouthsummit.com' }}
        registerUrl={null}
      />,
    );

    expect(screen.getAllByText(/Korea Youth Summit/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Middle East Youth Summit/).length).toBeGreaterThan(0);
  });

  it('adapts the copy when the session brand cannot be resolved (no unresolved-brand crash)', () => {
    render(<BrandMismatchState hostBrandName="Korea Youth Summit" sessionBrand={null} registerUrl={null} />);

    expect(screen.getByText(/isn't registered to Korea Youth Summit/)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^Go to/ })).toBeNull();
  });

  it('renders a "Go to <brand>" external link to the account\'s real brand', () => {
    render(
      <BrandMismatchState
        hostBrandName="Korea Youth Summit"
        sessionBrand={{ name: 'Middle East Youth Summit', url: 'middleeastyouthsummit.com' }}
        registerUrl={null}
      />,
    );

    const link = screen.getByRole('link', { name: 'Go to Middle East Youth Summit' });
    expect(link).toHaveAttribute('href', 'https://middleeastyouthsummit.com');
  });

  it('renders a register link only when one is given', () => {
    const { rerender } = render(
      <BrandMismatchState hostBrandName="Korea Youth Summit" sessionBrand={null} registerUrl={null} />,
    );
    expect(screen.queryByRole('link', { name: /Register for/ })).toBeNull();

    rerender(
      <BrandMismatchState
        hostBrandName="Korea Youth Summit"
        sessionBrand={null}
        registerUrl="/login?mode=signup&programSlug=kys-4th"
      />,
    );
    const registerLink = screen.getByRole('link', { name: 'Register for Korea Youth Summit' });
    expect(registerLink).toHaveAttribute('href', '/login?mode=signup&programSlug=kys-4th');
  });

  it('signs out on click without ever doing so automatically', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({}) }) as Response);
    vi.stubGlobal('fetch', fetchMock);

    render(<BrandMismatchState hostBrandName="Korea Youth Summit" sessionBrand={null} registerUrl={null} />);

    // Not called just from rendering the page.
    expect(fetchMock).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(fetchMock).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' });
    expect(push).toHaveBeenCalledWith('/login');

    vi.unstubAllGlobals();
  });
});
