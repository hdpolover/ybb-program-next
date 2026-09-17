// lib/auth/__tests__/programRegistrationClosed.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import {
  applyAuthProgramSelection,
  extractCreatedProgramRegistrationId,
  extractProgramRegistrationId,
} from '@/lib/auth/programRegistrationClosed';
import {
  ACTIVE_PROGRAM_STORAGE_KEY,
  EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY,
} from '@/lib/dashboard/activeProgram';

// Regression: the active-program selector (ybb_active_program_id) was never
// synced off the auth response, so a returning MEYS 6th participant who just
// signed up for the 7th saw the 6th on their dashboard until they manually
// switched. login/page.tsx now pins it through applyAuthProgramSelection, which
// only does so for 'created' (see the MEYS 6th/7th tests at the bottom).
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

// MEYS 6th/7th: the BFF sends the brand's open edition on every login, so an
// 'existing' response named a phantom 2027 draft for 6th participants and the
// login page overwrote their selection with it on every login.
describe('extractCreatedProgramRegistrationId', () => {
  it('reads programId only for the created status', () => {
    expect(
      extractCreatedProgramRegistrationId({ status: 'created', programId: 'p-7th', programName: 'MEYS 7th' }),
    ).toBe('p-7th');
  });

  it.each(['existing', 'closed', undefined])('returns null for status %s', (status) => {
    expect(
      extractCreatedProgramRegistrationId({ status, programId: 'p-7th', programName: 'MEYS 7th' }),
    ).toBeNull();
  });

  it('returns null when the field is absent', () => {
    expect(extractCreatedProgramRegistrationId(undefined)).toBeNull();
  });
});

describe('applyAuthProgramSelection', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('does not overwrite the saved selection for an existing application', () => {
    window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, 'p-6th');

    applyAuthProgramSelection({ status: 'existing', programId: 'p-7th', programName: 'MEYS 7th' });

    expect(window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY)).toBe('p-6th');
  });

  it('leaves the saved selection alone when the response names no program', () => {
    window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, 'p-6th');

    applyAuthProgramSelection(undefined);

    expect(window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY)).toBe('p-6th');
  });

  it('pins the selection to an application this response created', () => {
    window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, 'p-old');

    applyAuthProgramSelection({ status: 'created', programId: 'p-new', programName: 'New' });

    expect(window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY)).toBe('p-new');
  });

  it('drops a switcher choice left in this tab by an earlier session', () => {
    window.sessionStorage.setItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY, 'p-7th');

    applyAuthProgramSelection(undefined);

    expect(window.sessionStorage.getItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY)).toBeNull();
  });
});
