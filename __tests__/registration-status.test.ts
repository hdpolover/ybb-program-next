// __tests__/registration-status.test.ts

import { describe, it, expect } from 'vitest';
import { isProgramRegistrationOpen, type RegistrationGateProgram } from '@/lib/registration/status';

const NOW = new Date('2026-08-18T00:00:00.000Z');

function baseProgram(overrides: Partial<RegistrationGateProgram> = {}): RegistrationGateProgram {
  return {
    isPublished: true,
    isActive: true,
    allowRegistration: true,
    registrationOpenDate: null,
    registrationCloseDate: null,
    ...overrides,
  };
}

describe('isProgramRegistrationOpen', () => {
  it('returns false for a null/undefined program', () => {
    expect(isProgramRegistrationOpen(null, NOW)).toBe(false);
    expect(isProgramRegistrationOpen(undefined, NOW)).toBe(false);
  });

  it('returns true when published, active, allowed, and no date window is set', () => {
    expect(isProgramRegistrationOpen(baseProgram(), NOW)).toBe(true);
  });

  it('returns false when not published', () => {
    expect(isProgramRegistrationOpen(baseProgram({ isPublished: false }), NOW)).toBe(false);
  });

  it('returns false when not active', () => {
    expect(isProgramRegistrationOpen(baseProgram({ isActive: false }), NOW)).toBe(false);
  });

  it('returns false when allowRegistration is false', () => {
    expect(isProgramRegistrationOpen(baseProgram({ allowRegistration: false }), NOW)).toBe(false);
  });

  it('returns false when the close date has passed (the China Youth Summit 2026 case)', () => {
    const program = baseProgram({
      allowRegistration: true,
      registrationCloseDate: '2026-08-15T16:59:59.000Z',
    });
    expect(isProgramRegistrationOpen(program, NOW)).toBe(false);
  });

  it('returns true when the close date is in the future', () => {
    const program = baseProgram({ registrationCloseDate: '2026-12-31T23:59:59.000Z' });
    expect(isProgramRegistrationOpen(program, NOW)).toBe(true);
  });

  it('returns false when the open date is in the future', () => {
    const program = baseProgram({ registrationOpenDate: '2026-09-01T00:00:00.000Z' });
    expect(isProgramRegistrationOpen(program, NOW)).toBe(false);
  });

  it('returns true when now falls inside the open/close window', () => {
    const program = baseProgram({
      registrationOpenDate: '2026-08-01T00:00:00.000Z',
      registrationCloseDate: '2026-08-31T23:59:59.000Z',
    });
    expect(isProgramRegistrationOpen(program, NOW)).toBe(true);
  });

  it('ignores an unparseable date rather than treating it as a hard boundary', () => {
    const program = baseProgram({ registrationCloseDate: 'not-a-date' });
    expect(isProgramRegistrationOpen(program, NOW)).toBe(true);
  });

  it('defaults `now` to the current time when omitted', () => {
    const program = baseProgram();
    expect(isProgramRegistrationOpen(program)).toBe(true);
  });
});
