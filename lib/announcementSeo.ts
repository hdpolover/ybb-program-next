// lib/announcementSeo.ts
import type { AnnouncementApiItem } from '@/types/announcements';
import { richTextToPlainText } from '@/lib/content/richText';
import { parseApiDate } from '@/lib/utils';

export const META_DESCRIPTION_MAX = 160;
const DEFAULT_DESCRIPTION = 'Read the latest announcement from Youth Break the Boundaries.';

const DASH = '[—–-]';
const DATE_TEXT = '(?:[A-Za-z]{3,9}\\.? \\d{1,2},? \\d{4}|\\d{1,2} [A-Za-z]{3,9}\\.? \\d{4})';
// "Istanbul, Türkiye — February 20, 2026 — ": place, then a date, each followed by a dash.
// The date is mandatory so ordinary "Foo — bar" sentences are left alone.
const DATELINE = new RegExp(`^[\\p{L}][\\p{L}.' ]{1,40}(?:, ?[\\p{L}][\\p{L}.' ]{1,40})?\\s*${DASH}\\s*${DATE_TEXT}\\s*${DASH}\\s*`, 'u');

export function stripDateline(text: string): string {
  return text.replace(DATELINE, '');
}

export function truncateAtWord(text: string, max = META_DESCRIPTION_MAX): string {
  if (text.length <= max) return text;
  const room = text.slice(0, max - 1);
  const lastSpace = room.lastIndexOf(' ');
  const cut = lastSpace > max / 2 ? room.slice(0, lastSpace) : room;
  return `${cut.replace(/[\s,;:.\-—–]+$/, '')}…`;
}

/** Meta description: excerpt if present, else the body; plain text, no dateline, <=160 chars on a word boundary. */
export function buildAnnouncementDescription(
  item: Pick<AnnouncementApiItem, 'excerpt' | 'content'>,
): string {
  for (const source of [item.excerpt, item.content]) {
    const text = stripDateline(richTextToPlainText(source)).trim();
    if (text) return truncateAtWord(text);
  }
  return DEFAULT_DESCRIPTION;
}

/** ISO string for an API date, or undefined when absent/unparseable (never invents "now"). */
export function toIsoDate(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;
  const parsed = parseApiDate(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/** Serialises JSON-LD for an inline <script>; `<` is escaped so admin-entered text cannot close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildNewsArticleJsonLd(args: {
  item: AnnouncementApiItem;
  title: string;
  description: string;
  image: string;
  canonicalUrl: string;
  baseUrl: string;
  brandName: string;
  brandLogo?: string | null;
}) {
  const { item, title, description, image, canonicalUrl, baseUrl, brandName, brandLogo } = args;
  const abs = (url: string) => new URL(url, baseUrl).toString();
  const datePublished = toIsoDate(item.date);
  const logo = brandLogo?.trim();

  // ponytail: the API exposes no updated-at or language field, so dateModified/inLanguage are omitted; add them when it does.
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title.slice(0, 110),
    description,
    image: [abs(image)],
    ...(datePublished ? { datePublished } : {}),
    author: { '@type': 'Organization', name: brandName },
    publisher: {
      '@type': 'Organization',
      name: brandName,
      ...(logo ? { logo: { '@type': 'ImageObject', url: abs(logo) } } : {}),
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };
}
