// lib/format/registration-period.ts
import { formatDeadlineLocal, formatDeadlineWib } from "@/lib/format/deadline";

export type ValidityPeriod = {
  start_date: string;
  end_date: string;
};

/**
 * Admins extend a registration window by APPENDING a new validity period that
 * starts where the previous one ended, because the eligibility rule hides a
 * category's CTA and payment option when no period covers "now". A single tier
 * therefore accumulates a chain of windows: in production, 10 to 22 of them.
 *
 * Only ONE window is shown: the one covering "now", so a participant sees the
 * dates that actually apply today rather than an accumulated span ending on the
 * final extension. Falls back to the next upcoming window, then to the last one
 * that ran, so the label never goes blank.
 *
 * DISPLAY ONLY. Eligibility and payment gating still use the per-period logic
 * elsewhere; a participant must not become eligible because a label looks open.
 */
type ParsedPeriod = { period: ValidityPeriod; start: number; end: number };

function parsePeriods(periods: ValidityPeriod[] | undefined): ParsedPeriod[] {
  if (!periods || periods.length === 0) return [];

  const time = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  };

  return periods
    .map((period) => ({ period, start: time(period.start_date), end: time(period.end_date) }))
    .filter((entry) => entry.start !== null && entry.end !== null) as ParsedPeriod[];
}

const byEarliestEnd = (a: { end: number }, b: { end: number }) => a.end - b.end;

/**
 * Pick the window a participant should be shown "right now": the one
 * covering `now`, falling back to the next upcoming one, then the last one
 * that ran, so a label never goes blank. Shared by the period label and the
 * per-card countdown so both describe the same window.
 */
function pickDisplayWindow(parsed: ParsedPeriod[], nowTime: number): ParsedPeriod | undefined {
  if (parsed.length === 0) return undefined;

  // Windows may overlap (MEYS has 28 Jul - 31 Aug alongside 28 Jul - 1 Sep).
  // Eligibility holds while ANY window covers now, so the deadline that
  // actually applies is the latest end among the windows covering today.
  // Picking the earliest would tell participants registration closes a day
  // before it does.
  const current = parsed
    .filter((entry) => entry.start <= nowTime && nowTime <= entry.end)
    .sort(byEarliestEnd)
    .pop();
  const upcoming = parsed.filter((entry) => entry.start > nowTime).sort((a, b) => a.start - b.start)[0];
  const lapsed = [...parsed].sort(byEarliestEnd)[parsed.length - 1];

  return current ?? upcoming ?? lapsed;
}

export function getRegistrationPeriodLabel(
  periods: ValidityPeriod[] | undefined,
  hydrated: boolean = true,
  now: Date = new Date(),
): string {
  const parsed = parsePeriods(periods);
  const chosen = pickDisplayWindow(parsed, now.getTime());
  if (!chosen) return "TBD";

  const fmt = (value: string) => {
    const result = hydrated
      ? formatDeadlineLocal(value, { withTime: false })
      : formatDeadlineWib(value, { withTime: false });
    return result === "—" ? "TBD" : result;
  };

  const from = fmt(chosen.period.start_date);
  const to = fmt(chosen.period.end_date);
  // A single-day window reads better unrepeated.
  return from === to ? from : `${from} - ${to}`;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * "Closes in X days" (or "X hours" under a day) for the window currently
 * covering `now`, i.e. the same window `getRegistrationPeriodLabel` prints.
 * Returns null when no window covers `now` right now (not open, or already
 * ended) — callers show nothing in that case rather than a stale countdown.
 */
export function getRegistrationCountdownLabel(
  periods: ValidityPeriod[] | undefined,
  now: Date = new Date(),
): string | null {
  const nowTime = now.getTime();
  const current = parsePeriods(periods)
    .filter((entry) => entry.start <= nowTime && nowTime <= entry.end)
    .sort(byEarliestEnd)
    .pop();
  if (!current) return null;

  const remainingMs = current.end - nowTime;
  if (remainingMs <= 0) return null;

  if (remainingMs < ONE_DAY_MS) {
    const hours = Math.max(1, Math.ceil(remainingMs / (60 * 60 * 1000)));
    return `Closes in ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const days = Math.ceil(remainingMs / ONE_DAY_MS);
  return `Closes in ${days} day${days === 1 ? "" : "s"}`;
}

/**
 * Event/execution dates for a program edition, rendered under each batch tab so
 * an applicant can tell a 2026 edition from a 2027 one before choosing.
 * Held back until hydration for the same reason the period labels above are:
 * the server and the visitor can sit in different timezones.
 */
export function formatEventDateRange(
  dates: { start: string | null; end: string | null } | undefined | null,
  hydrated: boolean,
): string | null {
  if (!hydrated || !dates?.start) return null;
  const start = new Date(dates.start);
  const end = dates.end ? new Date(dates.end) : null;
  if (Number.isNaN(start.getTime())) return null;

  const sameYear = end && !Number.isNaN(end.getTime()) && start.getFullYear() === end.getFullYear();
  const startLabel = start.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  if (!end || Number.isNaN(end.getTime())) return startLabel;

  const endLabel = end.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${startLabel} - ${endLabel}`;
}
