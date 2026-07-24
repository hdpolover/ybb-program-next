// lib/onboarding/__tests__/extractBirthYear.test.ts

import { describe, it, expect } from 'vitest';
import { extractBirthYear } from '@/lib/onboarding/extractBirthYear';

describe('extractBirthYear', () => {
  it('extracts the year from an ISO date string', () => {
    expect(extractBirthYear('1995-05-20T00:00:00.000Z')).toBe('1995');
  });

  it('extracts the year from a date-only ISO string', () => {
    expect(extractBirthYear('1990-01-01')).toBe('1990');
  });

  it('extracts the year from a Date instance using UTC', () => {
    expect(extractBirthYear(new Date('2001-12-31T00:00:00.000Z'))).toBe('2001');
  });

  it('reads the year in UTC, not local time, to avoid a timezone-induced off-by-one', () => {
    // Midnight UTC on Jan 1 — in a timezone behind UTC (e.g. US Pacific,
    // UTC-8) this would read as Dec 31 of the prior year if local time were
    // used instead of UTC.
    expect(extractBirthYear('2000-01-01T00:00:00.000Z')).toBe('2000');
  });

  it('returns undefined for null', () => {
    expect(extractBirthYear(null)).toBeUndefined();
  });

  it('returns undefined for undefined', () => {
    expect(extractBirthYear(undefined)).toBeUndefined();
  });

  it('returns undefined for a malformed date string', () => {
    expect(extractBirthYear('not-a-date')).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    expect(extractBirthYear('')).toBeUndefined();
  });

  it('returns undefined for a non-date, non-string value', () => {
    expect(extractBirthYear(12345)).toBeUndefined();
    expect(extractBirthYear({})).toBeUndefined();
  });
});
