// lib/onboarding/extractBirthDate.ts

/**
 * Extracts a full 'YYYY-MM-DD' date string from a participant's `birthdate`
 * field (as returned by GET /api/participants/me — an ISO date/Date value),
 * for prefilling the onboarding form's `birthDate` state.
 *
 * Uses UTC to read the date — birthdate is stored as a midnight-UTC value, and
 * reading it back in the browser's local timezone can shift the calendar day
 * backwards by one for timezones behind UTC (e.g. "2000-01-01T00:00:00.000Z"
 * reads as Dec 31, 1999 in US Pacific time). Reading getUTCFullYear/Month/Date
 * instead of the local-time equivalents keeps the prefilled date identical to
 * what was stored, regardless of the participant's browser timezone.
 */
export function extractBirthDate(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (typeof value !== 'string' && !(value instanceof Date)) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const year = date.getUTCFullYear();
  if (year < 1000 || year > 9999) return undefined;

  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
