// lib/registration/__tests__/isRegistrationOpen.test.ts
/**
 * One rule for "has this window started", consumed by every surface.
 *
 * The tier/edition phase helpers here are the SAME code the layout countdown
 * runs through lib/registration/deadline.ts. When these two disagreed, the fee
 * card badged Open next to a sticky bar reading "Opens 31 Aug" for 23 hours.
 */
import { describe, it, expect } from 'vitest';
import {
  getEditionRegistrationPhase,
  getTierRegistrationPhase,
  isRegistrationFeeTier,
  normalizeValidityPeriods,
} from '../isRegistrationOpen';

const at = (iso: string) => new Date(iso);
const tier = (periods: Array<{ start_date: string; end_date: string }>) => ({
  fee_type: 'registration_fee',
  validity_periods: periods,
});

describe('getTierRegistrationPhase', () => {
  it('is open while a window covers now, upcoming before it, closed after', () => {
    const t = tier([{ start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-12-01T00:00:00.000Z' }]);
    expect(getTierRegistrationPhase(t, null, at('2026-06-01T00:00:00.000Z'))).toBe('upcoming');
    expect(getTierRegistrationPhase(t, null, at('2026-09-03T00:00:00.000Z'))).toBe('open');
    expect(getTierRegistrationPhase(t, null, at('2027-01-01T00:00:00.000Z'))).toBe('closed');
  });

  it('is closed with no windows and no program dates to fall back on', () => {
    expect(getTierRegistrationPhase(tier([]), null, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
  });

  it('is closed when the edition does not offer this tier at all', () => {
    // Both fee cards always render; the one with no tier behind it must not
    // borrow the programme's window and look purchasable.
    const dates = { open: '2026-07-01T00:00:00.000Z', close: '2026-12-01T00:00:00.000Z' };
    expect(getTierRegistrationPhase(undefined, dates, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
  });

  it('reads the camelCase wire shape as well as snake_case', () => {
    const camel = {
      feeType: 'registration_fee',
      validityPeriods: [{ startDate: '2026-07-01T00:00:00.000Z', endDate: '2026-12-01T00:00:00.000Z' }],
    };
    expect(getTierRegistrationPhase(camel, null, at('2026-09-03T00:00:00.000Z'))).toBe('open');
  });

  describe('2026-09-01 Middle East Youth Summit 7th incident', () => {
    it('treats the earliest window stored at 23:59 WIB as open from WIB midnight', () => {
      // Admin picked 1 Sept as the opening day; the row was stored as
      // 2026-09-01T16:59:00Z (23:59 WIB on 1 Sept) instead of WIB midnight.
      const t = tier([{ start_date: '2026-09-01T16:59:00.000Z', end_date: '2026-09-30T16:59:00.000Z' }]);
      expect(getTierRegistrationPhase(t, null, at('2026-09-01T02:00:00.000Z'))).toBe('open');
    });

    it('is still upcoming the WIB day before the earliest window opens', () => {
      const t = tier([{ start_date: '2026-09-01T16:59:00.000Z', end_date: '2026-09-30T16:59:00.000Z' }]);
      expect(getTierRegistrationPhase(t, null, at('2026-08-31T02:00:00.000Z'))).toBe('upcoming');
    });

    it('does NOT widen a mid-chain window that hands over at 23:59 WIB', () => {
      // Installment 2 starts exactly when a real gap after installment 1 ends;
      // widening it too would open two prices at once.
      const t = tier([
        { start_date: '2026-09-01T00:00:00.000Z', end_date: '2026-09-05T00:00:00.000Z' },
        { start_date: '2026-09-10T16:59:00.000Z', end_date: '2026-09-30T16:59:00.000Z' },
      ]);
      expect(getTierRegistrationPhase(t, null, at('2026-09-10T00:00:00.000Z'))).toBe('upcoming');
      expect(getTierRegistrationPhase(t, null, at('2026-09-10T17:00:00.000Z'))).toBe('open');
    });
  });

  it('falls back to the edition dates for a tier that carries no windows', () => {
    // Homepage read the raw field and badged Closed; /apply read the fallback
    // and badged Open, off the same payload.
    const dates = { open: '2026-07-01T00:00:00.000Z', close: '2026-12-01T00:00:00.000Z' };
    expect(getTierRegistrationPhase(tier([]), dates, at('2026-09-03T00:00:00.000Z'))).toBe('open');
  });

  it('treats a missing open date as already open and a missing close as no end', () => {
    // Mirrors the backend gate (lib/registration/status.ts): a null date is
    // not a constraint.
    const t = tier([]);
    expect(getTierRegistrationPhase(t, { open: null, close: '2026-12-01T00:00:00.000Z' }, at('2026-09-03T00:00:00.000Z'))).toBe('open');
    expect(getTierRegistrationPhase(t, { open: '2026-07-01T00:00:00.000Z', close: null }, at('2029-01-01T00:00:00.000Z'))).toBe('open');
    expect(getTierRegistrationPhase(t, { open: null, close: null }, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
  });

  it('drops a window that ends before it starts instead of reporting it upcoming', () => {
    const t = tier([{ start_date: '2027-01-01T00:00:00.000Z', end_date: '2026-01-01T00:00:00.000Z' }]);
    expect(getTierRegistrationPhase(t, null, at('2026-09-03T00:00:00.000Z'))).toBe('closed');
    expect(
      getTierRegistrationPhase(tier([]), { open: '2027-01-01T00:00:00.000Z', close: '2026-01-01T00:00:00.000Z' }, at('2026-09-03T00:00:00.000Z')),
    ).toBe('closed');
  });
});

describe('getEditionRegistrationPhase', () => {
  const now = at('2026-09-03T00:00:00.000Z');

  it('ranks open above upcoming above closed across the edition tiers', () => {
    const lapsed = tier([{ start_date: '2026-01-01T00:00:00.000Z', end_date: '2026-02-01T00:00:00.000Z' }]);
    const soon = tier([{ start_date: '2026-11-01T00:00:00.000Z', end_date: '2026-12-01T00:00:00.000Z' }]);
    const live = tier([{ start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-12-01T00:00:00.000Z' }]);

    expect(getEditionRegistrationPhase([lapsed], null, now)).toBe('closed');
    expect(getEditionRegistrationPhase([lapsed, soon], null, now)).toBe('upcoming');
    expect(getEditionRegistrationPhase([lapsed, soon, live], null, now)).toBe('open');
  });

  it('ignores non registration-fee tiers', () => {
    const flight = { fee_type: 'flight_fee', validity_periods: [{ start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-12-01T00:00:00.000Z' }] };
    expect(getEditionRegistrationPhase([flight], null, now)).toBe('closed');
  });

  it('falls back to the program dates when the edition ships NO fee tiers at all', () => {
    // Istanbul Youth Summit / Youth Academic Forum. An empty tier set is not
    // evidence of closure: hard-badging Closed hid a programme registering
    // until December.
    expect(getEditionRegistrationPhase([], { open: null, close: '2026-12-05T16:59:00.000Z' }, now)).toBe('open');
    expect(getEditionRegistrationPhase([], { open: '2026-11-01T00:00:00.000Z', close: '2027-01-01T00:00:00.000Z' }, now)).toBe('upcoming');
    expect(getEditionRegistrationPhase([], { open: null, close: null }, now)).toBe('closed');
  });
});

describe('isRegistrationFeeTier', () => {
  it('accepts either wire casing and normalises separators', () => {
    expect(isRegistrationFeeTier({ fee_type: 'registration_fee' })).toBe(true);
    expect(isRegistrationFeeTier({ feeType: 'Registration-Fee' })).toBe(true);
    expect(isRegistrationFeeTier({ fee_type: 'program_fee' })).toBe(false);
    expect(isRegistrationFeeTier({})).toBe(false);
  });
});

describe('normalizeValidityPeriods', () => {
  it('prefers the tier windows and only then the edition dates', () => {
    const own = [{ start_date: '2026-07-01T00:00:00.000Z', end_date: '2026-12-01T00:00:00.000Z' }];
    const dates = { open: '2026-01-01T00:00:00.000Z', close: '2026-02-01T00:00:00.000Z' };
    expect(normalizeValidityPeriods(tier(own), dates)).toEqual(own);
    expect(normalizeValidityPeriods(tier([]), dates)).toEqual([
      { start_date: dates.open, end_date: dates.close },
    ]);
    // A label needs two printable dates; a half-bounded window has none.
    expect(normalizeValidityPeriods(tier([]), { open: null, close: '2026-02-01T00:00:00.000Z' })).toBeUndefined();
  });
});
