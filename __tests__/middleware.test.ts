// __tests__/middleware.test.ts

import { describe, it, expect } from 'vitest';
import {
  shouldStoreReferralCode,
  shouldRedirectReferralToSignup,
  normalizeReferralCode,
} from '@/middleware';

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

describe('normalizeReferralCode', () => {
  it('accepts a real 8-char ambassador code', () => {
    expect(normalizeReferralCode('HAM95757')).toBe('HAM95757');
  });

  // The backend matches codes by exact match and generates them uppercase, so
  // a hand-typed or link-mangled lowercase code has to be folded.
  it('uppercases a hand-typed lowercase code', () => {
    expect(normalizeReferralCode('ham95757')).toBe('HAM95757');
  });

  it('trims padding that would otherwise be stored verbatim', () => {
    expect(normalizeReferralCode('  HAM95757  ')).toBe('HAM95757');
  });

  it('accepts a hyphenated legacy code', () => {
    expect(normalizeReferralCode('REF-12345')).toBe('REF-12345');
  });

  it('rejects a short page word', () => {
    expect(normalizeReferralCode('lang')).toBeNull();
  });

  it('rejects a multi-word search phrase', () => {
    expect(normalizeReferralCode('youth summit')).toBeNull();
  });

  /**
   * Deliberate: a single long word IS shape-valid, because any rule loose
   * enough to admit real codes admits real search terms too. AMBASSADOR and
   * ELIGIBILITIES were both found on production participant records. What stops
   * them now is that `q`, `c` and `s` are no longer referral params, not this
   * function. Do not "fix" this by tightening the regex, it cannot be tightened
   * far enough without rejecting real codes.
   */
  it('cannot distinguish a long page word from a code (param list is the defense)', () => {
    expect(normalizeReferralCode('eligibilities')).toBe('ELIGIBILITIES');
    expect(normalizeReferralCode('ambassador')).toBe('AMBASSADOR');
  });

  it('rejects an over-length value that would overflow the column', () => {
    expect(normalizeReferralCode('A'.repeat(21))).toBeNull();
  });

  it('rejects empty, blank and missing values', () => {
    expect(normalizeReferralCode('')).toBeNull();
    expect(normalizeReferralCode('   ')).toBeNull();
    expect(normalizeReferralCode(null)).toBeNull();
    expect(normalizeReferralCode(undefined)).toBeNull();
  });
});

describe('shouldRedirectReferralToSignup', () => {
  it('sends an anonymous visitor from the program page to sign-up', () => {
    expect(
      shouldRedirectReferralToSignup({
        pathname: '/programs/china-youth-summit-2026',
        isAuthenticated: false,
      }),
    ).toBe(true);
  });

  it('sends an anonymous visitor from the home page to sign-up', () => {
    expect(shouldRedirectReferralToSignup({ pathname: '/', isAuthenticated: false })).toBe(true);
  });

  it('leaves a signed-in visitor on the page the link pointed at', () => {
    expect(
      shouldRedirectReferralToSignup({
        pathname: '/programs/china-youth-summit-2026',
        isAuthenticated: true,
      }),
    ).toBe(false);
  });

  // Guards the redirect loop: a referral param surviving onto the target must
  // not bounce the sign-up page back to itself.
  it('does not redirect a request already on the sign-up path', () => {
    expect(shouldRedirectReferralToSignup({ pathname: '/login', isAuthenticated: false })).toBe(
      false,
    );
  });
});
