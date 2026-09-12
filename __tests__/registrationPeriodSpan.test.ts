import { describe, it, expect } from 'vitest';
import {
  getRegistrationDatesDisplay,
  getRegistrationPeriodLabel,
} from '@/lib/format/registration-period';

// The real China Youth Summit 2026 "Registration Fee (Fully Funded)" windows,
// copied from production. One genuine window, then a chain of admin-appended
// one-day extensions. Only the FIRST window may be rendered: the extensions are
// operational dates that were never published, and the chain must never be
// accumulated into one long span either.
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

  // The published deadline is the only date a card may advertise. Showing the
  // live extension instead made a registration open since April read as
  // "4 Sept - 5 Sept" on MEYS, and taught applicants that the date always slips.
  it('prints the default period, never the extension covering today', () => {
    const label = getRegistrationPeriodLabel(CHINA_FF_PERIODS, at('2026-07-16T09:00:00+07:00'));

    expect(label).toBe('14 Apr 2026 - 15 Jul 2026');

    // Not the end of today's one-day extension, and not the chain's final end
    // either - the two answers the previous two revisions each argued for.
    expect(label).not.toContain('17 Jul');
    expect(label).not.toContain('21 Aug');
  });

  // The whole point of the rule: the same tier reads identically in April, in
  // the middle of the extension ladder, and long after it has all lapsed.
  it('is time-invariant, the label never moves as extensions come and go', () => {
    const labels = [
      '2026-05-01T09:00:00+07:00',
      '2026-07-16T09:00:00+07:00',
      '2026-08-20T09:00:00+07:00',
      '2026-12-01T09:00:00+07:00',
    ].map((iso) => getRegistrationPeriodLabel(CHINA_FF_PERIODS, at(iso)));

    expect(new Set(labels).size).toBe(1);
    expect(labels[0]).toBe('14 Apr 2026 - 15 Jul 2026');
  });

  it('shows the default period even when the tier closed and later reopened', () => {
    // Open Apr - Jul, shut for a month, reopened in August. August is still a
    // reopening, not the published period, so it stays off the card.
    const withGap = [
      { start_date: '2026-04-14', end_date: '2026-07-15' },
      { start_date: '2026-08-20', end_date: '2026-08-25' },
    ];

    const label = getRegistrationPeriodLabel(withGap, at('2026-08-21T09:00:00+07:00'));

    expect(label).toBe('14 Apr 2026 - 15 Jul 2026');
    expect(label).not.toContain('Aug');
  });

  it('understates rather than overstates when two periods share a start', () => {
    // Real MEYS fully-funded rot: 28 Jul - 31 Aug alongside 28 Jul - 1 Sep. The
    // earlier end is the original published deadline; printing 1 Sep would tell
    // an applicant they have a day longer than the guideline promised.
    const periods = [
      { start_date: '2026-07-28', end_date: '2026-08-31' },
      { start_date: '2026-07-28', end_date: '2026-09-01' },
      { start_date: '2026-09-01', end_date: '2026-09-02' },
    ];
    const label = getRegistrationPeriodLabel(periods, at('2026-08-30T09:00:00+07:00'));

    expect(label).toBe('28 Jul 2026 - 31 Aug 2026');
  });

  it('does not fall forward to an upcoming window when today sits in a gap', () => {
    const periods = [
      { start_date: '2026-09-01', end_date: '2026-09-03' },
      { start_date: '2026-09-05', end_date: '2026-09-10' },
    ];
    const label = getRegistrationPeriodLabel(periods, at('2026-09-04T09:00:00+07:00'));

    expect(label).toBe('1 Sept 2026 - 3 Sept 2026');
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

  it('takes the FIRST window even when a later one is longer', () => {
    // An early-bird window genuinely opened first, so it is the date that was
    // published first. "Longest" was the old heuristic for guessing which row
    // was the real one; first-by-date is what the admin UI actually creates,
    // and unlike a name or a length it cannot be gamed by a data-entry habit.
    const label = getRegistrationPeriodLabel(
      [
        { start_date: '2026-03-01', end_date: '2026-03-02' },
        { start_date: '2026-04-14', end_date: '2026-10-10' },
        { start_date: '2026-10-10', end_date: '2026-10-11' },
      ],
      at('2026-12-01T09:00:00+07:00'),
    );

    expect(label).toBe('1 Mar 2026 - 2 Mar 2026');
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
