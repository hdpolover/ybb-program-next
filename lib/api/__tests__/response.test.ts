// lib/api/__tests__/response.test.ts

import { describe, it, expect } from 'vitest';
import { getErrorMessage, getMessage } from '@/lib/api/response';

describe('getMessage', () => {
  it('joins a class-validator string[] message with "; "', () => {
    expect(
      getMessage({ message: ['fullName must not be empty', 'gender must be a valid enum value'] }),
    ).toBe('fullName must not be empty; gender must be a valid enum value');
  });

  it('passes a plain string message through unchanged', () => {
    expect(getMessage({ message: 'Invalid country code: XX' })).toBe('Invalid country code: XX');
  });

  it('returns null when message is missing', () => {
    expect(getMessage({})).toBeNull();
  });

  it('returns null for a non-string, non-string[] message', () => {
    expect(getMessage({ message: 42 })).toBeNull();
  });

  it('returns null for an empty message array', () => {
    expect(getMessage({ message: [] })).toBeNull();
  });

  it('returns null for a mixed-type message array', () => {
    expect(getMessage({ message: ['ok', 42] })).toBeNull();
  });

  it('returns null for a non-record payload', () => {
    expect(getMessage(null)).toBeNull();
    expect(getMessage('oops')).toBeNull();
  });
});

describe('getErrorMessage', () => {
  it('uses the joined string[] message when present', () => {
    expect(getErrorMessage({ message: ['a', 'b'] }, 'fallback')).toBe('a; b');
  });

  it('uses the string message when present', () => {
    expect(getErrorMessage({ message: 'boom' }, 'fallback')).toBe('boom');
  });

  it('falls back when the message is missing or unusable', () => {
    expect(getErrorMessage({}, 'Failed to submit onboarding')).toBe('Failed to submit onboarding');
    expect(getErrorMessage({ message: 42 }, 'Failed to submit onboarding')).toBe(
      'Failed to submit onboarding',
    );
  });
});
