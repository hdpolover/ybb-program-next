// lib/auth/__tests__/programRegistrationClosed.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sonner', () => ({ toast: { warning: vi.fn() } }));

import { toast } from 'sonner';
import {
  buildCategoryFallbackMessage,
  extractProgramRegistrationId,
  notifyIfRegistrationClosed,
  parseCategoryFallback,
} from '@/lib/auth/programRegistrationClosed';

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

// The API creates the application under an OPEN category when the requested
// one had closed (old Fully Funded ads/links, MEYS/CYS 2026) and reports it as
// programRegistration.categoryFallback. Saying nothing left people believing
// they had applied Fully Funded.
describe('categoryFallback', () => {
  const created = {
    status: 'created',
    programId: 'p-1',
    programName: 'China Youth Summit 2026',
    categoryFallback: { requested: 'fully_funded', assigned: 'self_funded' },
  };

  beforeEach(() => {
    vi.mocked(toast.warning).mockClear();
  });

  it('parses the fallback with the programme name', () => {
    expect(parseCategoryFallback(created)).toEqual({
      requested: 'fully_funded',
      assigned: 'self_funded',
      programName: 'China Youth Summit 2026',
    });
  });

  it('ignores an absent, malformed or no-op fallback', () => {
    expect(parseCategoryFallback({ status: 'created', programId: 'p-1', programName: 'X' })).toBeNull();
    expect(parseCategoryFallback({ categoryFallback: { requested: 'x', assigned: 'self_funded' } })).toBeNull();
    expect(parseCategoryFallback({ categoryFallback: { requested: 'self_funded', assigned: 'self_funded' } })).toBeNull();
    expect(parseCategoryFallback(null)).toBeNull();
  });

  it('builds the participant message', () => {
    expect(buildCategoryFallbackMessage({ requested: 'fully_funded', assigned: 'self_funded' })).toBe(
      'Fully Funded registration has closed; your account was created as Self Funded.',
    );
  });

  it('toasts the fallback from notifyIfRegistrationClosed', () => {
    notifyIfRegistrationClosed(created);
    expect(toast.warning).toHaveBeenCalledWith(
      'Fully Funded registration for China Youth Summit 2026 has closed; your account was created as Self Funded.',
    );
  });

  it('does not toast a normal created response', () => {
    notifyIfRegistrationClosed({ status: 'created', programId: 'p-1', programName: 'X' });
    expect(toast.warning).not.toHaveBeenCalled();
  });
});
