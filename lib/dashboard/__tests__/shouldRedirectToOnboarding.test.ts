// lib/dashboard/__tests__/shouldRedirectToOnboarding.test.ts

import { describe, it, expect } from 'vitest';
import { shouldRedirectToOnboarding } from '@/lib/dashboard/shouldRedirectToOnboarding';

describe('shouldRedirectToOnboarding', () => {
  it('redirects on a clean 404 for a participant-role user', () => {
    expect(shouldRedirectToOnboarding(404, 'participant')).toBe(true);
  });

  it('redirects on a clean 404 when activeRole is undefined', () => {
    expect(shouldRedirectToOnboarding(404, undefined)).toBe(true);
  });

  it('does NOT redirect a 404 for an ambassador — they may legitimately lack a participant record', () => {
    expect(shouldRedirectToOnboarding(404, 'ambassador')).toBe(false);
  });

  it('does NOT redirect on a 5xx (transient backend failure)', () => {
    expect(shouldRedirectToOnboarding(500, 'participant')).toBe(false);
    expect(shouldRedirectToOnboarding(503, 'participant')).toBe(false);
  });

  it('does NOT redirect on other non-404 4xx statuses', () => {
    expect(shouldRedirectToOnboarding(401, 'participant')).toBe(false);
    expect(shouldRedirectToOnboarding(403, 'participant')).toBe(false);
  });

  it('does NOT redirect on a 2xx status', () => {
    expect(shouldRedirectToOnboarding(200, 'participant')).toBe(false);
  });
});
