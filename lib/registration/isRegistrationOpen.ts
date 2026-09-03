// lib/registration/isRegistrationOpen.ts
//
// Single source of truth for "is this registration window open right now",
// previously implemented twice with byte-identical bodies
// (components/sections/HomeRegistrationStrip.tsx and
// components/programs/registrationTypes.tsx), which is exactly how a
// duplicated bug fix stays half-applied.
//
// EVERY surface that answers "has this window started / is this open" routes
// through here: the homepage strip badge and cards, the /apply badge and
// cards, and the layout banner + sticky bar via lib/registration/deadline.ts.
// A second implementation anywhere is how the fee card said Open while the
// bar said "Opens 31 Aug" for the same 23 hours.

import type { RegistrationPhase } from '@/lib/registration/status';

const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const REGISTRATION_FEE_TYPE = 'registration_fee';

/** The instant at which the WIB (Asia/Jakarta, UTC+7, no DST) calendar day containing `date` began. */
function startOfWibDay(ms: number): number {
  const wallClockMs = ms + WIB_OFFSET_MS;
  return Math.floor(wallClockMs / MS_PER_DAY) * MS_PER_DAY - WIB_OFFSET_MS;
}

export type RegistrationValidityPeriod = {
  start_date: string;
  end_date: string;
};

/** An edition's program-level registration window, used as the fallback when a
 * tier (or a whole edition) carries no validity windows of its own. */
export type RegistrationDates = { open: string | null; close: string | null } | null | undefined;

/** A pricing tier in either wire shape: snake_case from the home API,
 * camelCase from /v1/programs/:id/pricing-tiers. Both arrive on the same
 * screens, so every helper here reads both rather than making each caller
 * normalise (which is how the two badge surfaces diverged). */
export type RegistrationTierLike = {
  fee_type?: string | null;
  feeType?: string | null;
  validity_periods?: Array<{ start_date?: string | null; end_date?: string | null }> | null;
  validityPeriods?: Array<{ startDate?: string | null; endDate?: string | null }> | null;
};

function normalizeToken(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/-/g, '_');
}

/** Registration-fee tiers are the only ones that gate registration; the rest
 * (program fee, flight, visa) are payable after acceptance. */
export function isRegistrationFeeTier(tier: RegistrationTierLike): boolean {
  return normalizeToken(tier.fee_type ?? tier.feeType) === REGISTRATION_FEE_TYPE;
}

function periodsFromDates(dates: RegistrationDates): RegistrationValidityPeriod[] | undefined {
  if (!dates?.open || !dates?.close) return undefined;
  return [{ start_date: dates.open, end_date: dates.close }];
}

/**
 * A tier's validity periods in one shape, from either wire shape, falling back
 * to the edition's own registration dates when the tier carries none.
 *
 * FOR DISPLAY (period labels, "closes in X days"). Gating goes through
 * `getTierWindows`/`getTierRegistrationPhase`, which read the same data but
 * can express a half-bounded window that no date label could print.
 *
 * The fallback is the whole point: a tier with no windows is not a closed
 * tier, it is a tier governed by the programme's dates. Reading the raw field
 * instead had the homepage badge Closed and the /apply badge Open off the same
 * payload.
 */
export function normalizeValidityPeriods(
  tier: RegistrationTierLike | null | undefined,
  fallbackDates?: RegistrationDates,
): RegistrationValidityPeriod[] | undefined {
  // No tier at all is not a tier without dates: the edition simply does not
  // offer this category, so it inherits nothing. (Both fee cards always
  // render; the missing one must not borrow the programme's window and look
  // purchasable.)
  if (!tier) return undefined;

  const snake = tier?.validity_periods ?? [];
  const camel = tier?.validityPeriods ?? [];
  const merged: RegistrationValidityPeriod[] = [
    ...snake.map((p) => ({ start_date: p.start_date ?? '', end_date: p.end_date ?? '' })),
    ...camel.map((p) => ({ start_date: p.startDate ?? '', end_date: p.endDate ?? '' })),
  ].filter((p) => p.start_date !== '' && p.end_date !== '');

  if (merged.length > 0) return merged;
  return periodsFromDates(fallbackDates);
}

/** A parsed window, as instants. `start` is the EFFECTIVE start (see below).
 * A window may be half-bounded: a programme with no registration open date is
 * open from the beginning of time, exactly as the backend gate reads it
 * (see lib/registration/status.ts). */
export type RegistrationWindow = { start: number; end: number };

/**
 * Parse validity periods into instants, applying the one rule for "when has
 * this window started".
 *
 * Admins pick whole calendar days for a period's start/end, but a period's
 * `start_date` is only guaranteed to be WIB start-of-day for the
 * chronologically-EARLIEST period on a tier — that's the one gating "is
 * registration open" and the only one this widens (see
 * services/api/src/shared/utils/tier-period.util.ts for the server-side
 * counterpart and the 2026-09-01 Middle East Youth Summit 7th incident this
 * closes off: its opening period was stored at 23:59 WIB instead of 00:00,
 * so the strip read "Closed" all day it was meant to open).
 *
 * Every other period is compared exactly as received: chained periods
 * intentionally hand over at an exact instant (installment 2 starts the
 * moment installment 1 ends, frequently 23:59 WIB), and widening those too
 * would make adjacent installments overlap — two prices open at once.
 *
 * Windows that end before they start are dropped: no instant can fall inside
 * one, so honouring it would only ever produce a phantom "upcoming".
 *
 * Each result keeps its source `period` so the display labels in
 * lib/format/registration-period.ts can pick a window here and still print its
 * dates: one parser, so a card cannot badge Open off a widened start while its
 * own "closes in X days" label reads the raw one.
 */
