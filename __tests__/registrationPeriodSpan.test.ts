import { describe, it, expect } from 'vitest';
import {
  getRegistrationDatesDisplay,
  getRegistrationPeriodLabel,
} from '@/lib/format/registration-period';

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

  // Both ends carry a decision, and this label has already been reversed twice
  // because each fix corrected one and broke the other. Assert them together.
  it('reads "open since" the run start, and closes on the CURRENT window end', () => {
    const label = getRegistrationPeriodLabel(CHINA_FF_PERIODS, at('2026-07-16T09:00:00+07:00'));

    // Start: the chain is contiguous back to 14 Apr, so registration really has
    // been open since April - not "16 Jul", the start of today's one-day
    // extension.
    expect(label).toBe('14 Apr 2026 - 17 Jul 2026');

    // End: the deadline that ACTUALLY applies. Never 21 Aug, the chain's last
    // end - that told participants they had weeks longer than they did, and is
    // why the earlier MIN(start)-MAX(end) span was reverted.
    expect(label).not.toContain('21 Aug');
  });

  it('does not claim a period the tier was closed for', () => {
    // Open Apr - Jul, shut for a month, reopened in August. It has NOT been
    // open since April, so the run containing today starts in August - the
    // single-window behaviour this label had before.
    const withGap = [
      { start_date: '2026-04-14', end_date: '2026-07-15' },
      { start_date: '2026-08-20', end_date: '2026-08-25' },
    ];

    const label = getRegistrationPeriodLabel(withGap, at('2026-08-21T09:00:00+07:00'));

    expect(label).toBe('20 Aug 2026 - 25 Aug 2026');
    expect(label).not.toContain('Apr');
  });

  it('treats an exact hand-over as continuous, not as a gap', () => {
    // Extensions hand over at the day boundary: one window ends 23:59:59.999
    // WIB and the next starts 00:00 the next day. That is not a gap.
    const handover = [
      { start_date: '2026-04-14', end_date: '2026-07-15' },
      { start_date: '2026-07-16', end_date: '2026-07-20' },
    ];

    const label = getRegistrationPeriodLabel(handover, at('2026-07-17T09:00:00+07:00'));

    expect(label).toBe('14 Apr 2026 - 20 Jul 2026');
  });

  it('uses the current window even when a later window exists', () => {
    const periods = [
      { start_date: '2026-09-01', end_date: '2026-09-03' },
      { start_date: '2026-09-05', end_date: '2026-09-10' },
      { start_date: '2026-09-11', end_date: '2026-09-12' },
    ];
    const label = getRegistrationPeriodLabel(periods, at('2026-09-01T09:00:00+07:00'));
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
    const label = getRegistrationPeriodLabel(periods, at('2026-08-30T09:00:00+07:00'));
    expect(label).toContain('28');
    expect(label).toContain('Sep');
    expect(label).not.toContain('31');
  });

  it('falls forward to the next upcoming window when today sits in a gap', () => {
    const periods = [
      { start_date: '2026-09-01', end_date: '2026-09-03' },
      { start_date: '2026-09-05', end_date: '2026-09-10' },
    ];
    const label = getRegistrationPeriodLabel(periods, at('2026-09-04T09:00:00+07:00'));
    expect(label).toContain('5');
    expect(label).toContain('10');
    expect(label).not.toContain('1 ');
  });

  // Once a programme is finished the card should describe the period that was
  // ADVERTISED, not the tail of the extension ladder. Showing the last window
  // made a registration that opened in April read as a few days in August,
  // which contradicts the published guideline and tells next year's applicants
  // that extensions are routine.
  it('falls back to the MAIN window once every window has lapsed, not the final one', () => {
    const label = getRegistrationPeriodLabel(CHINA_FF_PERIODS, at('2026-12-01T09:00:00+07:00'));

    // The 14 Apr - 15 Jul main window.
    expect(label).toBe('14 Apr 2026 - 15 Jul 2026');
    expect(label).not.toBe('TBD');
  });

  it('leaves a tier that genuinely ran once alone, rather than inventing a longer period', () => {
    // CYS fully-funded really did run for two days. The honest label for it is
    // those two days - not the programme's own registration window, which it
    // never had.
    const label = getRegistrationPeriodLabel(
      [{ start_date: '2026-08-20', end_date: '2026-08-21' }],
      at('2026-12-01T09:00:00+07:00'),
    );

    expect(label).toBe('20 Aug 2026 - 21 Aug 2026');
  });

  it('picks the longest window as main, even when an earlier short one precedes it', () => {
    // "First" would mistake an early-bird window for the main one; length is
    // what distinguishes the advertised period from an operational extension.
    const label = getRegistrationPeriodLabel(
      [
        { start_date: '2026-03-01', end_date: '2026-03-02' },
        { start_date: '2026-04-14', end_date: '2026-10-10' },
        { start_date: '2026-10-10', end_date: '2026-10-11' },
      ],
      at('2026-12-01T09:00:00+07:00'),
    );

    expect(label).toBe('14 Apr 2026 - 10 Oct 2026');
  });

  it('does not move the label when an admin appends a window ahead of today', () => {
    const now = at('2026-07-16T09:00:00+07:00');
    const before = getRegistrationPeriodLabel(CHINA_FF_PERIODS, now);
    const after = getRegistrationPeriodLabel(
      [...CHINA_FF_PERIODS, { start_date: '2026-08-21', end_date: '2026-08-22' }],
      now,
    );
    expect(after).toBe(before);
  });

  it('is order-independent, periods may arrive unsorted', () => {
    const now = at('2026-07-16T09:00:00+07:00');
    const shuffled = [...CHINA_FF_PERIODS].reverse();
    expect(getRegistrationPeriodLabel(shuffled, now)).toBe(
      getRegistrationPeriodLabel(CHINA_FF_PERIODS, now),
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

describe('period labels are pinned to the business timezone', () => {
  const at = (iso: string) => new Date(iso);

  it('names the WIB calendar day, whatever zone the viewer sits in', () => {
    // A window ending 23:59 WIB on 1 Aug is 2026-08-01T16:59Z. Rendered in the
    // viewer's zone that reads "2 Aug" for everyone east of Jakarta, beside a
    // badge and a countdown that both use the WIB day. Same defect class as
    // formatDayMonthWib (audit M66).
    const label = getRegistrationPeriodLabel(
      [{ start_date: '2026-07-01T17:00:00.000Z', end_date: '2026-08-01T16:59:00.000Z' }],
      at('2026-07-15T00:00:00.000Z'),
    );
    expect(label).toBe('2 Jul 2026 - 1 Aug 2026');
  });
});

describe('getRegistrationDatesDisplay', () => {
  const at = (iso: string) => new Date(iso);

  // Three call sites used to hand-build `{ start_date: open ?? '', end_date:
  // close ?? '' }`. A null open date became an empty string, which parses to
  // NaN, so the window was dropped: badge "Open" (the gate reads
  // windowsFromDates and is fine with a half-bounded window), label "TBD", no
  // countdown.
  it('describes a half-bounded window instead of giving up', () => {
    const openEnded = getRegistrationDatesDisplay(
      { open: null, close: '2026-12-05T16:59:00.000Z' },
      at('2026-11-23T00:00:00.000Z'),
    );
    expect(openEnded.label).toBe('Until 5 Dec 2026');
    expect(openEnded.countdown).toBe('Closes in 13 days');
  });

  it('describes a window with no end date', () => {
    const noEnd = getRegistrationDatesDisplay(
      { open: '2026-07-01T00:00:00.000Z', close: null },
      at('2026-09-03T00:00:00.000Z'),
    );
    expect(noEnd.label).toBe('From 1 Jul 2026');
    // Open ended: nothing to count to.
    expect(noEnd.countdown).toBeNull();
  });

  it('prints a range when both bounds exist', () => {
    const both = getRegistrationDatesDisplay(
      { open: '2026-07-01T00:00:00.000Z', close: '2026-12-05T16:59:00.000Z' },
      at('2026-09-03T00:00:00.000Z'),
    );
    expect(both.label).toBe('1 Jul 2026 - 5 Dec 2026');
    expect(both.countdown).toBe('Closes in 94 days');
  });

  it('is TBD with no dates at all, and with none of the parts missing', () => {
    expect(getRegistrationDatesDisplay({ open: null, close: null })).toEqual({ label: 'TBD', countdown: null });
    expect(getRegistrationDatesDisplay(null)).toEqual({ label: 'TBD', countdown: null });
    expect(getRegistrationDatesDisplay(undefined)).toEqual({ label: 'TBD', countdown: null });
  });

  it('counts down through the whole last WIB day, like the gate', () => {
    const dates = { open: null, close: '2026-09-03T00:00:00.000Z' };
    // 07:00 Jakarta on the final day: the raw comparison had already stopped.
    expect(getRegistrationDatesDisplay(dates, at('2026-09-03T00:00:00.000Z')).countdown).toBe(
      'Closes in 17 hours',
    );
    expect(getRegistrationDatesDisplay(dates, at('2026-09-03T17:00:00.000Z')).countdown).toBeNull();
  });
});
