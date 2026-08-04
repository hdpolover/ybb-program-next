// __tests__/timeline.test.ts

import { describe, it, expect, vi } from 'vitest';
import {
  formatTimelineDateLabel,
  getTimelineVisualStatus,
  sortTimelineItems,
  getTimelineSortValue,
} from '@/lib/format/timeline';

describe('getTimelineVisualStatus', () => {
  it('returns active when is_active is true regardless of status text', () => {
    expect(getTimelineVisualStatus('Passed', true)).toBe('active');
  });

  it('returns upcoming for an upcoming status', () => {
    expect(getTimelineVisualStatus('Upcoming', false)).toBe('upcoming');
  });

  it('returns closed for an unrecognized or missing status', () => {
    expect(getTimelineVisualStatus(undefined, false)).toBe('closed');
    expect(getTimelineVisualStatus('Passed', false)).toBe('closed');
  });
});

describe('formatTimelineDateLabel', () => {
  it('formats a structured single-day date in WIB', () => {
    const label = formatTimelineDateLabel({
      date_display: 'ignored',
      start_date: '2026-08-01T00:00:00.000Z',
      end_date: null,
    });
    expect(label).toContain('2026');
    expect(label).toContain('WIB');
  });

  it('formats a structured date range with a single WIB suffix', () => {
    const label = formatTimelineDateLabel({
      date_display: 'ignored',
      start_date: '2026-11-09T00:00:00.000Z',
      end_date: '2026-11-12T00:00:00.000Z',
    });
    expect(label).toContain('–');
    expect(label.match(/WIB/g)?.length).toBe(1);
  });

  it('collapses a range to a single label when start and end format the same', () => {
    const label = formatTimelineDateLabel({
      date_display: 'ignored',
      start_date: '2026-11-09T01:00:00.000Z',
      end_date: '2026-11-09T02:00:00.000Z',
    });
    expect(label).not.toContain('–');
  });

  it('falls back to parsing date_display when structured dates are absent', () => {
    const label = formatTimelineDateLabel({ date_display: 'Nov 09, 2026' });
    expect(label).not.toBe('Invalid Date');
    expect(label).toContain('2026');
  });

  it('falls back to the raw date_display text when it cannot be parsed', () => {
    const label = formatTimelineDateLabel({ date_display: 'Coming Soon' });
    expect(label).toBe('Coming Soon');
  });

  it('returns the not-added placeholder when nothing is present', () => {
    const label = formatTimelineDateLabel({ date_display: '' });
    expect(label).toBe('Data not added');
  });

  it('never renders "Invalid Date"', () => {
    const label = formatTimelineDateLabel({
      date_display: 'not a real date at all',
      start_date: 'also-not-a-date',
    });
    expect(label).not.toContain('Invalid Date');
  });

  it('renders a bare ISO date_display in WIB, independent of the host timezone', () => {
    vi.stubEnv('TZ', 'Pacific/Auckland');
    const auckland = formatTimelineDateLabel({ date_display: '2026-07-15' });

    vi.stubEnv('TZ', 'America/Los_Angeles');
    const losAngeles = formatTimelineDateLabel({ date_display: '2026-07-15' });

    vi.unstubAllEnvs();

    expect(auckland).toBe(losAngeles);
    expect(auckland).toContain('15');
    expect(auckland).toContain('2026');
  });
});

describe('getTimelineSortValue', () => {
  it('prefers the structured start_date over date_display', () => {
    const value = getTimelineSortValue({
      date_display: 'Jan 01, 1999',
      start_date: '2026-08-01T00:00:00.000Z',
    });
    expect(value).toBe(new Date('2026-08-01T00:00:00.000Z').getTime());
  });

  it('falls back to date_display when start_date is absent', () => {
    const value = getTimelineSortValue({ date_display: '2026-08-01' });
    expect(value).not.toBeNull();
  });

  it('returns null when nothing parses', () => {
    expect(getTimelineSortValue({ date_display: 'TBA' })).toBeNull();
  });

  it('parses a bare ISO date_display in WIB, independent of the host timezone', () => {
    // A viewer/server timezone ahead of WIB (e.g. Auckland, UTC+13) is exactly the
    // case where anchoring at LOCAL midnight (the old parseApiDate-based behavior)
    // rolls the resolved instant back onto the previous WIB calendar day. Anchoring
    // at UTC midnight instead (see parseLegacyIsoDateUtc in timeline.ts) must give
    // the same result regardless of process.env.TZ.
    const expected = new Date('2026-07-15T00:00:00Z').getTime();

    vi.stubEnv('TZ', 'Pacific/Auckland');
    expect(getTimelineSortValue({ date_display: '2026-07-15' })).toBe(expected);

    vi.stubEnv('TZ', 'America/Los_Angeles');
    expect(getTimelineSortValue({ date_display: '2026-07-15' })).toBe(expected);

    vi.unstubAllEnvs();
  });
});

describe('sortTimelineItems', () => {
  const item = (name: string, start: string | null, display = 'ignored') => ({
    name,
    date_display: display,
    start_date: start,
  });

  it('sorts ascending by date', () => {
    const items = [
      item('c', '2026-03-01T00:00:00.000Z'),
      item('a', '2026-01-01T00:00:00.000Z'),
      item('b', '2026-02-01T00:00:00.000Z'),
    ];
    const sorted = sortTimelineItems(items, 'asc').map((i) => i.name);
    expect(sorted).toEqual(['a', 'b', 'c']);
  });

  it('sorts descending by date', () => {
    const items = [
      item('a', '2026-01-01T00:00:00.000Z'),
      item('c', '2026-03-01T00:00:00.000Z'),
      item('b', '2026-02-01T00:00:00.000Z'),
    ];
    const sorted = sortTimelineItems(items, 'desc').map((i) => i.name);
    expect(sorted).toEqual(['c', 'b', 'a']);
  });

  it('always sorts unparseable items last, never to the top, in either direction', () => {
    const items = [
      item('undated', null, ''),
      item('early', '2026-01-01T00:00:00.000Z'),
      item('late', '2026-06-01T00:00:00.000Z'),
    ];

    expect(sortTimelineItems(items, 'asc').map((i) => i.name)).toEqual(['early', 'late', 'undated']);
    expect(sortTimelineItems(items, 'desc').map((i) => i.name)).toEqual(['late', 'early', 'undated']);
  });

  it('breaks ties (including multiple undated items) deterministically on original order', () => {
    const items = [
      item('same-1', '2026-01-01T00:00:00.000Z'),
      item('undated-1', null, ''),
      item('same-2', '2026-01-01T00:00:00.000Z'),
      item('undated-2', null, ''),
    ];

    const result = sortTimelineItems(items, 'asc').map((i) => i.name);
    expect(result).toEqual(['same-1', 'same-2', 'undated-1', 'undated-2']);
  });

  it('does not mutate the input array', () => {
    const items = [item('b', '2026-02-01T00:00:00.000Z'), item('a', '2026-01-01T00:00:00.000Z')];
    const original = [...items];
    sortTimelineItems(items, 'asc');
    expect(items).toEqual(original);
  });
});