export function parseRegistrationWindows<T extends RegistrationValidityPeriod>(
  periods: T[] | undefined,
): Array<RegistrationWindow & { period: T }> {
  if (!periods || periods.length === 0) return [];

  const parsed = periods
    .map((period) => ({
      period,
      start: new Date(period.start_date).getTime(),
      end: new Date(period.end_date).getTime(),
    }))
    .filter((p) => !Number.isNaN(p.start) && !Number.isNaN(p.end) && p.end >= p.start);
  if (parsed.length === 0) return [];

  const earliestStart = Math.min(...parsed.map((p) => p.start));
  return parsed.map((p) => ({
    period: p.period,
    start: p.start === earliestStart ? startOfWibDay(p.start) : p.start,
    end: p.end,
  }));
}

/**
 * The edition's own registration dates as a window, for tiers (or whole
 * editions) that carry no validity periods.
 *
 * Half-bounded on purpose, mirroring the backend gate and
 * lib/registration/status.ts: a null open date means "already open", a null
 * close date means "no end yet". Both null is no evidence at all, not an open
 * window, so it yields nothing and the caller falls through to closed. A close
 * before the open is a misconfiguration that can never be acted on; it is
 * dropped for the same reason an inverted validity period is.
 */
function windowsFromDates(dates: RegistrationDates): RegistrationWindow[] {
  if (!dates?.open && !dates?.close) return [];

  const openMs = dates?.open ? new Date(dates.open).getTime() : -Infinity;
  const closeMs = dates?.close ? new Date(dates.close).getTime() : Infinity;
  if (Number.isNaN(openMs) || Number.isNaN(closeMs)) return [];
  if (closeMs < openMs) return [];

  // Same WIB start-of-day widening the earliest tier window gets: an admin
  // picking a calendar day means that day in Jakarta.
  return [{ start: openMs === -Infinity ? openMs : startOfWibDay(openMs), end: closeMs }];
}

/**
 * The phase of a set of windows: open beats upcoming beats closed. Every phase
 * answer in the app bottoms out here, so a fee card and the banner above it
 * cannot rank the same windows differently.
 */
function getWindowsPhase(windows: RegistrationWindow[], now: Date): RegistrationPhase {
  const nowMs = now.getTime();
  if (windows.some((w) => w.start <= nowMs && nowMs <= w.end)) return 'open';
  if (windows.some((w) => w.start > nowMs)) return 'upcoming';
  return 'closed';
}

/**
 * Every window a single tier offers: its own validity periods, or the
 * edition's registration dates when it has none. A tier without windows is
 * not a closed tier, it is a tier governed by the programme's dates.
 */
function getTierWindows(
  tier: RegistrationTierLike | null | undefined,
  registrationDates?: RegistrationDates,
): RegistrationWindow[] {
  if (!tier) return [];

  const own = parseRegistrationWindows(normalizeValidityPeriods(tier));
  return own.length > 0 ? own : windowsFromDates(registrationDates);
}

/**
 * Every registration window an edition offers:
 *
 *   1. Its registration-fee tiers' windows (each falling back to the edition's
 *      registration dates when the tier carries none).
 *   2. No registration-fee tiers AT ALL -> the edition's registration dates
 *      are the only window there is (Istanbul Youth Summit and Youth Academic
 *      Forum ship none). An empty tier set is NOT evidence of closure; badging
 *      it Closed hid a programme whose registration ran to December.
 *
 * Both the per-edition badge and the layout countdown are built on this, so
 * "what windows does this edition have" has exactly one answer.
 */
export function getEditionWindows<T extends RegistrationTierLike>(
  tiers: T[] | null | undefined,
  registrationDates?: RegistrationDates,
): Array<RegistrationWindow & { tier: T | null }> {
  const feeTiers = (tiers ?? []).filter(isRegistrationFeeTier);

  if (feeTiers.length === 0) {
    return windowsFromDates(registrationDates).map((w) => ({ ...w, tier: null }));
  }

  return feeTiers.flatMap((tier) => getTierWindows(tier, registrationDates).map((w) => ({ ...w, tier })));
}

/**
 * The lifecycle phase of one fee tier. Tri-state, not boolean: a window that
 * has not started yet is `upcoming`, not `closed`. Badging it "Closed" tells a
 * prospective participant to go away days before you want them signing up
 * (Korea Youth Summit 4th, 2026-09-03).
 *
 * This is the VALIDITY-WINDOW gate ("can a visitor pick this fee tier and pay
 * today"). `lib/registration/status.ts` answers the PROGRAM-level question
 * ("would the backend accept a registration for this program at all"). They
 * are different questions with the same three answers, and they must never
 * contradict each other on one screen -- hence the shared `RegistrationPhase`.
 */
export function getTierRegistrationPhase(
  tier: RegistrationTierLike | null | undefined,
  registrationDates: RegistrationDates,
  now: Date,
): RegistrationPhase {
  return getWindowsPhase(getTierWindows(tier, registrationDates), now);
}

/** The badge phase for a whole edition. Same windows, same ranking, same
 * answer on the homepage strip and on /apply. */
export function getEditionRegistrationPhase(
  tiers: RegistrationTierLike[] | null | undefined,
  registrationDates: RegistrationDates,
  now: Date,
): RegistrationPhase {
  return getWindowsPhase(getEditionWindows(tiers, registrationDates), now);
}
