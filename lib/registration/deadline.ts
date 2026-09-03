import type { ProgramPricingTier } from '@/lib/api/programs';
import {
  getEditionWindows,
  isRegistrationFeeTier,
} from '@/lib/registration/isRegistrationOpen';

/**
 * Registration countdown deadline derivation.
 *
 * The deadline shown by the homepage countdowns follows the program's
 * registration-fee windows rather than a single program-level field:
 *   1. While ANY fully funded registration window is still open, count down to
 *      the nearest upcoming close date for that category. Fully funded is always
 *      the anchor — as long as any future period exists, it takes precedence.
 *   2. Once all fully funded windows have closed, fall back to the nearest
 *      upcoming self funded registration close date.
 *   3. When both categories have no future windows, there is no active deadline (null).
 *
 * Dates come from each pricing tier's `validityPeriods`, scoped to tiers whose
 * `feeType` is `registration_fee` and whose `allowedCategories` include the
 * target category.
 */

export type RegistrationCategory = 'fully_funded' | 'self_funded';

type DeadlineTier = Pick<
  ProgramPricingTier,
  'feeType' | 'allowedCategories' | 'validityPeriods'
>;

function normalizeToken(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/-/g, '_');
}

function tierAllowsCategory(tier: DeadlineTier, category: RegistrationCategory): boolean {
  const categories = (tier.allowedCategories ?? []).map(normalizeToken);
  // An empty list means the tier is not category-restricted, so it applies to all.
  if (categories.length === 0) return true;
  return categories.includes(category);
}

