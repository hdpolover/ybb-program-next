import { describe, it, expect } from 'vitest';

// The navbar pins on the programs pages, where the floating Home button is
// otherwise the only way back. Everywhere else it keeps auto-hiding on scroll.
const pinNavbar = (pathname: string | null) => pathname?.startsWith('/programs') ?? false;
const navHidden = (hidden: boolean, pathname: string | null) => hidden && !pinNavbar(pathname);

describe('navbar auto-hide pinning', () => {
  it('stays visible on the programs pages even when scrolled down', () => {
    expect(navHidden(true, '/programs')).toBe(false);
    expect(navHidden(true, '/programs/middle-east-youth-summit-6th')).toBe(false);
  });

  it('still auto-hides everywhere else', () => {
    expect(navHidden(true, '/')).toBe(true);
    expect(navHidden(true, '/announcements')).toBe(true);
  });

  it('is visible when not scrolled, on any route', () => {
    expect(navHidden(false, '/')).toBe(false);
    expect(navHidden(false, '/programs')).toBe(false);
  });

  it('treats a null pathname as not pinned', () => {
    expect(navHidden(true, null)).toBe(true);
  });
});
