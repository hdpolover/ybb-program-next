// __tests__/announcementsUrlState.test.ts
//
// Pure URL-state helpers behind the /announcements pagination + filters
// plumbing: parsing raw `searchParams` into clamped values, building
// shareable hrefs, and computing numbered-pagination truncation.
import { describe, it, expect } from 'vitest';
import {
  buildAnnouncementsHref,
  getPaginationRange,
  parseAnnouncementsSearchParams,
} from '@/lib/announcements';

describe('parseAnnouncementsSearchParams', () => {
  it('defaults to page 1 with no filters when searchParams is empty/undefined', () => {
    expect(parseAnnouncementsSearchParams(undefined)).toEqual({ page: 1 });
    expect(parseAnnouncementsSearchParams({})).toEqual({ page: 1 });
  });

  it('parses page, q, category, tag, edition and year into their typed fields', () => {
    expect(
      parseAnnouncementsSearchParams({
        page: '3',
        q: 'scholarship',
        category: 'News',
        tag: 'visa',
        edition: 'prog-123',
        year: '2026',
      }),
    ).toEqual({
      page: 3,
      search: 'scholarship',
      category: 'News',
      tag: 'visa',
      programId: 'prog-123',
      year: 2026,
    });
  });

  it('takes the first value when Next hands over an array (repeated query key)', () => {
    expect(parseAnnouncementsSearchParams({ page: ['2', '5'], q: ['a', 'b'] })).toEqual({
      page: 2,
      search: 'a',
    });
  });

  it('clamps page to a positive integer, falling back to 1 for garbage input', () => {
    expect(parseAnnouncementsSearchParams({ page: '0' }).page).toBe(1);
    expect(parseAnnouncementsSearchParams({ page: '-4' }).page).toBe(1);
    expect(parseAnnouncementsSearchParams({ page: 'not-a-number' }).page).toBe(1);
    expect(parseAnnouncementsSearchParams({ page: '2.7' }).page).toBe(2);
  });

  it('clamps an absurdly large page instead of passing it straight through', () => {
    expect(parseAnnouncementsSearchParams({ page: '999999999' }).page).toBe(10000);
  });

  it('drops out-of-range or garbage year instead of forwarding it to the API', () => {
    expect(parseAnnouncementsSearchParams({ year: '1999' }).year).toBeUndefined();
    expect(parseAnnouncementsSearchParams({ year: '2101' }).year).toBeUndefined();
    expect(parseAnnouncementsSearchParams({ year: 'abc' }).year).toBeUndefined();
    expect(parseAnnouncementsSearchParams({ year: '2026' }).year).toBe(2026);
  });

  it('trims free-text filters and drops them to undefined when blank', () => {
    expect(parseAnnouncementsSearchParams({ q: '   ', category: '  ', tag: '' })).toEqual({ page: 1 });
    expect(parseAnnouncementsSearchParams({ q: '  scholarship  ' }).search).toBe('scholarship');
  });
});

describe('buildAnnouncementsHref', () => {
  const base = { page: 1 };

  it('returns the bare base path when there are no active filters and page is 1', () => {
    expect(buildAnnouncementsHref(base, {})).toBe('/announcements');
  });

  it('includes page only when > 1', () => {
    expect(buildAnnouncementsHref(base, { page: 2 })).toBe('/announcements?page=2');
    expect(buildAnnouncementsHref({ ...base, page: 5 }, { page: 1 })).toBe('/announcements');
  });

  it('preserves existing filters while overriding page (pagination link case)', () => {
    const current = { page: 1, category: 'News', search: 'visa' };
    expect(buildAnnouncementsHref(current, { page: 3 })).toBe(
      '/announcements?q=visa&category=News&page=3',
    );
  });

  it('maps programId to the edition query param', () => {
    expect(buildAnnouncementsHref(base, { programId: 'prog-42' })).toBe('/announcements?edition=prog-42');
  });

  it('clears a filter when the override is explicitly undefined (category pill "All")', () => {
    const current = { page: 1, category: 'News', tag: 'visa' };
    expect(buildAnnouncementsHref(current, { category: undefined, page: 1 })).toBe(
      '/announcements?tag=visa',
    );
  });

  it('honors a custom base path', () => {
    expect(buildAnnouncementsHref(base, { page: 2 }, '/custom')).toBe('/custom?page=2');
  });
});

describe('getPaginationRange', () => {
  it('returns an empty range for 0 pages and a single page for 1', () => {
    expect(getPaginationRange(1, 0)).toEqual([]);
    expect(getPaginationRange(1, 1)).toEqual([1]);
  });

  it('shows every page with no ellipsis when the total is small', () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(3, 9)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('truncates with a trailing ellipsis when current is near the start', () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
  });

  it('truncates with a leading ellipsis when current is near the end', () => {
    expect(getPaginationRange(20, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });

  it('truncates on both sides when current is in the middle', () => {
    expect(getPaginationRange(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
  });

  it('clamps an out-of-range current page into [1, total] instead of producing garbage', () => {
    expect(getPaginationRange(999, 20)).toEqual(getPaginationRange(20, 20));
    expect(getPaginationRange(-5, 20)).toEqual(getPaginationRange(1, 20));
  });
});
