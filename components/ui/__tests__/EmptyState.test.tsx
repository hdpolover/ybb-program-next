import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '@/components/ui/EmptyState';

describe('EmptyState', () => {
  it('renders the title as a real heading', () => {
    render(<EmptyState title="No referrals found" />);
    expect(screen.getByRole('heading', { name: 'No referrals found' })).toBeInTheDocument();
  });

  it('renders without a description when none is provided', () => {
    render(<EmptyState title="No referrals found" />);
    expect(screen.queryByText(/appear here/i)).not.toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(
      <EmptyState
        title="No referrals found"
        description="Once participants use your link or code, they will appear here."
      />,
    );
    expect(
      screen.getByText('Once participants use your link or code, they will appear here.'),
    ).toBeInTheDocument();
  });

  it('renders without an action when none is provided', () => {
    render(<EmptyState title="No referrals found" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders the action when provided', () => {
    render(<EmptyState title="No referrals found" action={<button type="button">Retry</button>} />);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('marks the icon slot as decorative', () => {
    const { container } = render(
      <EmptyState title="No referrals found" icon={<svg data-testid="icon" />} />,
    );
    const iconWrapper = container.querySelector('[aria-hidden="true"]');
    expect(iconWrapper).toBeInTheDocument();
    expect(iconWrapper?.querySelector('[data-testid="icon"]')).toBeInTheDocument();
  });

  it('does not render an icon wrapper when no icon is provided', () => {
    const { container } = render(<EmptyState title="No referrals found" />);
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });
});
