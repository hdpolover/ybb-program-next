import type { ProgramPricingTier } from '@/lib/api/programs';

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

const REGISTRATION_FEE_TYPE = 'registration_fee';

type DeadlineTier = Pick<
  ProgramPricingTier,
  'feeType' | 'allowedCategories' | 'validityPeriods'
>;

function normalizeToken(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase().replace(/-/g, '_');
}

function isRegistrationFeeTier(tier: DeadlineTier): boolean {
  return normalizeToken(tier.feeType) === REGISTRATION_FEE_TYPE;
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
export function getRegistrationCloseForCategory(
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
 * Resolve the active registration deadline: fully funded close while any
 * future window exists, otherwise self funded close, otherwise null.
 */
export function resolveActiveRegistrationDeadline(
  tiers: DeadlineTier[] | null | undefined,
  now: Date,
): string | null {
  if (!tiers || tiers.length === 0) return null;

  return (
    getRegistrationCloseForCategory(tiers, 'fully_funded', now) ??
    getRegistrationCloseForCategory(tiers, 'self_funded', now) ??
    null
  );
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

  const candidates: Array<CountdownWinner & { categoryLabel: string | null; ms: number }> = [];

  for (const edition of editions) {
    for (const tier of edition.registration_types ?? []) {
      if (!isRegistrationFeeTier(tier)) continue;
      for (const period of tier.validityPeriods ?? []) {
        const start = parseDate((period as { startDate?: string | null }).startDate);
        const end = parseDate((period as { endDate?: string | null }).endDate);
        if (start === null || end === null) continue;
        // Only a window covering now. An upcoming window is not something a
        // visitor can act on yet, and a lapsed one is gone.
        if (start > nowMs || end < nowMs) continue;
        candidates.push({
          deadline: new Date(end).toISOString(),
          programName: edition.program_name,
          categoryLabel: describeTierCategory(tier),
          ms: end,
        });
      }
    }
  }

  if (candidates.length === 0) return null;
  const winner = candidates.reduce((soonest, c) => (c.ms < soonest.ms ? c : soonest));
  return { deadline: winner.deadline, programName: winner.programName, categoryLabel: winner.categoryLabel };
}

/** "Fully Funded" / "Self Funded" for the banner label, or null when a tier is not category specific. */
function describeTierCategory(tier: DeadlineTier): string | null {
  const cats = (tier.allowedCategories ?? []).map(normalizeToken);
  if (cats.length !== 1) return null;
  if (cats[0] === 'fully_funded') return 'Fully Funded';
  if (cats[0] === 'self_funded') return 'Self Funded';
  return null;
}

export function resolveCountdownAcrossPrograms(
  editions: CountdownProgramEdition[] | null | undefined,
  now: Date,
): CountdownWinner | null {
  if (!editions || editions.length === 0) return null;

  const nowMs = now.getTime();
  const candidates = editions
    .map((edition) => {
      const tierDeadline = resolveActiveRegistrationDeadline(edition.registration_types, now);
      const deadline = resolveRegistrationCountdownDeadline(edition.registration_dates?.close, tierDeadline);
      return deadline ? { deadline, programName: edition.program_name } : null;
    })
    .filter((candidate): candidate is CountdownWinner => candidate !== null)
    .filter((candidate) => {
      const ms = parseDate(candidate.deadline);
      return ms !== null && ms > nowMs;
    });

  if (candidates.length === 0) return null;

  return candidates.reduce((soonest, candidate) =>
    (parseDate(candidate.deadline) ?? Infinity) < (parseDate(soonest.deadline) ?? Infinity) ? candidate : soonest,
  );
}
