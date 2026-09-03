// components/ui/__tests__/StickyBottomBar.test.tsx
/**
 * The sticky bar was the loudest half of the Korea Youth Summit 4th
 * inconsistency: an active "Register Now" plus a 183-day countdown, sitting on
 * a page whose fee cards all read Closed. Clicking it created a real account
 * and then told the user registration "has closed".
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import StickyBottomBar from '@/components/ui/StickyBottomBar';

/** The bar only mounts past 300px of scroll. */
function scrollIntoView() {
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true, configurable: true });
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('StickyBottomBar', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  });

  it('renders an active register link while registration is open', () => {
    const deadline = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    render(<StickyBottomBar deadline={deadline} registerUrl="/login?mode=signup" phase="open" />);
    scrollIntoView();

    const cta = screen.getByRole('link', { name: 'Register Now' });
    expect(cta).toHaveAttribute('href', '/login?mode=signup');
  });

  it('renders no register CTA at all when registration is only upcoming', () => {
    const opensAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    render(<StickyBottomBar deadline={opensAt} registerUrl="/login?mode=signup" phase="upcoming" />);
    scrollIntoView();

    expect(screen.queryByRole('link', { name: 'Register Now' })).toBeNull();
    expect(screen.queryByText('Register Now')).toBeNull();
    expect(screen.getByText(/^Opens /)).toBeInTheDocument();
  });
});
