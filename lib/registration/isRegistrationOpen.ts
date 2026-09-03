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

/**
 * The LAST instant of the WIB calendar day containing `date`.
 *
 * Mirrors services/api/src/shared/utils/wib-time.ts#endOfWibDay, which the
 * server applies to EVERY window end (see tier-period.util.ts#isWithinPeriod).
 * Admins pick whole calendar days, so an end stored at UTC midnight is 07:00
 * WIB: comparing the raw value closed every window at 7am Jakarta on its last
 * day while the API went on accepting registrations for another 17 hours.
 *
 * Fourth instance of this codebase's WIB defect class (audit M66, the admin
 * analytics day buckets, the "Opens 5 Sept" sticky-bar label).
 */
function endOfWibDay(ms: number): number {
  return startOfWibDay(ms) + MS_PER_DAY - 1;
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

  // EITHER dialect, never both: the two fields are two spellings of one list,
  // so a payload carrying both (the /apply page hydrates a snake_case edition
  // with camelCase pricing tiers) used to yield every window twice.
  const snake = tier?.validity_periods ?? [];
  const camel = tier?.validityPeriods ?? [];
  const own: RegistrationValidityPeriod[] =
    snake.length > 0
      ? snake.map((p) => ({ start_date: p.start_date ?? '', end_date: p.end_date ?? '' }))
      : camel.map((p) => ({ start_date: p.startDate ?? '', end_date: p.endDate ?? '' }));

  const usable = own.filter((p) => p.start_date !== '' && p.end_date !== '');
  if (usable.length > 0) return usable;
  return periodsFromDates(fallbackDates);
}

/** A parsed window, as instants. `start` is the EFFECTIVE start (see below).
 * A window may be half-bounded: a programme with no registration open date is
 * open from the beginning of time, exactly as the backend gate reads it
 * (see lib/registration/status.ts). */
export type RegistrationWindow = { start: number; end: number };

/**
 * Parse validity periods into instants, applying the one rule for "when has
 * this window started" and the one rule for "when does it stop".
 *
 * Admins pick whole CALENDAR DAYS, so both boundaries mean that day in
 * Jakarta:
 *
 *   END: always widened to WIB end-of-day, exactly as the server does for
 *   every period (services/api/src/shared/utils/tier-period.util.ts). An end
 *   stored at UTC midnight is 07:00 WIB, so the raw comparison shut every
 *   window at 7am Jakarta on its last day while the API kept accepting.
 *
 *   START: widened to WIB start-of-day UNLESS the period is CHAINED, i.e.
 *   some sibling ends at exactly this instant. Chained periods hand over on
 *   purpose (installment 2 begins the moment installment 1 ends, frequently
 *   23:59 WIB) and widening those would open two prices at once. Everything
 *   else is a window an admin opened on a calendar day, whether or not it
 *   happens to be the tier's first: the 2026-09-01 Middle East Youth Summit
 *   7th incident (opening period stored at 23:59 WIB, strip read "Closed" all
 *   day it was meant to open) recurs on any UNCHAINED window, not only on the
 *   array minimum, which is all the previous rule covered.
 *
 * DIVERGENCE, deliberate: tier-period.util.ts still widens only the
 * chronologically-earliest start, so a later unchained window reads open here
 * up to a day before the server's PRICING gate agrees. Registration itself is
 * gated by the programme's registration_close_date, which is unaffected, and
 * resolveTierPeriod falls through to the next unlapsed period, so the price
 * still resolves. The server should adopt the chained rule; until it does this
 * side is the one that matches what the admin entered.
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

  // Chaining is decided on RAW instants, before either widening, or a widened
  // end would invent handovers that the admin never entered. `index` guards
  // the self-comparison so a single-day window (start === end) is not read as
  // chained to itself. Tiers carry 10-22 periods in production, so the
  // pairwise scan is cheaper than the index it would take to avoid it.
  const isChained = (start: number, index: number) =>
    parsed.some((other, i) => i !== index && other.end === start);

  return parsed.map((p, i) => ({
    period: p.period,
    start: isChained(p.start, i) ? p.start : startOfWibDay(p.start),
    end: endOfWibDay(p.end),
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
export function windowsFromDates(dates: RegistrationDates): RegistrationWindow[] {
  if (!dates?.open && !dates?.close) return [];

  const openMs = dates?.open ? new Date(dates.open).getTime() : -Infinity;
  const closeMs = dates?.close ? new Date(dates.close).getTime() : Infinity;
  if (Number.isNaN(openMs) || Number.isNaN(closeMs)) return [];
  if (closeMs < openMs) return [];

  // Same WIB widening a tier window gets at both ends: an admin picking a
  // calendar day means that whole day in Jakarta.
  return [
    {
      start: openMs === -Infinity ? openMs : startOfWibDay(openMs),
      end: closeMs === Infinity ? closeMs : endOfWibDay(closeMs),
    },
  ];
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
 * edition's registration dates when it carries NONE AT ALL. A tier without
 * windows is not a closed tier, it is a tier governed by the programme's
 * dates.
 *
 * The fallback is deliberately not unconditional: a tier whose windows have
 * all LAPSED keeps that answer and reads `closed`, because the admin did
 * configure a window and it ended. Falling back there would resurrect a price
 * nobody may pay for as long as the programme's own close date is in the
 * future. The cost is that the programme-level gate
 * (lib/registration/status.ts) can still read `open` over a tier set that
 * reads `closed`; surfaces that funnel a visitor to /apply must therefore
 * combine the two with `narrowestPhase` rather than trusting either alone.
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
 *
 * GAP, known and not worked around here: `RegistrationProgramEdition` (the
 * home payload) carries no `allow_registration`, so every marketing surface
 * fed by it is blind to the programme-level kill switch that
 * lib/registration/status.ts checks first. An admin switching registration off
 * still leaves these badges and the banner reading Open until the API exposes
 * the flag on the edition. Faking it client-side would just be a fourth place
 * for the gate to drift.
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

const PHASE_RANK: Record<RegistrationPhase, number> = { closed: 0, upcoming: 1, open: 2 };

/**
 * The more restrictive of two phases (closed < upcoming < open).
 *
 * The PROGRAM-level gate (lib/registration/status.ts) and the VALIDITY-WINDOW
 * gate above answer different questions, and a surface that offers a visitor a
 * way to act needs both to say yes. A programme open until December whose only
 * fee window lapsed in August is `open` program-side and `closed` window-side:
 * a hero that trusted the program gate alone sent visitors to an /apply page
 * where every card said Closed and nothing was purchasable.
 */
export function narrowestPhase(a: RegistrationPhase, b: RegistrationPhase): RegistrationPhase {
  return PHASE_RANK[a] <= PHASE_RANK[b] ? a : b;
}
