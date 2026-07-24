// __tests__/middleware.test.ts

import { describe, it, expect } from 'vitest';
import { shouldStoreReferralCode } from '@/middleware';

describe('shouldStoreReferralCode', () => {
  it('rejects an empty code', () => {
    expect(shouldStoreReferralCode('')).toBe(false);
  });

  it('rejects a whitespace-only code', () => {
    expect(shouldStoreReferralCode('   ')).toBe(false);
  });

  it('keeps a normal ambassador code', () => {
    expect(shouldStoreReferralCode('ABC-123')).toBe(true);
  });

  it('keeps a code at exactly the 20-char cap', () => {
    expect(shouldStoreReferralCode('A'.repeat(20))).toBe(true);
  });

  it('rejects a code over the 20-char cap', () => {
    expect(shouldStoreReferralCode('A'.repeat(21))).toBe(false);
  });

  it('trims surrounding whitespace before measuring length', () => {
    expect(shouldStoreReferralCode(`  ${'A'.repeat(20)}  `)).toBe(true);
    expect(shouldStoreReferralCode(`  ${'A'.repeat(21)}  `)).toBe(false);
  });
});
