// lib/registration/categoryPhase.ts
//
// Per-CATEGORY registration phase (Fully Funded / Self Funded), built on the
// same tier-window parser as every other registration badge
// (lib/registration/isRegistrationOpen.ts).
//
// Why: a category's deadline is its registration-fee pricing tier's validity
// periods. The programme's own registration dates track the LAST category to
// close, so "Fully Funded closed, Self Funded still open" is only visible in
// the tiers. The homepage strip already disabled the Fully Funded card, but the
// login page trusted ?applicationCategory= from the URL, so old ads and
// bookmarked links kept creating Fully Funded accounts (MEYS/CYS 2026) after
// that window ended.
//
// Server counterpart: services/api/src/shared/utils/tier-period.util.ts
// #getCategoryRegistrationPhase in ybb-platform, which also creates the
// application under the open category and reports categoryFallback. This side
// exists so the person sees the change BEFORE they submit.

import {
  getTierRegistrationPhase,
  isRegistrationFeeTier,
  type RegistrationDates,
  type RegistrationTierLike,
} from '@/lib/registration/isRegistrationOpen';
import type { RegistrationPhase } from '@/lib/registration/status';

export type RegistrationCategory = 'self_funded' | 'fully_funded';

/** 'unconfigured': no registration-fee tier offers the category at all. Not a
 * closure, and never a reason to move someone off it. */
export type CategoryRegistrationPhase = RegistrationPhase | 'unconfigured';

export type CategoryTierLike = RegistrationTierLike & {
  allowed_categories?: readonly string[] | null;
  allowedCategories?: readonly string[] | null;
};

export function normalizeRegistrationCategory(value: string | null | undefined): RegistrationCategory | null {
  const normalized = (value ?? '').trim().toLowerCase().replace(/-/g, '_');
  if (normalized === 'self_funded' || normalized === 'fully_funded') return normalized;
  return null;
}

export function registrationCategoryLabel(category: RegistrationCategory): string {
  return category === 'fully_funded' ? 'Fully Funded' : 'Self Funded';
}

function tierAllowsCategory(tier: CategoryTierLike, category: RegistrationCategory): boolean {
  const allowed = tier.allowed_categories ?? tier.allowedCategories ?? [];
  // Strict, like the server: an empty list gates nobody.
  return allowed.some((item) => normalizeRegistrationCategory(String(item)) === category);
}

/**
 * Open beats upcoming beats closed across every registration-fee tier that
 * offers `category`; a tier with no windows follows the edition's
 * registration dates (getTierRegistrationPhase).
 */
export function getCategoryRegistrationPhase(
  tiers: readonly CategoryTierLike[] | null | undefined,
  category: RegistrationCategory,
  registrationDates: RegistrationDates,
  now: Date,
): CategoryRegistrationPhase {
  const categoryTiers = (tiers ?? []).filter(
    (tier) => isRegistrationFeeTier(tier) && tierAllowsCategory(tier, category),
  );
  if (categoryTiers.length === 0) return 'unconfigured';

  const phases = categoryTiers.map((tier) => getTierRegistrationPhase(tier, registrationDates, now));
  if (phases.includes('open')) return 'open';
  if (phases.includes('upcoming')) return 'upcoming';
  return 'closed';
}

export type SignupCategoryResolution = {
  /** What the signup should submit ('' when nothing was requested). */
  category: string;
  /** Set when the requested category is not open and another one is. */
  fallback?: CategoryFallback & { reason: 'closed' | 'upcoming' };
};

export type CategoryFallback = { requested: RegistrationCategory; assigned: RegistrationCategory };

/**
 * The category a signup should actually submit for an edition.
 *
 * Mirrors the server rule so the page and the API agree: keep the request when
 * its category is open (or has no tier); otherwise move to the other category
 * only if THAT one is open. When neither is open the request is left alone and
 * the server answers (it reports registration closed).
 */
export function resolveSignupCategory(
  requestedCategory: string,
  edition: { registration_types?: readonly CategoryTierLike[] | null; registration_dates?: RegistrationDates } | null | undefined,
  now: Date,
): SignupCategoryResolution {
  const requested = normalizeRegistrationCategory(requestedCategory);
  if (!requested || !edition) return { category: requestedCategory };

  const tiers = edition.registration_types ?? [];
  const dates = edition.registration_dates;
  const requestedPhase = getCategoryRegistrationPhase(tiers, requested, dates, now);
  if (requestedPhase === 'open' || requestedPhase === 'unconfigured') {
    return { category: requestedCategory };
  }

  const alternative: RegistrationCategory = requested === 'fully_funded' ? 'self_funded' : 'fully_funded';
  if (getCategoryRegistrationPhase(tiers, alternative, dates, now) !== 'open') {
    return { category: requestedCategory };
  }

  return {
    category: alternative,
    fallback: { requested, assigned: alternative, reason: requestedPhase === 'upcoming' ? 'upcoming' : 'closed' },
  };
}

/** Shown on the signup form before submit. */
export function buildCategoryFallbackNotice(
  fallback: CategoryFallback & { reason?: 'closed' | 'upcoming' },
  programName?: string | null,
): string {
  const requested = registrationCategoryLabel(fallback.requested);
  const assigned = registrationCategoryLabel(fallback.assigned);
  const where = programName?.trim() ? ` for ${programName.trim()}` : '';
  const state = fallback.reason === 'upcoming' ? 'has not opened yet' : 'has closed';
  return `${requested} registration${where} ${state}, so you will be registered as ${assigned}.`;
}
