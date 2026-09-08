// lib/calendar/__tests__/spansCoveringDay.test.ts
//
// The grid used to mark only a window's first and last day, which made any
// month sitting wholly inside a window render blank. These lock the rule that
// a span covers every day between its edges.
import { describe, it, expect } from 'vitest';
import { spansCoveringDay } from '@/lib/calendar/buildCalendarEntries';

// The real Korea Youth Summit 4th windows, which is where this was spotted.
const SELF_FUNDED = { startKey: '2026-09-05', endKey: '2027-03-05' };
const FULLY_FUNDED = { startKey: '2026-09-05', endKey: '2026-11-20' };
const SPANS = [SELF_FUNDED, FULLY_FUNDED];

describe('spansCoveringDay', () => {
  it('covers a day in the middle of a window, not just its edges', () => {
    // November 2026 is entirely inside the self-funded window and contains
    // neither of its edges. This is the case that rendered an empty month.
    expect(spansCoveringDay([SELF_FUNDED], '2026-11-14')).toEqual([SELF_FUNDED]);
  });

  it('includes both edge days', () => {
    expect(spansCoveringDay([SELF_FUNDED], '2026-09-05')).toEqual([SELF_FUNDED]);
    expect(spansCoveringDay([SELF_FUNDED], '2027-03-05')).toEqual([SELF_FUNDED]);
  });

  it('excludes the days either side of a window', () => {
    expect(spansCoveringDay([SELF_FUNDED], '2026-09-04')).toEqual([]);
    expect(spansCoveringDay([SELF_FUNDED], '2027-03-06')).toEqual([]);
  });

  it('returns every overlapping window, so a day can belong to more than one', () => {
    // Both categories are open on 20 Nov; only self-funded is open on 21 Nov.
    expect(spansCoveringDay(SPANS, '2026-11-20')).toEqual([SELF_FUNDED, FULLY_FUNDED]);
    expect(spansCoveringDay(SPANS, '2026-11-21')).toEqual([SELF_FUNDED]);
  });

  it('compares across year and month rollover, not within one month', () => {
    // Keys are YYYY-MM-DD, so string order is date order — a window running
    // into the next year must still cover January.
    expect(spansCoveringDay([SELF_FUNDED], '2027-01-01')).toEqual([SELF_FUNDED]);
  });
});
