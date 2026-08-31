import { describe, it, expect } from 'vitest';
import { getRegistrationPeriodLabel } from '@/lib/format/registration-period';

// The real China Youth Summit 2026 "Registration Fee (Fully Funded)" windows,
// copied from production. One genuine window, then a chain of admin-appended
// one-day extensions. Only the window covering "now" may be rendered; the chain
// must never be accumulated into one long span.
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
  const at = (iso: string) => new Date(iso);

  it('shows only the window covering today, not the whole chain', () => {
    const label = getRegistrationPeriodLabel(CHINA_FF_PERIODS, true, at('2026-07-16T09:00:00+07:00'));
    // The 16 Jul - 17 Jul window, not "14 Apr - 21 Aug".
    expect(label).toContain('16');
    expect(label).toContain('17');
    expect(label).not.toContain('Apr');
    expect(label).not.toContain('21');
  });

  it('uses the current window even when a later window exists', () => {
    const periods = [
      { start_date: '2026-09-01', end_date: '2026-09-03' },
      { start_date: '2026-09-05', end_date: '2026-09-10' },
      { start_date: '2026-09-11', end_date: '2026-09-12' },
    ];
    const label = getRegistrationPeriodLabel(periods, true, at('2026-09-01T09:00:00+07:00'));
    expect(label).toContain('1');
    expect(label).toContain('3');
    expect(label).not.toContain('12');
  });

  it('picks the latest deadline when two windows both cover today', () => {
    // Real MEYS fully-funded data: eligibility holds while any window covers
    // now, so the label must not understate the close date.
    const periods = [
      { start_date: '2026-07-28', end_date: '2026-08-31' },
      { start_date: '2026-07-28', end_date: '2026-09-01' },
      { start_date: '2026-09-01', end_date: '2026-09-02' },
    ];
    const label = getRegistrationPeriodLabel(periods, true, at('2026-08-30T09:00:00+07:00'));
    expect(label).toContain('28');
    expect(label).toContain('Sep');
    expect(label).not.toContain('31');
  });

  it('falls forward to the next upcoming window when today sits in a gap', () => {
    const periods = [
      { start_date: '2026-09-01', end_date: '2026-09-03' },
      { start_date: '2026-09-05', end_date: '2026-09-10' },
    ];
    const label = getRegistrationPeriodLabel(periods, true, at('2026-09-04T09:00:00+07:00'));
    expect(label).toContain('5');
    expect(label).toContain('10');
    expect(label).not.toContain('1 ');
  });

  it('falls back to the final window once every window has lapsed', () => {
    const label = getRegistrationPeriodLabel(CHINA_FF_PERIODS, true, at('2026-12-01T09:00:00+07:00'));
    expect(label).toContain('20');
    expect(label).toContain('21');
    expect(label).not.toBe('TBD');
  });

  it('does not move the label when an admin appends a window ahead of today', () => {
    const now = at('2026-07-16T09:00:00+07:00');
    const before = getRegistrationPeriodLabel(CHINA_FF_PERIODS, true, now);
    const after = getRegistrationPeriodLabel(
      [...CHINA_FF_PERIODS, { start_date: '2026-08-21', end_date: '2026-08-22' }],
      true,
      now,
    );
    expect(after).toBe(before);
  });

  it('is order-independent, periods may arrive unsorted', () => {
    const now = at('2026-07-16T09:00:00+07:00');
    const shuffled = [...CHINA_FF_PERIODS].reverse();
    expect(getRegistrationPeriodLabel(shuffled, true, now)).toBe(
      getRegistrationPeriodLabel(CHINA_FF_PERIODS, true, now),
    );
  });

  it('returns TBD for empty or missing input', () => {
    expect(getRegistrationPeriodLabel([])).toBe('TBD');
    expect(getRegistrationPeriodLabel(undefined)).toBe('TBD');
  });

  it('ignores unparseable dates rather than rendering Invalid Date', () => {
    const label = getRegistrationPeriodLabel(
      [
        { start_date: 'not-a-date', end_date: '2026-08-21' },
        { start_date: '2026-04-14', end_date: 'also-bad' },
        { start_date: '2026-04-14', end_date: '2026-08-21' },
      ],
      true,
      at('2026-05-01T09:00:00+07:00'),
    );
    expect(label).not.toContain('Invalid');
    expect(label).not.toBe('TBD');
  });

  it('collapses a single-day window instead of repeating the date', () => {
    const label = getRegistrationPeriodLabel([{ start_date: '2026-08-20', end_date: '2026-08-20' }]);
    expect(label).not.toContain(' - ');
  });
});
