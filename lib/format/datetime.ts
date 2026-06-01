import { parseApiDate } from '@/lib/utils';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

/** Default `toLocaleDateString` options for compact meta rows (e.g. "01 Dec 2025"). */
export const SCHEDULE_DATE_META_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

/** `toLocaleDateString` options for group headings with weekday (e.g. "Wed, 01 Dec 2025"). */
export const SCHEDULE_DATE_GROUP_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

const CLOCK_TOKEN = /^(\d{1,2}):(\d{2})(?::\d{2})?$/;

/** Parse a backend schedule date, returning null when it cannot be understood. */
export function parseScheduleDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = parseApiDate(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Format a schedule date for display, falling back when the value is missing/invalid. */
export function formatScheduleDate(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions = SCHEDULE_DATE_META_OPTIONS,
  fallback: string = DATA_NOT_ADDED,
): string {
  const parsed = parseScheduleDate(value);
  if (!parsed) return fallback;
  return parsed.toLocaleDateString('en-US', options);
}

/** Convert a single 24-hour `HH:MM` token to 12-hour `h:MM AM/PM`; passthrough if unrecognized. */
export function formatClockTime(value: string): string {
  const normalized = value.trim();
  const match = normalized.match(CLOCK_TOKEN);
  if (!match) return normalized;

  const rawHour = Number(match[1]);
  const minutes = match[2];
  if (!Number.isFinite(rawHour) || rawHour < 0 || rawHour > 23) return normalized;

  const suffix = rawHour >= 12 ? 'PM' : 'AM';
  const hour = ((rawHour + 11) % 12) + 1;
  return `${hour}:${minutes} ${suffix}`;
}

/** Format a pre-joined time range string like "13:00 - 15:00" into "1:00 PM – 3:00 PM". */
export function formatTimeRange(
  value: string | null | undefined,
  fallback: string = DATA_NOT_ADDED,
): string {
  const raw = (value ?? '').trim();
  if (!raw) return fallback;

  const tokens = raw.split(/\s*[-–]\s*/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length === 2) {
    return `${formatClockTime(tokens[0])} – ${formatClockTime(tokens[1])}`;
  }
  return formatClockTime(raw);
}

const toMinutes = (value: string | null | undefined): number | null => {
  const match = (value ?? '').trim().match(CLOCK_TOKEN);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
};

const isUnsetOrMidnight = (value: string | null | undefined): boolean => {
  const raw = (value ?? '').trim();
  return raw === '' || raw === '00:00' || raw === '00:00:00';
};

/**
 * Format a start/end pair from separate fields. Treats an unset pair, or a
 * midnight-to-midnight pair (the backend's "no time set" sentinel), as all-day.
 */
export function formatScheduleTimeRange(
  start: string | null | undefined,
  end: string | null | undefined,
  fallback: string = 'All Day',
): string {
  if (isUnsetOrMidnight(start) && isUnsetOrMidnight(end)) return fallback;

  const startLabel = (start ?? '').trim();
  const endLabel = (end ?? '').trim();

  if (!startLabel) return endLabel ? formatClockTime(endLabel) : fallback;
  if (!endLabel || startLabel === endLabel) return formatClockTime(startLabel);
  return `${formatClockTime(startLabel)} – ${formatClockTime(endLabel)}`;
}

/** Human-readable duration between a start/end pair, or null when it cannot be computed. */
export function formatScheduleDuration(
  start: string | null | undefined,
  end: string | null | undefined,
): string | null {
  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);
  if (startMinutes === null || endMinutes === null) return null;

  const diff = endMinutes - startMinutes;
  if (diff <= 0) return null;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}
