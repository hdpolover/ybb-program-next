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