function parseDate(value: string | null | undefined): number | null {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

/**
 * The nearest upcoming registration close date for a category: the minimum
 * `endDate` greater than `now` across all matching registration-fee tier
 * validity periods. Returns an ISO string, or null when no future date exists.
 */
function getRegistrationCloseForCategory(
  tiers: DeadlineTier[],
  category: RegistrationCategory,
  now: Date,
): string | null {
  const nowMs = now.getTime();
  const futureEndDatesMs = tiers
    .filter(isRegistrationFeeTier)
    .filter((tier) => tierAllowsCategory(tier, category))
    .flatMap((tier) => tier.validityPeriods ?? [])
    .map((period) => parseDate(period.endDate))
    .filter((ms): ms is number => ms !== null && ms > nowMs);

  if (futureEndDatesMs.length === 0) return null;
  return new Date(Math.min(...futureEndDatesMs)).toISOString();
}

/**
 * Resolve the active registration category and its deadline together.
 * Fully funded is always checked first; if any future window remains it takes
 * precedence over self funded. Returns null when no open window exists.
 */
export function resolveActiveRegistration(
  tiers: DeadlineTier[] | null | undefined,
  now: Date,
): { category: RegistrationCategory; deadline: string } | null {
  if (!tiers || tiers.length === 0) return null;

  const fullyFundedClose = getRegistrationCloseForCategory(tiers, 'fully_funded', now);
  if (fullyFundedClose) return { category: 'fully_funded', deadline: fullyFundedClose };

  const selfFundedClose = getRegistrationCloseForCategory(tiers, 'self_funded', now);
  if (selfFundedClose) return { category: 'self_funded', deadline: selfFundedClose };

  return null;
}

/**
 * Resolve the deadline shown by the homepage countdown/gates.
 *
 * Incident (2026-08-21): the program's real registrationCloseDate was
 * overridden by a pricing tier's registration-fee validity window, which can
 * close months earlier. middleeastyouthsummit.com advertised "closes in"
 * Aug 31 while the real registrationCloseDate was Dec 5. The program's own
 * close date must always win when it is set; the tier deadline is only a
 * fallback for the handful of brands whose program has no
 * registrationCloseDate at all (Istanbul Youth Summit, Youth Academic Forum).
 */
export function resolveRegistrationCountdownDeadline(
  programRegistrationCloseDate: string | null | undefined,
  tierDeadline: string | null | undefined,
): string | null {
  return programRegistrationCloseDate ?? tierDeadline ?? null;
}

/** One currently-relevant program edition, as carried by the home API's
 * registration_overview.content.programs (see home.strategy.ts). */
export type CountdownProgramEdition = {
  program_name: string;
  registration_dates: { open: string | null; close: string | null };
  registration_types: DeadlineTier[];
};

export type CountdownWinner = {
  deadline: string;
  programName: string;
};

/**
 * Resolve the homepage countdown across every currently-relevant program
 * edition (MEYS 6th/7th concurrent-active-programs bug: a brand can have
 * more than one program with open registration at once, so a single
 * program's deadline is no longer guaranteed to be the one actually
 * counting down soonest). For each edition this applies the SAME precedence
 * as resolveRegistrationCountdownDeadline (that edition's own
 * registrationCloseDate wins, its tier deadline is only a fallback), then
 * picks the soonest of those and names the edition it came from, so the
 * countdown can never again describe a different program than the cards
 * shown below it.
 */
/**
 * Every registration window on every edition, as instants, tagged with the
 * edition and category it belongs to.
 *
 * The start rule lives in lib/registration/isRegistrationOpen (WIB
 * start-of-day widening on a tier's earliest window, program dates as the
 * fallback for a tier or an edition that carries none) and is NOT restated
 * here. Comparing raw `startDate` here instead is what had the fee card
 * badging Open next to a sticky bar reading "Opens 31 Aug" for the same 23
 * hours: one rule, two implementations.
 */
function allWindows(
  editions: CountdownProgramEdition[],
): Array<{ start: number; end: number; programName: string; categoryLabel: string | null }> {
  return editions.flatMap((edition) =>
    getEditionWindows(edition.registration_types, edition.registration_dates).map((w) => ({
      start: w.start,
      end: w.end,
      programName: edition.program_name,
      categoryLabel: w.tier ? describeTierCategory(w.tier) : null,
    })),
  );
}

/**
 * The soonest registration window that is OPEN RIGHT NOW, across every edition
 * and category, with the edition and category it belongs to.
 *
 * This is what the banner counts to. The 2026-08-21 incident made the program
 * level close date win instead, because a lapsed tier chain had the banner
 * advertising "closes 31 Aug" while registration really ran to 5 Dec. That
 * failure is not reachable here: a lapsed chain has no window covering now, so
 * it contributes no candidate and the caller falls back to the program date.
 * Only a window a visitor can actually act on can win.
 */
export function resolveOpenWindowCountdown(
  editions: CountdownProgramEdition[] | null | undefined,
  now: Date,
): (CountdownWinner & { categoryLabel: string | null }) | null {
  if (!editions || editions.length === 0) return null;
  const nowMs = now.getTime();

  // An open window with no close date has nothing to count down to; the CTA
  // still shows via the phase, the clock just has no target.
  const candidates = allWindows(editions).filter(
    (w) => w.start <= nowMs && nowMs <= w.end && Number.isFinite(w.end),
  );
  if (candidates.length === 0) return null;

  const winner = candidates.reduce((soonest, c) => (c.end < soonest.end ? c : soonest));
  return {
    deadline: new Date(winner.end).toISOString(),
    programName: winner.programName,
    categoryLabel: winner.categoryLabel,
  };
}

/** "Fully Funded" / "Self Funded" for the banner label, or null when a tier is not category specific. */
function describeTierCategory(tier: DeadlineTier): string | null {
  const cats = (tier.allowedCategories ?? []).map(normalizeToken);
  if (cats.length !== 1) return null;
  if (cats[0] === 'fully_funded') return 'Fully Funded';
  if (cats[0] === 'self_funded') return 'Self Funded';
  return null;
}

/**
 * The soonest registration window that has NOT STARTED YET, across every
 * edition and category. The "deadline" it returns is that window's START:
 * what the banner should count down to when nothing is open, so a programme
 * opening in two days stops advertising a countdown to a close date months
 * away that nobody can act on.
 */
export function resolveUpcomingWindowCountdown(
  editions: CountdownProgramEdition[] | null | undefined,
  now: Date,
): (CountdownWinner & { categoryLabel: string | null }) | null {
  if (!editions || editions.length === 0) return null;
  const nowMs = now.getTime();

  const candidates = allWindows(editions).filter((w) => w.start > nowMs && Number.isFinite(w.start));
  if (candidates.length === 0) return null;

  const winner = candidates.reduce((soonest, c) => (c.start < soonest.start ? c : soonest));
  return {
    deadline: new Date(winner.start).toISOString(),
    programName: winner.programName,
    categoryLabel: winner.categoryLabel,
  };
}

export type RegistrationCountdownResolution = CountdownWinner & {
  categoryLabel: string | null;
  /** What the deadline MEANS: 'open' counts down to a close, 'upcoming' to an
   * opening. One value, so the CTA and the clock can never disagree. */
  phase: 'open' | 'upcoming';
};

/**
 * The homepage countdown rule, in resolution order. Kept here rather than
 * inlined in app/layout.tsx so the branches are one readable rule AND
 * unit-testable; layout calls it in a single line.
 *
 *   1. Something OPEN  -> count down to that window's close. Register CTA live.
 *      (MEYS shape: one edition open, another upcoming. Must not regress.)
 *   2. Nothing open, something UPCOMING -> count down to the soonest OPEN date.
 *      Caller must not render a register CTA. (KYS 4th shape, 2026-09-03.)
 *   3. Nothing open, nothing upcoming -> null. "Closed" is finally the truth.
 *
 * Editions that carry no registration-fee validity windows are not a fourth
 * branch: `getEditionWindows` already turns their program-level registration
 * dates into a window, so Istanbul Youth Summit keeps its countdown to 5 Dec
 * even when a sibling edition's windows have all lapsed. That used to be an
 * all-or-nothing global test (`hasAnyRegistrationWindow`), which blanked
 * Istanbul's banner and bar whenever ANY edition anywhere had a window.
 */
export function resolveRegistrationCountdown(
  editions: CountdownProgramEdition[] | null | undefined,
  now: Date,
): RegistrationCountdownResolution | null {
  if (!editions || editions.length === 0) return null;

  const open = resolveOpenWindowCountdown(editions, now);
  if (open) return { ...open, phase: 'open' };

  const upcoming = resolveUpcomingWindowCountdown(editions, now);
  if (upcoming) return { ...upcoming, phase: 'upcoming' };

  return null;
}
