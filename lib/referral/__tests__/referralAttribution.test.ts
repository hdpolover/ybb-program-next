// lib/referral/__tests__/referralAttribution.test.ts

import { describe, it, expect } from 'vitest';
import { pickScopedProgramId, resolveReferralActive } from '@/lib/referral/referralAttribution';

describe('resolveReferralActive', () => {
  it('is active when valid and referredByName is a non-empty string', () => {
    expect(resolveReferralActive({ valid: true, referredByName: 'Jane Doe' })).toBe(true);
  });

  it('is not active when valid is false', () => {
    expect(resolveReferralActive({ valid: false, referredByName: 'Jane Doe' })).toBe(false);
  });

  it('is not active when referredByName is null', () => {
    expect(resolveReferralActive({ valid: true, referredByName: null })).toBe(false);
  });

  it('is not active when referredByName is missing', () => {
    expect(resolveReferralActive({ valid: true })).toBe(false);
  });

  it('is not active when referredByName is blank/whitespace', () => {
    expect(resolveReferralActive({ valid: true, referredByName: '   ' })).toBe(false);
  });

  it('is not active for null or undefined input', () => {
    expect(resolveReferralActive(null)).toBe(false);
    expect(resolveReferralActive(undefined)).toBe(false);
  });
});

describe('pickScopedProgramId', () => {
  it('returns the programId when exactly one registered program exists', () => {
    expect(pickScopedProgramId([{ programId: 'prog-1' }])).toBe('prog-1');
  });

  it('returns undefined when there are zero registered programs', () => {
    expect(pickScopedProgramId([])).toBeUndefined();
  });

  it('returns undefined when there are multiple registered programs (ambiguous)', () => {
    expect(pickScopedProgramId([{ programId: 'prog-1' }, { programId: 'prog-2' }])).toBeUndefined();
  });

  it('returns undefined when registeredPrograms is undefined', () => {
    expect(pickScopedProgramId(undefined)).toBeUndefined();
  });
});
