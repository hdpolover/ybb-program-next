// lib/calendar/buildCalendarEntries.ts
//
// Pure date/grid helpers for the home page events calendar. Deliberately
// library-free (Intl + plain Date arithmetic only), since this panel is
// dynamically imported and must not blow the page's JS budget.
import type { RegistrationCalendarEvent } from '@/lib/registration/calendarEvents';
import type { ProgramScheduleItem } from '@/lib/api/schedules';

export type CalendarEntry =
  | { kind: 'registration'; id: string; label: string; startKey: string; endKey: string }
  | { kind: 'schedule'; id: string; dayKey: string; items: ProgramScheduleItem[] }
  | { kind: 'program'; id: string; label: string; dayKey: string };

const pad2 = (n: number) => String(n).padStart(2, '0');

/** "YYYY-MM-DD" for the instant `ms`, read in the given IANA zone. en-CA
 * formats as YYYY-MM-DD directly, no manual token reordering needed. */
function dayKeyInZone(ms: number, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(
    new Date(ms),
  );
}

/** WIB day key for a registration window instant. These are business gates
 * measured in WIB calendar days (see lib/registration/isRegistrationOpen.ts). */
export const wibDayKey = (ms: number): string => dayKeyInZone(ms, 'Asia/Jakarta');

/**
 * UTC day key for a Postgres `date` value (program start/end, schedule days).
 * These carry no time-of-day meaning, so reading them in UTC reproduces
 * exactly what was entered regardless of server or viewer timezone -- the
 * same rule SignupEditionChoice's eventDay() already applies to program_dates.
 */
export function utcDayKeyFromDateString(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return dayKeyInZone(parsed.getTime(), 'UTC');
}

/** The UTC-midnight instant a "YYYY-MM-DD" key represents. Grid math and
 * chronological ordering only, never shown to a viewer as a real instant. */
export function keyToUtcMs(key: string): number {
  return new Date(`${key}T00:00:00Z`).getTime();
}

/**
 * Combine already-filtered registration spans, the programme's start/end
 * dates, and its day-by-day schedule into one list of calendar entries.
 *
 * `registrationEvents` MUST already have the disclosure rule applied (see
 * lib/registration/calendarEvents.ts): this function does no filtering of
 * its own and will happily render whatever it is given.
 */
export function buildCalendarEntries(
  registrationEvents: RegistrationCalendarEvent[],
  programDates: { start: string | null; end: string | null } | undefined,
  schedules: ProgramScheduleItem[],
): CalendarEntry[] {
  const entries: CalendarEntry[] = registrationEvents.map((event) => ({
    kind: 'registration' as const,
    id: event.id,
    label: event.label,
    startKey: wibDayKey(event.start),
    endKey: wibDayKey(event.end),
  }));

  const startKey = utcDayKeyFromDateString(programDates?.start);
  const endKey = utcDayKeyFromDateString(programDates?.end);
  if (startKey) {
    entries.push({ kind: 'program', id: 'program-start', label: 'Program begins', dayKey: startKey });
  }
  if (endKey && endKey !== startKey) {
    entries.push({ kind: 'program', id: 'program-end', label: 'Program ends', dayKey: endKey });
  }

  const scheduleByDay = new Map<string, ProgramScheduleItem[]>();
  schedules.forEach((item) => {
    const key = utcDayKeyFromDateString(item.day);
    if (!key) return;
    scheduleByDay.set(key, [...(scheduleByDay.get(key) ?? []), item]);
  });
  scheduleByDay.forEach((items, dayKey) => {
    entries.push({ kind: 'schedule', id: `schedule-${dayKey}`, dayKey, items });
  });

  return entries;
}

export type MonthGridCell = { key: string; day: number; inMonth: boolean };

/**
 * Six-or-fewer-week grid for the given month. Built on Date.UTC's own
 * day-overflow normalisation (day 0 rolls into the previous month, day
 * daysInMonth+1 into the next) rather than hand-rolled month rollover math.
 * Weeks start Sunday.
 */
export function buildMonthGrid(year: number, month0: number): MonthGridCell[] {
  const startWeekday = new Date(Date.UTC(year, month0, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, i) => {
    const cellDate = new Date(Date.UTC(year, month0, i - startWeekday + 1));
    return {
      key: `${cellDate.getUTCFullYear()}-${pad2(cellDate.getUTCMonth() + 1)}-${pad2(cellDate.getUTCDate())}`,
      day: cellDate.getUTCDate(),
      inMonth: cellDate.getUTCMonth() === month0,
    };
  });
}

/**
 * The month (as {year, month0}) that should be visible by default: the one
 * containing the next entry at or after today, falling back to the most
 * recent past entry, then to the current month when there are no entries at
 * all. Programmes are frequently months out, so defaulting to today's month
 * would often render an empty grid.
 */
export function pickDefaultMonth(entries: CalendarEntry[], now: Date): { year: number; month0: number } {
  const keys = entries.map((entry) => (entry.kind === 'registration' ? [entry.startKey, entry.endKey] : [entry.dayKey])).flat();

  const nowKey = dayKeyInZone(now.getTime(), 'UTC');
  const upcoming = keys.filter((key) => key >= nowKey).sort()[0];
  const chosenKey = upcoming ?? [...keys].sort().reverse()[0];

  const ms = chosenKey ? keyToUtcMs(chosenKey) : now.getTime();
  const asDate = new Date(ms);
  return { year: asDate.getUTCFullYear(), month0: asDate.getUTCMonth() };
}
