// lib/registration/__tests__/calendarEvents.test.ts
//
// The disclosure rule: a validity window that has not started must never
// reach the calendar, in the DOM or in a merged span's boundaries. These
// pin the worked example from the spec plus the real-world shape (China
// Youth Summit's 19 hand-entered self-funded windows).
import { describe, it, expect } from 'vitest';
import { parseRegistrationWindows } from '../isRegistrationOpen';
import { buildRegistrationCalendarEvents, mergeVisibleSpans } from '../calendarEvents';

const at = (iso: string) => new Date(iso);
const period = (start: string, end: string) => ({ start_date: start, end_date: end });

describe('mergeVisibleSpans', () => {
  it('merges 1-10 and 11-12 into one span and drops 19-22 entirely when evaluated on the 15th', () => {
    const periods = [
      period('2026-03-01', '2026-03-10'),
      period('2026-03-11', '2026-03-12'),
      period('2026-03-19', '2026-03-22'),
    ];

    const spans = mergeVisibleSpans(periods, at('2026-03-15T06:00:00.000Z'));

    expect(spans).toHaveLength(1);
    // The merged span must not reach past the 12th into the (unstarted) third
    // window's range.
    expect(spans[0].end).toBeLessThan(new Date('2026-03-13T00:00:00.000Z').getTime());
  });

  it('yields nothing at all when every period is still in the future', () => {
    const periods = [period('2099-01-01', '2099-01-05')];
    expect(mergeVisibleSpans(periods, at('2026-01-01T00:00:00.000Z'))).toEqual([]);
  });

  it('merges 19 contiguous same-price windows into a single span', () => {
    const periods = Array.from({ length: 19 }, (_, i) => {
      const day = String(i + 1).padStart(2, '0');
      return period(`2026-01-${day}`, `2026-01-${day}`);
    });

    const spans = mergeVisibleSpans(periods, at('2026-02-01T00:00:00.000Z'));
    expect(spans).toHaveLength(1);
  });

  it('includes a currently-open window, ending the span at its end', () => {
    const periods = [period('2026-06-01', '2026-06-30')];
    const now = at('2026-06-15T00:00:00.000Z');

    const spans = mergeVisibleSpans(periods, now);
    expect(spans).toHaveLength(1);

    const [expectedWindow] = parseRegistrationWindows(periods);
    expect(spans[0].end).toBe(expectedWindow.end);
  });

  it('counts a period starting exactly now as started', () => {
    const periods = [period('2026-08-01', '2026-08-05')];
    const [window] = parseRegistrationWindows(periods);

    const spans = mergeVisibleSpans(periods, new Date(window.start));
    expect(spans).toHaveLength(1);
  });
});

describe('buildRegistrationCalendarEvents', () => {
  const registrationFeeTier = (overrides: Record<string, unknown>) => ({
    fee_type: 'registration_fee',
    ...overrides,
  });

  it('labels a span by funding category, never by tier name', () => {
    const tiers = [
      registrationFeeTier({
        id: 't1',
        name: 'Early Bird Self Funded',
        allowed_categories: ['self_funded'],
        validity_periods: [period('2026-01-01', '2026-01-10')],
      }),
    ];

    const events = buildRegistrationCalendarEvents(tiers, null, at('2026-01-15T00:00:00.000Z'));

    expect(events).toHaveLength(1);
    expect(events[0].label).toBe('Self Funded registration');
  });

  it('hides a tier whose windows are all in the future entirely, not even its name', () => {
    const tiers = [
      registrationFeeTier({
        id: 't1',
        name: 'Late Wave Fully Funded',
        allowed_categories: ['fully_funded'],
        validity_periods: [period('2099-01-01', '2099-01-05')],
      }),
    ];

    const events = buildRegistrationCalendarEvents(tiers, null, at('2026-01-15T00:00:00.000Z'));
    expect(events).toEqual([]);
  });

  it('merges the 19-window China Youth Summit shape into one self-funded event', () => {
    const periods = Array.from({ length: 19 }, (_, i) => {
      const day = String(i + 1).padStart(2, '0');
      return period(`2026-01-${day}`, `2026-01-${day}`);
    });
    const tiers = [
      registrationFeeTier({
        id: 't1',
        name: 'Self Funded',
        allowed_categories: ['self_funded'],
        validity_periods: periods,
      }),
    ];

    const events = buildRegistrationCalendarEvents(tiers, null, at('2026-02-01T00:00:00.000Z'));
    expect(events).toHaveLength(1);
    expect(events[0].label).toBe('Self Funded registration');
  });

  it('ignores non-registration-fee tiers (full fee, flight, visa)', () => {
    const tiers = [
      registrationFeeTier({
        fee_type: 'full_fee',
        allowed_categories: ['self_funded'],
        validity_periods: [period('2026-01-01', '2026-01-10')],
      }),
    ];

    const events = buildRegistrationCalendarEvents(tiers, null, at('2026-01-15T00:00:00.000Z'));
    expect(events).toEqual([]);
  });
});
