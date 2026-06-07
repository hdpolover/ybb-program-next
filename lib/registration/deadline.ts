import type { ProgramPricingTier } from '@/lib/api/programs';

/**
 * Registration countdown deadline derivation.
 *
 * The deadline shown by the homepage countdowns follows the program's
 * registration-fee windows rather than a single program-level field:
 *   1. While the FULLY FUNDED registration window is still open, count down to
 *      its close date.
 *   2. Once the fully funded window has passed, fall back to the SELF FUNDED
 *      registration close date.
 *   3. When both windows have closed, there is no active deadline (null).
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
 * The registration close date for a category: the latest `endDate` across the
 * validity periods of all registration-fee tiers that allow the category.
 * Returns an ISO string, or null when no valid date is configured.
 */
export function getRegistrationCloseForCategory(
  tiers: DeadlineTier[],
  category: RegistrationCategory,
): string | null {
  const endDatesMs = tiers
    .filter(isRegistrationFeeTier)
    .filter((tier) => tierAllowsCategory(tier, category))
    .flatMap((tier) => tier.validityPeriods ?? [])
    .map((period) => parseDate(period.endDate))
    .filter((ms): ms is number => ms !== null);

  if (endDatesMs.length === 0) return null;
  return new Date(Math.max(...endDatesMs)).toISOString();
}

/**
 * Resolve the active registration deadline: fully funded close while it is in
 * the future, otherwise self funded close while it is in the future, otherwise
 * null. `now` is injected so callers control the reference clock (and tests
 * stay deterministic).
 */
export function resolveActiveRegistrationDeadline(
  tiers: DeadlineTier[] | null | undefined,
  now: Date,
): string | null {
  if (!tiers || tiers.length === 0) return null;
  const nowMs = now.getTime();

  const fullyFundedClose = getRegistrationCloseForCategory(tiers, 'fully_funded');
  if (fullyFundedClose && (parseDate(fullyFundedClose) ?? 0) > nowMs) {
    return fullyFundedClose;
  }

  const selfFundedClose = getRegistrationCloseForCategory(tiers, 'self_funded');
  if (selfFundedClose && (parseDate(selfFundedClose) ?? 0) > nowMs) {
    return selfFundedClose;
  }

  return null;
}

/**
 * Selesein kategori pendaftaran aktif sama deadlinenya secara bersamaan.
 * ngembaliin objek yang isinya kategori sama tenggat waktu, atau kasih null klo gk ada pendaftaran aktif
 */
export function resolveActiveRegistration(
  tiers: DeadlineTier[] | null | undefined,
  now: Date,
): { category: RegistrationCategory; deadline: string } | null {
  if (!tiers || tiers.length === 0) return null;
  const nowMs = now.getTime();

  const fullyFundedClose = getRegistrationCloseForCategory(tiers, 'fully_funded');
  if (fullyFundedClose && (parseDate(fullyFundedClose) ?? 0) > nowMs) {
    return { category: 'fully_funded', deadline: fullyFundedClose };
  }

  const selfFundedClose = getRegistrationCloseForCategory(tiers, 'self_funded');
  if (selfFundedClose && (parseDate(selfFundedClose) ?? 0) > nowMs) {
    return { category: 'self_funded', deadline: selfFundedClose };
  }

  return null;
}
