// __tests__/middleware.test.ts

import { describe, it, expect } from 'vitest';
import { shouldStoreReferralCode, shouldRedirectReferralToSignup } from '@/middleware';

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
