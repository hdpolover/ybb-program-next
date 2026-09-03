// lib/registration/__tests__/isRegistrationOpen.test.ts
import { describe, it, expect } from 'vitest';
import {
  combineRegistrationPhases,
  getRegistrationWindowPhase,
  isRegistrationOpen,
} from '../isRegistrationOpen';

describe('isRegistrationOpen', () => {
  it('returns false when there are no periods', () => {
    expect(isRegistrationOpen(undefined, new Date())).toBe(false);
    expect(isRegistrationOpen([], new Date())).toBe(false);
  });

  it('is open when now falls within a single period as stored', () => {
    const periods = [{ start_date: '2026-01-01T00:00:00Z', end_date: '2026-01-31T00:00:00Z' }];
    expect(isRegistrationOpen(periods, new Date('2026-01-15T00:00:00Z'))).toBe(true);
  });

  it('is closed before the earliest period starts and after the last one ends', () => {
    const periods = [{ start_date: '2026-01-01T00:00:00Z', end_date: '2026-01-31T00:00:00Z' }];
    expect(isRegistrationOpen(periods, new Date('2025-12-31T00:00:00Z'))).toBe(false);
    expect(isRegistrationOpen(periods, new Date('2026-02-01T00:00:01Z'))).toBe(false);
  });

  describe('2026-09-01 Middle East Youth Summit 7th incident', () => {
    it('treats the earliest period stored at 23:59 WIB as open earlier that same WIB day', () => {
      // Admin picked 1 Sept as the opening day; the row was stored as
      // 2026-09-01T16:59:00Z (23:59 WIB on 1 Sept) instead of WIB midnight.
      const periods = [{ start_date: '2026-09-01T16:59:00.000Z', end_date: '2026-09-30T16:59:00.000Z' }];
      const nineAmWib = new Date('2026-09-01T02:00:00.000Z'); // 09:00 WIB, 1 Sept
      expect(isRegistrationOpen(periods, nineAmWib)).toBe(true);
    });

    it('is still closed the WIB day before the earliest period opens', () => {
      const periods = [{ start_date: '2026-09-01T16:59:00.000Z', end_date: '2026-09-30T16:59:00.000Z' }];
      const nineAmWibDayBefore = new Date('2026-08-31T02:00:00.000Z'); // 09:00 WIB, 31 Aug
      expect(isRegistrationOpen(periods, nineAmWibDayBefore)).toBe(false);
    });

    it('does NOT widen a mid-chain period whose start intentionally hands over at 23:59 WIB', () => {
      // Installment 1 has already lapsed by 5 Sept; installment 2 (not the
      // earliest period on this tier) intentionally starts at exactly 23:59
      // WIB on 10 Sept, not WIB midnight. Between those two instants there is
      // a real gap where registration is meant to be closed — widening
      // installment 2's start to WIB midnight would incorrectly report it
      // open a day early.
      const installment1 = { start_date: '2026-09-01T00:00:00.000Z', end_date: '2026-09-05T00:00:00.000Z' };
      const installment2 = { start_date: '2026-09-10T16:59:00.000Z', end_date: '2026-09-30T16:59:00.000Z' };
      const periods = [installment1, installment2];

      // 07:00 WIB on 10 Sept: after installment1 lapsed, after what a
      // (wrongly) widened installment2 start would be, but before
      // installment2's real, exact 23:59 WIB start.
      const duringTheGap = new Date('2026-09-10T00:00:00.000Z');
      expect(isRegistrationOpen(periods, duringTheGap)).toBe(false);

      // Just after installment2's real, un-widened start, it opens.
      const justAfterRealStart = new Date('2026-09-10T17:00:00.000Z');
      expect(isRegistrationOpen(periods, justAfterRealStart)).toBe(true);
    });
  });
});

describe('getRegistrationWindowPhase', () => {
  const at = (iso: string) => new Date(iso);

  it('is upcoming when the earliest window has not started', () => {
    // KYS 4th's tier shape on 2026-09-03.
    const periods = [
      { start_date: '2026-09-04T17:00:00.000Z', end_date: '2027-03-05T16:59:00.000Z' },
    ];
    expect(getRegistrationWindowPhase(periods, at('2026-09-03T00:00:00.000Z'))).toBe('upcoming');
  });

  it('is open while a window covers now', () => {
    const periods = [
      { start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-12-01T00:00:00.000Z' },
    ];
    expect(getRegistrationWindowPhase(periods, at('2026-09-03T00:00:00.000Z'))).toBe('open');
  });

  it('is closed once every window has lapsed', () => {
    const periods = [
      { start_date: '2026-01-01T00:00:00.000Z', end_date: '2026-02-01T00:00:00.000Z' },
    ];
    expect(getRegistrationWindowPhase(periods, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
  });

  it('is closed with no periods at all', () => {
    expect(getRegistrationWindowPhase(undefined, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
    expect(getRegistrationWindowPhase([], at('2026-09-03T00:00:00.000Z'))).toBe('closed');
  });

  it('keeps the WIB start-of-day widening on the earliest window', () => {
    // The 2026-09-01 MEYS incident: opening period stored at 23:59 WIB the day
    // before. It must read open, not upcoming, from WIB midnight.
    const periods = [
      { start_date: '2026-08-31T16:59:00.000Z', end_date: '2026-10-01T16:59:00.000Z' },
    ];
    // 2026-08-31T00:00 WIB = 2026-08-30T17:00Z, just after WIB midnight.
    expect(getRegistrationWindowPhase(periods, at('2026-08-30T18:00:00.000Z'))).toBe('open');
  });
});

describe('combineRegistrationPhases', () => {
  it('ranks open above upcoming above closed', () => {
    expect(combineRegistrationPhases(['closed', 'upcoming', 'open'])).toBe('open');
    expect(combineRegistrationPhases(['closed', 'upcoming'])).toBe('upcoming');
    expect(combineRegistrationPhases(['closed', 'closed'])).toBe('closed');
    expect(combineRegistrationPhases([])).toBe('closed');
  });
});
