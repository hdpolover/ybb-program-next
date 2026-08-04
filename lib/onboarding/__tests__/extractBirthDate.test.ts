// lib/onboarding/__tests__/extractBirthDate.test.ts

import { describe, it, expect } from 'vitest';
import { extractBirthDate } from '@/lib/onboarding/extractBirthDate';

describe('extractBirthDate', () => {
  it('extracts the full date from an ISO date-time string', () => {
    expect(extractBirthDate('1995-05-20T00:00:00.000Z')).toBe('1995-05-20');
  });

  it('extracts the full date from a date-only ISO string', () => {
    expect(extractBirthDate('1990-01-31')).toBe('1990-01-31');
  });

  it('extracts the full date from a Date instance using UTC', () => {
    expect(extractBirthDate(new Date('2001-12-31T00:00:00.000Z'))).toBe('2001-12-31');
  });

  it('reads the date in UTC, not local time, to avoid a timezone-induced off-by-one', () => {
    // Midnight UTC on Jan 1 — in a timezone behind UTC (e.g. US Pacific,
    // UTC-8) this would read as Dec 31 of the prior year/month/day if local
    // time were used instead of UTC.
    expect(extractBirthDate('2000-01-01T00:00:00.000Z')).toBe('2000-01-01');
  });

  it('pads single-digit month and day', () => {
    expect(extractBirthDate('1988-03-05T00:00:00.000Z')).toBe('1988-03-05');
  });

  it('returns undefined for null', () => {
    expect(extractBirthDate(null)).toBeUndefined();
  });

  it('returns undefined for undefined', () => {
    expect(extractBirthDate(undefined)).toBeUndefined();
  });

  it('returns undefined for a malformed date string', () => {
    expect(extractBirthDate('not-a-date')).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    expect(extractBirthDate('')).toBeUndefined();
  });

  it('returns undefined for a non-date, non-string value', () => {
    expect(extractBirthDate(12345)).toBeUndefined();
    expect(extractBirthDate({})).toBeUndefined();
  });
});
