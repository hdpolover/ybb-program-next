// lib/onboarding/friendlyOnboardingError.ts

import { NAME_RULE_MESSAGE, TEXT_RULE_MESSAGE } from './fieldRules';

type ValidationPattern = {
  test: RegExp;
  message: string;
};

// Human label per DTO property, so the copy can name the field the participant
// actually sees. The API prefixes its validator messages with the property
// (see english-text.validator.ts in ybb-platform) precisely so this is
// possible — originCity and originCountry share one constraint and are
// otherwise indistinguishable from the message text.
const FIELD_LABELS: Record<string, string> = {
  fullName: 'Full name',
  originCity: 'City',
  originCountry: 'Country',
  knowledgeSource: 'Where you heard about us',
};

// Ordered: first pattern that matches the raw message wins. These key off each
// backend constraint's distinct wording; the field name, when the message
// carries one, is prepended separately by labelFor().
const KNOWN_VALIDATION_PATTERNS: ValidationPattern[] = [
  {
    // IsEnglishName
    test: /english alphabet only/i,
    message: NAME_RULE_MESSAGE,
  },
  {
    // IsEnglishText — guards originCity, originCountry and knowledgeSource.
    test: /standard english characters only/i,
    message: TEXT_RULE_MESSAGE,
  },
  {
    test: /invalid country code/i,
    message: "We couldn't recognize your selected country. Please pick it again from the list.",
  },
];

/**
 * Reads the leading DTO property off a class-validator message
 * ("originCity must use ...") and returns its participant-facing label.
 * Returns null for messages that carry no property, which keeps this working
 * against an API that has not shipped the prefix yet.
 */
function labelFor(message: string): string | null {
  const property = message.match(/^([a-zA-Z][a-zA-Z0-9_]*)\s+must\s/)?.[1];
  if (!property) return null;
  return FIELD_LABELS[property] ?? null;
}

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
  if (!knownPattern) return message;

  const label = labelFor(message);
  return label ? `${label}: ${knownPattern.message}` : knownPattern.message;
}
