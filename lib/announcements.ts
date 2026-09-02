import { parseApiDate } from '@/lib/utils';
import { toRichTextHtml } from '@/lib/content/richText';

export function formatAnnouncementDateLabel(
  value?: string | null,
  opts?: { timeZone?: string },
): string {
  const raw = (value || '').trim();
  if (!raw) return 'Date TBA';

  const parsed = parseApiDate(raw);
  if (Number.isNaN(parsed.getTime())) return raw;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...(opts?.timeZone ? { timeZone: opts.timeZone } : {}),
  }).format(parsed);
}

export function resolveAnnouncementHref(id: string | number, href?: string | null): string {
  const raw = (href || '').trim();
  if (raw.startsWith('/announcements/')) return raw;
  return `/announcements/${encodeURIComponent(String(id))}`;
}

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function getAnnouncementActionHref(href?: string | null): string | null {
  const raw = (href || '').trim();
  return raw.length > 0 ? raw : null;
}

// ---------------------------------------------------------------------------
// URL-state for the /announcements list: page, filters and search all live in
// the URL (no client state) so pagination and filtered views are crawlable,
// shareable, and server-rendered on first load. See app/announcements/page.tsx.
// ---------------------------------------------------------------------------

export type AnnouncementsSearchParams = {
  page: number;
  search?: string;
  category?: string;
  tag?: string;
  programId?: string;
  year?: number;
};

const MAX_ANNOUNCEMENTS_PAGE = 10000; // sane upper bound against ?page=99999999 abuse
const MIN_ANNOUNCEMENTS_YEAR = 2000;
const MAX_ANNOUNCEMENTS_YEAR = 2100;

function firstSearchParamValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? '';
}

/**
 * Parses and validates the raw Next.js `searchParams` object for the
 * announcements list into typed, clamped values. Never trusts the URL as-is:
 * page is clamped to a positive integer within bounds, year to a sane
 * calendar range; free-text filters are trimmed and empty strings become
 * `undefined` so they drop out of the query entirely.
 */
export function parseAnnouncementsSearchParams(
  raw: Record<string, string | string[] | undefined> | undefined,
): AnnouncementsSearchParams {
  const params = raw ?? {};

  const pageRaw = Number.parseInt(firstSearchParamValue(params.page), 10);
  const page =
    Number.isFinite(pageRaw) && pageRaw > 0 ? Math.min(Math.floor(pageRaw), MAX_ANNOUNCEMENTS_PAGE) : 1;

  const yearRaw = Number.parseInt(firstSearchParamValue(params.year), 10);
  const year =
    Number.isFinite(yearRaw) && yearRaw >= MIN_ANNOUNCEMENTS_YEAR && yearRaw <= MAX_ANNOUNCEMENTS_YEAR
      ? yearRaw
      : undefined;

  const search = firstSearchParamValue(params.q).trim() || undefined;
  const category = firstSearchParamValue(params.category).trim() || undefined;
  const tag = firstSearchParamValue(params.tag).trim() || undefined;
  const programId = firstSearchParamValue(params.edition).trim() || undefined;

  return { page, search, category, tag, programId, year };
}

/**
 * Builds a shareable `/announcements` href from the current search params plus
 * overrides, e.g. `buildAnnouncementsHref(current, { page: 3 })` for a
 * pagination link, or `{ category: 'News', page: 1 }` for a filter link.
 * Passing `undefined` for a field in `overrides` clears that filter.
 */
export function buildAnnouncementsHref(
  current: AnnouncementsSearchParams,
  overrides: Partial<AnnouncementsSearchParams> = {},
  basePath = '/announcements',
): string {
  const merged: AnnouncementsSearchParams = { ...current, ...overrides };
  const searchParams = new URLSearchParams();

  if (merged.search) searchParams.set('q', merged.search);
  if (merged.category) searchParams.set('category', merged.category);
  if (merged.tag) searchParams.set('tag', merged.tag);
  if (merged.programId) searchParams.set('edition', merged.programId);
  if (merged.year) searchParams.set('year', String(merged.year));
  if (merged.page > 1) searchParams.set('page', String(merged.page));

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export type AnnouncementsPaginationToken = number | 'ellipsis-start' | 'ellipsis-end';

function integerRange(start: number, end: number): number[] {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Computes which page numbers/ellipses to render for numbered pagination,
 * e.g. `1 2 3 … 8 9` for many pages. Standard sibling/boundary truncation
 * (siblingCount pages either side of `current`, boundaryCount pages pinned at
 * each edge) — small page counts are shown in full with no ellipsis at all.
 */
export function getPaginationRange(
  current: number,
  total: number,
  options: { siblingCount?: number; boundaryCount?: number } = {},
): AnnouncementsPaginationToken[] {
  if (total <= 0) return [];

  const siblingCount = options.siblingCount ?? 1;
  const boundaryCount = options.boundaryCount ?? 1;
  const page = Math.min(Math.max(Math.floor(current), 1), total);

  // Enough room to show every page without an ellipsis at all.
  const fullRangeThreshold = boundaryCount * 2 + siblingCount * 2 + 5;
  if (total <= fullRangeThreshold) {
    return integerRange(1, total);
  }

  const startPages = integerRange(1, boundaryCount);
  const endPages = integerRange(Math.max(total - boundaryCount + 1, boundaryCount + 1), total);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, total - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : total - 1,
  );

  const tokens: AnnouncementsPaginationToken[] = [...startPages];

  if (siblingsStart > boundaryCount + 2) {
    tokens.push('ellipsis-start');
  } else if (boundaryCount + 1 < siblingsStart) {
    tokens.push(...integerRange(boundaryCount + 1, siblingsStart - 1));
  }

  tokens.push(...integerRange(siblingsStart, siblingsEnd));

  if (siblingsEnd < total - boundaryCount - 1) {
    tokens.push('ellipsis-end');
  } else if (siblingsEnd + 1 < total - boundaryCount + 1) {
    tokens.push(...integerRange(siblingsEnd + 1, total - boundaryCount));
  }

  tokens.push(...endPages);

  return tokens;
}

export function formatAnnouncementCategoryLabel(value?: string | null): string {
  const normalized = (value || '').trim();
  if (!normalized) return 'General';

  return normalized
    .replace(/[_-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

export const toAnnouncementHtml = toRichTextHtml;
