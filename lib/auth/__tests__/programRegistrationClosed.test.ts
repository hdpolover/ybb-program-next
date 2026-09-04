// lib/auth/__tests__/programRegistrationClosed.test.ts

import { describe, it, expect } from 'vitest';
import { extractProgramRegistrationId } from '@/lib/auth/programRegistrationClosed';

// Regression: the active-program selector (ybb_active_program_id) was never
// synced off the auth response, so a returning MEYS 6th participant who just
// signed up for the 7th saw the 6th on their dashboard until they manually
// switched. extractProgramRegistrationId is what login/page.tsx now feeds
// into syncActiveProgramId before every post-auth redirect.
describe('extractProgramRegistrationId', () => {
  it('reads programId for the created status', () => {
    expect(
      extractProgramRegistrationId({ status: 'created', programId: 'p-7th', programName: 'MEYS 7th' }),
    ).toBe('p-7th');
  });

  it('reads programId for the existing status', () => {
    expect(
      extractProgramRegistrationId({ status: 'existing', programId: 'p-7th', programName: 'MEYS 7th' }),
    ).toBe('p-7th');
  });

  it('reads programId for the closed status too', () => {
    expect(
      extractProgramRegistrationId({ status: 'closed', programId: 'p-7th', programName: 'MEYS 7th' }),
    ).toBe('p-7th');
  });

  it('returns null when the field is absent', () => {
    expect(extractProgramRegistrationId(undefined)).toBeNull();
  });

  it('returns null for a non-object value', () => {
    expect(extractProgramRegistrationId('not-an-object')).toBeNull();
  });

  it('returns null when programId is missing or blank', () => {
    expect(extractProgramRegistrationId({ status: 'created' })).toBeNull();
    expect(extractProgramRegistrationId({ status: 'created', programId: '  ' })).toBeNull();
  });
});
