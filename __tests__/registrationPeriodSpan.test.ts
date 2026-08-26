import { describe, it, expect } from 'vitest';
import { getRegistrationPeriodLabel } from '@/lib/format/registration-period';

// The real China Youth Summit 2026 "Registration Fee (Fully Funded)" windows,
// copied from production. One genuine window, then a chain of admin-appended
// one-day extensions. Before this helper existed the UI rendered only the last
// window — "20 Aug - 21 Aug" — instead of the real span.
const CHINA_FF_PERIODS = [
  { start_date: '2026-04-14', end_date: '2026-07-15' },
  { start_date: '2026-07-15', end_date: '2026-07-16' },
  { start_date: '2026-07-16', end_date: '2026-07-17' },
  { start_date: '2026-07-17', end_date: '2026-08-15' },
  { start_date: '2026-08-15', end_date: '2026-08-16' },
  { start_date: '2026-08-16', end_date: '2026-08-17' },
  { start_date: '2026-08-17', end_date: '2026-08-18' },
  { start_date: '2026-08-18', end_date: '2026-08-19' },
  { start_date: '2026-08-19', end_date: '2026-08-20' },
  { start_date: '2026-08-20', end_date: '2026-08-21' },
];

describe('getRegistrationPeriodLabel', () => {
  it('spans the earliest start to the latest end, not the current window', () => {
    const label = getRegistrationPeriodLabel(CHINA_FF_PERIODS);
    expect(label).toContain('14');   // 14 April — the real registration start
    expect(label).toContain('21');   // 21 August — the final extension end
    expect(label).not.toMatch(/^20\b/); // must NOT start at the last window
  });

  it('is stable while an admin appends further extensions', () => {
    const before = getRegistrationPeriodLabel(CHINA_FF_PERIODS);
    const after = getRegistrationPeriodLabel([
      ...CHINA_FF_PERIODS,
      { start_date: '2026-08-21', end_date: '2026-08-22' },
    ]);
    // The start must not move when a window is appended.
    expect(after.split('-')[0]).toBe(before.split('-')[0]);
  });

  it('still renders a span after every window has lapsed', () => {
    // The reported second failure: dates going missing once extensions run out.
    expect(getRegistrationPeriodLabel(CHINA_FF_PERIODS)).not.toBe('TBD');
  });

  it('is order-independent — periods may arrive unsorted', () => {
    const shuffled = [...CHINA_FF_PERIODS].reverse();
    expect(getRegistrationPeriodLabel(shuffled)).toBe(getRegistrationPeriodLabel(CHINA_FF_PERIODS));
  });

  it('returns TBD for empty or missing input', () => {
    expect(getRegistrationPeriodLabel([])).toBe('TBD');
    expect(getRegistrationPeriodLabel(undefined)).toBe('TBD');
  });

  it('ignores unparseable dates rather than rendering Invalid Date', () => {
    const label = getRegistrationPeriodLabel([
      { start_date: 'not-a-date', end_date: '2026-08-21' },
      { start_date: '2026-04-14', end_date: 'also-bad' },
    ]);
    expect(label).not.toContain('Invalid');
  });

  it('collapses a single-day span instead of repeating the date', () => {
    const label = getRegistrationPeriodLabel([{ start_date: '2026-08-20', end_date: '2026-08-20' }]);
    expect(label).not.toContain(' - ');
  });
});
