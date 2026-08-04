// lib/format/timeline.ts
/**
 * Formatting/sorting helpers for program timeline items (program_important_dates).
 *
 * Preferred path: items carry structured `start_date`/`end_date` ISO instants from the
 * API (see types/programs.ts ProgramImportantDatesItem). Those are rendered in WIB
 * (Asia/Jakarta) via the platform's existing deadline formatter (lib/format/deadline.ts)
 * so this matches how dates render everywhere else.
 *
 * Fallback path: legacy rows (or any payload that omits the structured fields) fall
 * back to heuristically parsing the free-text `date_display` string, same as before.
 * This never throws and never renders "Invalid Date" - unparseable text is shown as-is,
 * and a fully empty value renders DATA_NOT_ADDED. Bare "YYYY-MM-DD" tokens within
 * date_display are parsed and rendered in WIB (not the host/viewer's local timezone),
 * matching the structured path - see parseLegacyIsoDateUtc below for why.
 */
import { formatDeadlineWib } from './deadline';
import { parseApiDate } from '../utils';
import { DATA_NOT_ADDED } from '../constants/ui';

export type TimelineDateInput = {
  date_display?: string | null;
  start_date?: string | null;
  end_date?: string | null;
};

export type TimelineVisualStatus = 'active' | 'upcoming' | 'closed';

/** Classify an item's backend status/is_active flag into a visual bucket. */
export function getTimelineVisualStatus(status?: string, isActive?: boolean): TimelineVisualStatus {
  const normalized = status?.toLowerCase() ?? '';
  if (isActive) return 'active';
  if (normalized === 'upcoming') return 'upcoming';
  if (normalized === 'active' || normalized === 'ongoing') return 'active';
  return 'closed';
}

/** WIB day-only label for a single ISO instant, or null if it doesn't parse. */
function formatWibDayLabel(value?: string | null): string | null {
  if (!value) return null;
  const formatted = formatDeadlineWib(value, { withTime: false });
  return formatted === '—' ? null : formatted.replace(/ WIB$/, '');
}

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Anchor a bare "YYYY-MM-DD" legacy token at UTC midnight, exactly like
 * lib/format/deadline.ts's (unexported) parseDeadlineInstant does for the
 * structured path. WIB (Asia/Jakarta, UTC+7, no DST) is always read off this
 * instant via an explicit `timeZone` option, never the host/browser's local
 * zone, so anchoring at UTC midnight can never cross a WIB calendar-day
 * boundary. This replaces parseApiDate's bare-date branch, which anchors at
 * LOCAL midnight instead and can drift the resolved WIB day depending on
 * whatever timezone the code happens to run in (server container vs. the
 * viewer's own browser).
 */
function parseLegacyIsoDateUtc(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function normalizeLegacyToken(value: string): string {
  if (ISO_DATE_ONLY.test(value)) {
    // Same WIB formatter the structured path uses, so a bare ISO date always
    // reads as the same WIB calendar day regardless of the viewer's timezone.
    const label = formatWibDayLabel(value);
    if (label) return label;
  }
  const parsed = parseApiDate(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

/** Legacy heuristic formatting of a free-text date_display string. */
function formatLegacyDisplay(display?: string | null): string {
  const raw = (display ?? '').trim();
  if (!raw) return DATA_NOT_ADDED;

  const parts = raw.split(/\s*[-–]\s*/).map((part) => part.trim()).filter(Boolean);
  if (parts.length === 2) {
    return `${normalizeLegacyToken(parts[0])} – ${normalizeLegacyToken(parts[1])}`;
  }
  return normalizeLegacyToken(raw);
}

/**
 * Resolve the display label for a timeline item. Prefers structured start/end dates
 * (rendered in WIB); falls back to the raw date_display text for legacy rows or when
 * a structured value fails to parse. Never returns "Invalid Date" or an empty string.
 */
export function formatTimelineDateLabel(item: TimelineDateInput): string {
  const startLabel = formatWibDayLabel(item.start_date);
  const endLabel = formatWibDayLabel(item.end_date);

  if (startLabel) {
    if (endLabel && endLabel !== startLabel) {
      return `${startLabel} – ${endLabel} WIB`;
    }
    return `${startLabel} WIB`;
  }

  return formatLegacyDisplay(item.date_display);
}

/**
 * Resolve a sortable epoch-ms value for an item, or null when nothing parses.
 * Prefers the structured start_date; falls back to the first token of date_display.
 */
export function getTimelineSortValue(item: TimelineDateInput): number | null {
  if (item.start_date) {
    const parsed = parseApiDate(item.start_date);
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();
  }

  const raw = (item.date_display ?? '').trim();
  if (!raw) return null;

  if (ISO_DATE_ONLY.test(raw)) {
    return parseLegacyIsoDateUtc(raw).getTime();
  }

  const [first] = raw.split(/\s*[-–]\s*/);
  const parsed = parseApiDate(first.trim());
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.getTime();
}

/**
 * Sort timeline items chronologically. Items with no parseable date always sort last
 * (never jump to the top, regardless of direction), and ties (including double-null)
 * break deterministically on original array order.
 */
export function sortTimelineItems<T extends TimelineDateInput>(
  items: T[],
  direction: 'asc' | 'desc',
): T[] {
  const dir = direction === 'asc' ? 1 : -1;
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ta = getTimelineSortValue(a.item);
      const tb = getTimelineSortValue(b.item);
      if (ta === null && tb === null) return a.index - b.index;
      if (ta === null) return 1;
      if (tb === null) return -1;
      if (ta === tb) return a.index - b.index;
      return dir * (ta - tb);
    })
    .map((entry) => entry.item);
}
