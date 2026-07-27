// lib/onboarding/fieldRules.ts
import { hasDisallowed } from '@/lib/text/restricted-input';

/**
 * Client-side mirror of the onboarding API's field validators
 * (@IsEnglishName / @IsEnglishText in the platform's english-text.validator.ts).
 *
 * The server messages name the allowed alphabet but not the common failure —
 * digits — so a participant staring at "owais56" reads "English letters only"
 * and sees nothing wrong. These say what to remove, and they run before the
 * request so the field is flagged instead of the whole form.
 */
export const NAME_RULE_MESSAGE =
  "Letters only — remove any numbers. Spaces, hyphens, apostrophes and periods are fine.";

export const TEXT_RULE_MESSAGE =
  'Use unaccented English characters only (e.g. "Adiyaman", not "Adıyaman").';

/** Empty is not this rule's business — required-ness is checked separately. */
export function nameRuleError(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  return hasDisallowed(trimmed, 'name') ? NAME_RULE_MESSAGE : null;
}

export function textRuleError(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  return hasDisallowed(trimmed, 'general') ? TEXT_RULE_MESSAGE : null;
}
