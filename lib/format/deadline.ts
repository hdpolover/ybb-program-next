/**
 * Deadline formatting helpers for participant-facing date/time display.
 *
 * Backend stores deadlines as absolute UTC ISO instants (e.g. "2026-07-15T16:59:00.000Z").
 * parseDeadlineInstant normalises bare datetime strings to UTC before producing a Date,
 * so the millisecond instant is always correct.
 *
 * Two rendering contexts need different approaches:
 *   - Client components: format in the browser local timezone and append a short
 *     timezone label automatically via Intl (e.g. "16 Jul 2026, 00:59 GMT+8").
 *   - Server-rendered code (Node): the browser timezone is unknown, so fall back to
 *     a fixed WIB (Asia/Jakarta) zone and append the literal "WIB" label.
 */

export const BUSINESS_TIMEZONE = "Asia/Jakarta";

/**
 * Parse a backend date value to a Date. Bare datetimes (no offset) are treated as
 * UTC so the absolute instant is correct; date-only values anchor at UTC midnight.
 * Kept self-contained (no imports) so this module is safe to bundle and to run as a
 * standalone node test.
 */
function parseDeadlineInstant(value: string | Date | null | undefined): Date {
  if (value instanceof Date) return value;
  if (value === null || value === undefined) return new Date(NaN);
  const raw = String(value).trim();
  if (!raw) return new Date(NaN);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return new Date(`${raw}T00:00:00Z`);
  const hasTz = /(?:[zZ]|[+-]\d{2}:\d{2})$/.test(raw);
  return new Date(hasTz ? raw : `${raw}Z`);
}

/**
 * Format a deadline value in the browser local timezone with an appended short
 * timezone label (e.g. "GMT+8"). Intended for "use client" components only.
 * Returns "—" for missing or invalid values.
 *
 * @param value  ISO string, Date, null, or undefined from the API.
 * @param opts   withTime (default true) includes hour and minute in the output.
 */
export function formatDeadlineLocal(
  value: string | Date | null | undefined,
  opts?: { withTime?: boolean },
): string {
  const withTime = opts?.withTime ?? true;
  const date = parseDeadlineInstant(value);
  if (Number.isNaN(date.getTime())) return "—";

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZoneName: "short",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  };

  return new Intl.DateTimeFormat("en-GB", formatOptions).format(date);
}

/**
 * Format a deadline value in WIB (Asia/Jakarta, UTC+7) with the literal "WIB"
 * label appended. Intended for server-rendered code where the browser timezone
 * is not available.
 * Returns "—" for missing or invalid values.
 *
 * @param value  ISO string, Date, null, or undefined from the API.
 * @param opts   withTime (default true) includes hour and minute in the output.
 */
export function formatDeadlineWib(
  value: string | Date | null | undefined,
  opts?: { withTime?: boolean },
): string {
  const withTime = opts?.withTime ?? true;
  const date = parseDeadlineInstant(value);
  if (Number.isNaN(date.getTime())) return "—";

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: BUSINESS_TIMEZONE,
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  };

  return new Intl.DateTimeFormat("en-GB", formatOptions).format(date) + " WIB";
}
