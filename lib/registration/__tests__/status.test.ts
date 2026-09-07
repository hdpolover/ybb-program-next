// lib/registration/__tests__/status.test.ts
/**
 * Registration is a TRI-state, not a boolean.
 *
 * Korea Youth Summit 4th, 2026-09-03: registration opened 2026-09-05 and every
 * surface in the portal read "Registration Closed" -- next to a live 183-day
 * countdown and an active "Register Now" button. "Closed" for a programme that
 * has not opened yet tells a prospective participant to go away two days
 * before you want them signing up.
 */
import { describe, it, expect } from 'vitest';
import {
  getRegistrationPhase,
  isProgramRegistrationOpen,
  type RegistrationGateProgram,
} from '../status';

const base: RegistrationGateProgram = {
  isPublished: true,
  isActive: true,
  allowRegistration: true,
  registrationOpenDate: null,
  registrationCloseDate: null,
};

const at = (iso: string) => new Date(iso);

describe('getRegistrationPhase', () => {
  it('is upcoming before the open date', () => {
    const program = { ...base, registrationOpenDate: '2026-09-05T00:00:00.000Z' };
    expect(getRegistrationPhase(program, at('2026-09-03T00:00:00.000Z'))).toBe('upcoming');
  });

  it('is open between the open and close dates', () => {
    const program = {
      ...base,
      registrationOpenDate: '2026-09-05T00:00:00.000Z',
      registrationCloseDate: '2027-03-05T00:00:00.000Z',
    };
    expect(getRegistrationPhase(program, at('2026-10-01T00:00:00.000Z'))).toBe('open');
  });

  it('is closed after the close date', () => {
    const program = { ...base, registrationCloseDate: '2026-08-31T00:00:00.000Z' };
    expect(getRegistrationPhase(program, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
  });

  it('is open when neither date is set', () => {
    expect(getRegistrationPhase(base, at('2026-09-03T00:00:00.000Z'))).toBe('open');
  });

  it('is closed for a null program', () => {
    expect(getRegistrationPhase(null, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
  });

  it('treats the publish/active/allowRegistration flags as a hard kill switch', () => {
    // KYS 4th's real prod shape: dates say open since 28 Aug, the toggle says no.
    const program = {
      ...base,
      allowRegistration: false,
      registrationOpenDate: '2026-08-28T16:59:00.000Z',
      registrationCloseDate: '2027-03-05T16:59:00.000Z',
    };
    expect(getRegistrationPhase(program, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
    expect(getRegistrationPhase({ ...base, isPublished: false }, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
    expect(getRegistrationPhase({ ...base, isActive: false }, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
  });

  it('reports the exact KYS 4th tier scenario as upcoming, not closed', () => {
    const program = {
      ...base,
      registrationOpenDate: '2026-09-05T00:00:00.000Z',
      registrationCloseDate: '2027-03-05T16:59:00.000Z',
    };
    const phase = getRegistrationPhase(program, at('2026-09-03T00:00:00.000Z'));
    expect(phase).toBe('upcoming');
    expect(phase).not.toBe('closed');
  });
});

describe('isProgramRegistrationOpen', () => {
  it('stays a boolean view of the phase, so existing callers do not change', () => {
    const upcoming = { ...base, registrationOpenDate: '2026-09-05T00:00:00.000Z' };
    expect(isProgramRegistrationOpen(upcoming, at('2026-09-03T00:00:00.000Z'))).toBe(false);
    expect(isProgramRegistrationOpen(base, at('2026-09-03T00:00:00.000Z'))).toBe(true);
    expect(isProgramRegistrationOpen(null, at('2026-09-03T00:00:00.000Z'))).toBe(false);
  });
});

describe('degenerate date configurations', () => {
  it('is closed when the close date precedes the open date', () => {
    // A window nobody can ever be inside. 'upcoming' would promise an opening
    // that can never arrive.
    const program = {
      ...base,
      registrationOpenDate: '2027-01-01T00:00:00.000Z',
      registrationCloseDate: '2026-01-01T00:00:00.000Z',
    };
    expect(getRegistrationPhase(program, at('2026-06-01T00:00:00.000Z'))).toBe('closed');
    expect(getRegistrationPhase(program, at('2027-06-01T00:00:00.000Z'))).toBe('closed');
  });

  it('treats an unparseable date as absent, i.e. as no constraint', () => {
    const program = { ...base, registrationOpenDate: 'not-a-date', registrationCloseDate: null };
    expect(getRegistrationPhase(program, at('2026-09-03T00:00:00.000Z'))).toBe('open');
  });

  it('handles an instantaneous window (open === close)', () => {
    // Picked already at the WIB end-of-day boundary (2026-09-03T16:59:59.999Z
    // is 2026-09-03T23:59:59.999 in Jakarta) so the close-side widening added
    // below is a no-op here and the window really is instantaneous.
    const instant = '2026-09-03T16:59:59.999Z';
    const program = { ...base, registrationOpenDate: instant, registrationCloseDate: instant };
    expect(getRegistrationPhase(program, at('2026-09-03T16:59:58.999Z'))).toBe('upcoming');
    expect(getRegistrationPhase(program, at(instant))).toBe('open');
    expect(getRegistrationPhase(program, at('2026-09-03T17:00:00.000Z'))).toBe('closed');
  });
});

describe('WIB widening of the program-level close date', () => {
  it('keeps registration open until 23:59 Jakarta on the final day, not 07:00', () => {
    // Admin picks 2026-09-03 as the last day; stored as UTC midnight, which is
    // 07:00 WIB. Without widening this reads closed at 07:01 WIB even though
    // the calendar day the admin chose still has 17 hours left.
    const program = { ...base, registrationCloseDate: '2026-09-03T00:00:00.000Z' };
    expect(getRegistrationPhase(program, at('2026-09-03T10:00:00.000Z'))).toBe('open'); // 17:00 WIB
    expect(getRegistrationPhase(program, at('2026-09-03T16:59:59.000Z'))).toBe('open'); // 23:59:59 WIB
    expect(getRegistrationPhase(program, at('2026-09-03T17:00:00.000Z'))).toBe('closed'); // 00:00 WIB next day
  });

  it('does not widen the open date, so an open date entered as a bare day still gates from that raw instant', () => {
    // Widening the open side earlier would let the portal say "open" before
    // the backend's raw comparison agrees, which this file exists to prevent.
    const program = { ...base, registrationOpenDate: '2026-09-05T00:00:00.000Z' };
    expect(getRegistrationPhase(program, at('2026-09-04T23:59:00.000Z'))).toBe('upcoming');
    expect(getRegistrationPhase(program, at('2026-09-05T00:00:00.000Z'))).toBe('open');
  });
});
