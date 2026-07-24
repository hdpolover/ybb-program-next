// lib/onboarding/__tests__/friendlyOnboardingError.test.ts

import { describe, it, expect } from 'vitest';
import { friendlyOnboardingError } from '@/lib/onboarding/friendlyOnboardingError';

const GENERIC = 'Something went wrong on our end. Please try again in a moment.';

describe('friendlyOnboardingError', () => {
  it('returns the generic fallback for a 5xx status', () => {
    expect(friendlyOnboardingError(500, 'Internal server error')).toBe(GENERIC);
    expect(friendlyOnboardingError(503, 'Service unavailable')).toBe(GENERIC);
  });

  it('returns the generic fallback for status 0 (network/unknown failure)', () => {
    expect(friendlyOnboardingError(0, 'Failed to fetch')).toBe(GENERIC);
  });

  it('humanizes the English-name validator message', () => {
    const raw = "fullName must use the English alphabet only (letters, spaces, - ' .)";
    expect(friendlyOnboardingError(400, raw)).toBe(
      'Please enter your name using English letters only (A-Z).',
    );
  });

  it('humanizes the English-text (city) validator message', () => {
    const raw = 'originCity must use standard English characters only (no accented or non-Latin characters)';
    expect(friendlyOnboardingError(400, raw)).toBe(
      'Please enter your city using English letters only.',
    );
  });

  it('humanizes an invalid country code message', () => {
    expect(friendlyOnboardingError(400, 'Invalid country code: XX')).toBe(
      "We couldn't recognize your selected country. Please pick it again from the list.",
    );
  });

  it('passes an unknown 4xx message through unchanged', () => {
    expect(friendlyOnboardingError(409, 'Onboarding already completed')).toBe(
      'Onboarding already completed',
    );
  });

  it('returns the generic fallback for an empty message', () => {
    expect(friendlyOnboardingError(400, '')).toBe(GENERIC);
  });

  it('returns the generic fallback for a whitespace-only message', () => {
    expect(friendlyOnboardingError(422, '   ')).toBe(GENERIC);
  });
});
