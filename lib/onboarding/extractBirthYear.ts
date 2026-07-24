// lib/onboarding/extractBirthYear.ts

/**
 * Extracts a four-digit birth year string from a participant's `birthdate`
 * field (as returned by GET /api/participants/me — an ISO date/Date value),
 * for prefilling the onboarding form's `birthDate` state.
 *
 * Unlike the DTO's `birthdate`, the onboarding form's `birthDate` is a bare
 * YYYY year string (default `'2000'`); the BFF pads it to `YYYY-01-01` on
 * submit (see app/api/participants/onboarding/route.ts). Prefilling with a
 * full ISO string instead of a year would break submission, so this only
 * ever returns a year or undefined.
 *
 * Uses UTC to read the year — birthdate is stored as a midnight-UTC date, and
 * reading it back in the browser's local timezone can shift the year by one
 * near midnight for timezones behind UTC (e.g. "2000-01-01T00:00:00.000Z"
 * reads as Dec 31, 1999 in US Pacific time).
 */
export function extractBirthYear(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value !== 'string' && !(value instanceof Date)) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const year = date.getUTCFullYear();
  if (year < 1000 || year > 9999) return undefined;

  return String(year);
}
