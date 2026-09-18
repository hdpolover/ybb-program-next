// lib/referral/__tests__/fieldLooksLikeReferral.test.ts

import { describe, it, expect } from 'vitest';
import { fieldLooksLikeReferral } from '@/lib/referral/fieldLooksLikeReferral';

describe('fieldLooksLikeReferral', () => {
  it('matches ref_code_ambassador by name', () => {
    expect(fieldLooksLikeReferral({ name: 'ref_code_ambassador' })).toBe(true);
  });
  it('matches "Ambassador Referral Code (optional)" by label', () => {
    expect(fieldLooksLikeReferral({ label: 'Ambassador Referral Code (optional)' })).toBe(true);
  });

  it('matches ambassador_referral_code by name', () => {
    expect(fieldLooksLikeReferral({ name: 'ambassador_referral_code' })).toBe(true);
  });
  it('matches "Ambassador Referral Code" by label', () => {
    expect(fieldLooksLikeReferral({ label: 'Ambassador Referral Code' })).toBe(true);
  });
  it('matches "Ambassador Referral Code (optional)" label variant', () => {
    expect(
      fieldLooksLikeReferral({ name: 'ambassador_referral_code', label: 'Ambassador Referral Code (optional)' }),
    ).toBe(true);
  });

  it('does NOT match referral_source by name', () => {
    expect(fieldLooksLikeReferral({ name: 'referral_source' })).toBe(false);
  });
  it('does NOT match "How did you hear about us?" by label', () => {
    expect(fieldLooksLikeReferral({ label: 'How did you hear about us?' })).toBe(false);
  });

  it('does NOT match referral_source_detail by name', () => {
    expect(fieldLooksLikeReferral({ name: 'referral_source_detail' })).toBe(false);
  });
  it('does NOT match "Referral source detail" by label', () => {
    expect(fieldLooksLikeReferral({ label: 'Referral source detail' })).toBe(false);
  });
  it('does NOT match "Requirement Evidence Link" label even when name is referral_source_detail', () => {
    expect(
      fieldLooksLikeReferral({ name: 'referral_source_detail', label: 'Requirement Evidence Link' }),
    ).toBe(false);
  });

  it('matches via explicit fieldKind opt-in even when name/label look unrelated', () => {
    expect(
      fieldLooksLikeReferral({
        name: 'some_unrelated_field',
        label: 'Totally unrelated label',
        validationRules: { fieldKind: 'referral' },
      }),
    ).toBe(true);
    expect(
      fieldLooksLikeReferral({
        name: 'evidence_link',
        label: 'Requirement Evidence Link',
        validationRules: { fieldKind: 'ambassador_code' },
      }),
    ).toBe(true);
  });
});
