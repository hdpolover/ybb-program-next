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

  it('labels the opening day in WIB, not in the viewer timezone', () => {
    // 2026-09-04T17:00Z is 5 Sept in Jakarta and 4 Sept in UTC. The bar must
    // say the Jakarta day whoever is looking.
    render(<StickyBottomBar deadline="2026-09-04T17:00:00.000Z" registerUrl="/login?mode=signup" phase="upcoming" />);
    scrollIntoView();

    expect(screen.getByText('Opens 5 Sept')).toBeInTheDocument();
  });

  it('shows the register CTA once an upcoming countdown reaches zero', () => {
    // `phase` is baked at server render behind a 120s cache, so unmounting at
    // zero deleted the loudest register CTA on the site at the exact moment
    // registration opened - indefinitely for an already-open tab.
    const openedAlready = new Date(Date.now() - 60 * 1000).toISOString();
    render(<StickyBottomBar deadline={openedAlready} registerUrl="/login?mode=signup" phase="upcoming" />);
    scrollIntoView();

    expect(screen.getByRole('link', { name: 'Register Now' })).toHaveAttribute('href', '/login?mode=signup');
    expect(screen.queryByText(/^Opens /)).toBeNull();
  });

  it('still unmounts when an OPEN countdown reaches zero', () => {
    const closedAlready = new Date(Date.now() - 60 * 1000).toISOString();
    const { container } = render(<StickyBottomBar deadline={closedAlready} registerUrl="/login?mode=signup" phase="open" />);
    scrollIntoView();

    expect(container).toBeEmptyDOMElement();
  });
});
