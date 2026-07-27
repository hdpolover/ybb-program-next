// lib/onboarding/__tests__/friendlyOnboardingError.test.ts

import { describe, it, expect } from 'vitest';
import { friendlyOnboardingError } from '@/lib/onboarding/friendlyOnboardingError';
import { NAME_RULE_MESSAGE, TEXT_RULE_MESSAGE, nameRuleError, textRuleError } from '@/lib/onboarding/fieldRules';

const GENERIC = 'Something went wrong on our end. Please try again in a moment.';

describe('friendlyOnboardingError', () => {
  it('returns the generic fallback for a 5xx status', () => {
    expect(friendlyOnboardingError(500, 'Internal server error')).toBe(GENERIC);
    expect(friendlyOnboardingError(503, 'Service unavailable')).toBe(GENERIC);
  });

  it('returns the generic fallback for status 0 (network/unknown failure)', () => {
    expect(friendlyOnboardingError(0, 'Failed to fetch')).toBe(GENERIC);
  });

  it('humanizes the English-name validator message', () => {
    const raw = "fullName must use the English alphabet only (letters, spaces, - ' .)";
    expect(friendlyOnboardingError(400, raw)).toBe(`Full name: ${NAME_RULE_MESSAGE}`);
  });

  it('humanizes the English-text (city) validator message', () => {
    const raw = 'originCity must use standard English characters only (no accented or non-Latin characters)';
    expect(friendlyOnboardingError(400, raw)).toBe(`City: ${TEXT_RULE_MESSAGE}`);
  });

  it('humanizes an invalid country code message', () => {
    expect(friendlyOnboardingError(400, 'Invalid country code: XX')).toBe(
      "We couldn't recognize your selected country. Please pick it again from the list.",
    );
  });

  it('passes an unknown 4xx message through unchanged', () => {
    expect(friendlyOnboardingError(409, 'Onboarding already completed')).toBe(
      'Onboarding already completed',
    );
  });

  it('returns the generic fallback for an empty message', () => {
    expect(friendlyOnboardingError(400, '')).toBe(GENERIC);
  });

  it('returns the generic fallback for a whitespace-only message', () => {
    expect(friendlyOnboardingError(422, '   ')).toBe(GENERIC);
  });
});

describe('field rules mirror the API validators', () => {
  it('flags digits in a name — the failure the server copy never named', () => {
    expect(nameRuleError('owaiskhalifa56')).toBe(NAME_RULE_MESSAGE);
    expect(nameRuleError('sumera.inam23')).toBe(NAME_RULE_MESSAGE);
  });

  it('accepts real names the API accepts', () => {
    expect(nameRuleError("Anne-Marie O'Brien")).toBeNull();
    expect(nameRuleError('Dr. Owais Khalifa')).toBeNull();
  });

  it('leaves required-ness to the required check', () => {
    expect(nameRuleError('')).toBeNull();
    expect(nameRuleError('   ')).toBeNull();
    expect(textRuleError('')).toBeNull();
  });

  it('flags accented city names the dropdown used to submit raw', () => {
    expect(textRuleError('Adıyaman')).toBe(TEXT_RULE_MESSAGE);
    expect(textRuleError('Bogotá')).toBe(TEXT_RULE_MESSAGE);
  });

  it('accepts folded city names', () => {
    expect(textRuleError('Adiyaman')).toBeNull();
    expect(textRuleError('Ho Chi Minh')).toBeNull();
  });
});

describe('field attribution comes from the property, not the message text', () => {
  it('names Country when originCountry fails the shared text constraint', () => {
    const raw = 'originCountry must use standard English characters only (no accented or non-Latin characters)';
    expect(friendlyOnboardingError(400, raw)).toBe(`Country: ${TEXT_RULE_MESSAGE}`);
  });

  it('names the program-source field when it fails the same constraint', () => {
    const raw = 'knowledgeSource must use standard English characters only (no accented or non-Latin characters)';
    expect(friendlyOnboardingError(400, raw)).toBe(
      `Where you heard about us: ${TEXT_RULE_MESSAGE}`,
    );
  });

  it('drops the label rather than guessing when the API sends no property', () => {
    // An API that has not shipped the property prefix yet, or a field with no
    // label mapping — better unlabelled than wrongly labelled "City".
    expect(
      friendlyOnboardingError(400, 'must use standard English characters only (no accented or non-Latin characters)'),
    ).toBe(TEXT_RULE_MESSAGE);
    expect(
      friendlyOnboardingError(400, 'someNewField must use standard English characters only (no accented or non-Latin characters)'),
    ).toBe(TEXT_RULE_MESSAGE);
  });
});
