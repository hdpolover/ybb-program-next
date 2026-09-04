// lib/dashboard/__tests__/brandMismatch.test.ts

import { describe, it, expect } from 'vitest';
import { resolveBrandMismatch } from '@/lib/dashboard/brandMismatch';

describe('resolveBrandMismatch', () => {
  it('is a mismatch when the session brand and host brand differ', () => {
    expect(
      resolveBrandMismatch({ sessionBrandId: 'brand-meys', hostBrandId: 'brand-kys' }),
    ).toBe(true);
  });

  it('is NOT a mismatch when the session brand and host brand are the same', () => {
    expect(
      resolveBrandMismatch({ sessionBrandId: 'brand-kys', hostBrandId: 'brand-kys' }),
    ).toBe(false);
  });

  it('is NOT a mismatch when the host brand is null (unresolved domain)', () => {
    expect(
      resolveBrandMismatch({ sessionBrandId: 'brand-meys', hostBrandId: null }),
    ).toBe(false);
  });

  it('is NOT a mismatch when the host brand is undefined', () => {
    expect(
      resolveBrandMismatch({ sessionBrandId: 'brand-meys', hostBrandId: undefined }),
    ).toBe(false);
  });

  it('is NOT a mismatch when the session brand is missing (no session)', () => {
    expect(
      resolveBrandMismatch({ sessionBrandId: null, hostBrandId: 'brand-kys' }),
    ).toBe(false);
  });

  it('is NOT a mismatch when both ids are missing', () => {
    expect(resolveBrandMismatch({ sessionBrandId: null, hostBrandId: null })).toBe(false);
  });
});
