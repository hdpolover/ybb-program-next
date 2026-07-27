// lib/onboarding/friendlyOnboardingError.ts

import { NAME_RULE_MESSAGE, TEXT_RULE_MESSAGE } from './fieldRules';

type ValidationPattern = {
  test: RegExp;
  message: string;
};

// Ordered: first pattern that matches the raw message wins. These key off
// each backend class-validator constraint's distinct wording (see
// english-text.validator.ts in ybb-platform) — class-validator does not
// prepend the field name to a custom defaultMessage, so the messages below
// are the only signal available to tell "name" apart from "city".
const KNOWN_VALIDATION_PATTERNS: ValidationPattern[] = [
  {
    // IsEnglishName — only used on fullName in OnboardingDto.
    test: /english alphabet only/i,
    message: `Full name: ${NAME_RULE_MESSAGE}`,
  },
  {
    // IsEnglishText — used on originCity (and originCountry/knowledgeSource,
    // which in practice can't fail this check), so this is effectively the
    // city-field message.
    test: /standard english characters only/i,
    message: `City: ${TEXT_RULE_MESSAGE}`,
  },
  {
    test: /invalid country code/i,
    message: "We couldn't recognize your selected country. Please pick it again from the list.",
  },
];

const GENERIC_FALLBACK = 'Something went wrong on our end. Please try again in a moment.';

/**
 * Maps a raw onboarding-submit error (HTTP status + backend message) to
 * participant-friendly copy.
 *
 * Unlike friendlyAuthError, backend 4xx validation messages here are safe to
 * show as-is — they're plain-English class-validator strings describing
 * exactly what to fix, not internal/ops details. Only a handful of known
 * patterns get humanized further; everything else passes through unchanged.
 */
export function friendlyOnboardingError(status: number, rawMessage: string): string {
  const message = (rawMessage || '').trim();

  // 5xx and status 0 (network/unknown — no real response reached us) are
  // never actionable for the participant, and 4xx with no message at all
  // gives them nothing to act on either.
  if (status >= 500 || status === 0 || !message) {
    return GENERIC_FALLBACK;
  }

  const knownPattern = KNOWN_VALIDATION_PATTERNS.find((pattern) => pattern.test.test(message));
  if (knownPattern) return knownPattern.message;

  return message;
}
