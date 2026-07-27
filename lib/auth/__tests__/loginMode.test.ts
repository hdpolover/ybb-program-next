// lib/auth/__tests__/loginMode.test.ts

import { describe, it, expect } from 'vitest';
import { resolveLoginMode } from '../loginMode';

describe('resolveLoginMode', () => {
  it('opens sign-up for an explicit mode=signup', () => {
    expect(resolveLoginMode({ mode: 'signup', applicationCategory: null })).toBe('signup');
  });

  it('opens login for an explicit mode=login', () => {
    expect(resolveLoginMode({ mode: 'login', applicationCategory: null })).toBe('login');
  });

  it('treats a self-funded Register CTA as sign-up intent', () => {
    expect(resolveLoginMode({ mode: null, applicationCategory: 'self_funded' })).toBe('signup');
  });

  it('treats a fully-funded Register CTA as sign-up intent', () => {
    expect(resolveLoginMode({ mode: null, applicationCategory: 'fully_funded' })).toBe('signup');
  });

  // The "Sign in here" toggle pushes mode=login while preserving the rest of
  // the query, so an inherited applicationCategory must not drag it back.
  it('lets an explicit mode=login win over an inherited applicationCategory', () => {
    expect(resolveLoginMode({ mode: 'login', applicationCategory: 'self_funded' })).toBe('login');
  });

  it('has no opinion on a bare /login', () => {
    expect(resolveLoginMode({ mode: null, applicationCategory: null })).toBeNull();
  });

  it('ignores an unrecognised mode', () => {
    expect(resolveLoginMode({ mode: 'register', applicationCategory: null })).toBeNull();
  });

  it('ignores a blank applicationCategory', () => {
    expect(resolveLoginMode({ mode: null, applicationCategory: '   ' })).toBeNull();
  });
});
