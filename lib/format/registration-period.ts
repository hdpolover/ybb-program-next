// lib/format/registration-period.ts
import { formatDayMonthWib } from "@/lib/format/deadline";
import {
  parseRegistrationWindows,
  windowsFromDates,
  type RegistrationDates,
  type RegistrationValidityPeriod,
} from "@/lib/registration/isRegistrationOpen";

export type ValidityPeriod = RegistrationValidityPeriod;

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
// Windows come from lib/registration/isRegistrationOpen, the same parser the
// open/closed gate uses, so "the window covering now" means the same thing in
// a label as it does in a badge (including the WIB start-of-day widening on
// the earliest window).
type ParsedPeriod = { period: ValidityPeriod; start: number; end: number };

const byEarliestEnd = (a: { end: number }, b: { end: number }) => a.end - b.end;

/**
 * The window that applies right now, or undefined when none does.
 *
 * Windows may overlap (MEYS has 28 Jul - 31 Aug alongside 28 Jul - 1 Sep).
 * Eligibility holds while ANY window covers now, so the deadline that actually
 * applies is the LATEST end among the windows covering today. Picking the
 * earliest would tell participants registration closes a day before it does.
 */
function pickCurrentWindow<T extends { start: number; end: number }>(parsed: T[], nowTime: number): T | undefined {
  return parsed.filter((entry) => entry.start <= nowTime && nowTime <= entry.end).sort(byEarliestEnd).pop();
}

/**
 * The MAIN window of a tier: the longest one, ties broken by the earliest
 * start so the choice is deterministic.
 *
 * Staged registration ("bertahap") is run on purpose: a long main window
 * followed by short extension windows, often a ladder of one-day ones. CYS
 * 2026's self-funded tier has a 15 Apr - 10 Oct main window and seventeen
 * extensions after it, the last being 25 Oct - 2 Nov.
 *
 * "Longest" rather than "first" because an early-bird window placed BEFORE the
 * main one would otherwise be mistaken for it, and length is what actually
 * distinguishes the advertised period from an operational extension.
 */
function pickMainWindow(parsed: ParsedPeriod[]): ParsedPeriod | undefined {
  return [...parsed].sort((a, b) => {
    const byLength = (b.end - b.start) - (a.end - a.start);
    return byLength !== 0 ? byLength : a.start - b.start;
  })[0];
}

/**
 * Pick the window a participant should be shown "right now": the one
 * covering `now`, falling back to the next upcoming one, then - once every
 * window has lapsed - the MAIN one, so a label never goes blank. Shared by the
 * period label and the per-card countdown so both describe the same window.
 *
 * The lapsed branch used to show the window that ran LAST, which on a finished
 * programme meant the tail of the extension ladder: CYS self-funded would have
 * read "25 Oct - 2 Nov" for a registration that opened in April. That both
 * contradicts the published guideline and advertises to next year's applicants
 * that extensions are routine, which is the opposite of what the ladder is for.
 *
 * It deliberately does NOT fall back to the programme's own registration dates.
 * A tier that genuinely ran for two days - CYS fully-funded, 20-21 Aug - would
 * then print the programme's 15 Apr - 2 Nov and state something untrue. The
 * tier's own longest window is the honest answer for both shapes.
 */
function pickDisplayWindow(parsed: ParsedPeriod[], nowTime: number): ParsedPeriod | undefined {
  if (parsed.length === 0) return undefined;

  const upcoming = parsed.filter((entry) => entry.start > nowTime).sort((a, b) => a.start - b.start)[0];

  return pickCurrentWindow(parsed, nowTime) ?? upcoming ?? pickMainWindow(parsed);
}

/** A registration period boundary is a CALENDAR DAY the admin picked, not an
 * instant, so it is always rendered in the business timezone. Rendered in the
 * viewer's zone instead, an end stored at 23:59 WIB reads as the next day for
 * everyone east of Jakarta. Same defect formatDayMonthWib exists to stop,
 * and it also made the server and client HTML differ for no reason. */
function formatPeriodDay(value: string): string {
  return formatDayMonthWib(value, { withYear: true }) ?? "TBD";
}

export function getRegistrationPeriodLabel(
  periods: ValidityPeriod[] | undefined,
  now: Date = new Date(),
): string {
  const parsed = parseRegistrationWindows(periods);
  const chosen = pickDisplayWindow(parsed, now.getTime());
  if (!chosen) return "TBD";

  const from = formatPeriodDay(chosen.period.start_date);
  const to = formatPeriodDay(chosen.period.end_date);
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
  return getWindowCountdownLabel(parseRegistrationWindows(periods), now);
}

/** The same countdown over already-parsed windows, so an edition's own
 * half-bounded registration dates (which cannot be expressed as a period pair)
 * get the identical rule. An open-ended window has no target and returns
 * null. */
function getWindowCountdownLabel(
  windows: Array<{ start: number; end: number }>,
  now: Date,
): string | null {
  const nowTime = now.getTime();
  const current = pickCurrentWindow(windows, nowTime);
  if (!current || !Number.isFinite(current.end)) return null;

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

/**
 * Label and countdown for an EDITION's own registration dates.
 *
 * Unlike a tier's validity periods these may be HALF-BOUNDED (a null open
 * date means "already open", a null close means "no end yet"), which is why
 * three call sites hand-building `{ start_date: open ?? '', end_date: close ??
 * '' }` was wrong: an empty string parses to NaN, the window was dropped, and
 * the edition rendered badge "Open" over label "TBD" with no countdown while
 * the gate (which reads windowsFromDates) correctly said open. One
 * constructor, so the label, the countdown and the badge describe the same
 * window.
 */
export function getRegistrationDatesDisplay(
  dates: RegistrationDates,
  now: Date = new Date(),
): { label: string; countdown: string | null } {
  const windows = windowsFromDates(dates);
  if (windows.length === 0) return { label: "TBD", countdown: null };

  const open = dates?.open ? formatPeriodDay(dates.open) : null;
  const close = dates?.close ? formatPeriodDay(dates.close) : null;
  const label =
    open && close ? (open === close ? open : `${open} - ${close}`) : close ? `Until ${close}` : `From ${open}`;

  return { label, countdown: getWindowCountdownLabel(windows, now) };
}
