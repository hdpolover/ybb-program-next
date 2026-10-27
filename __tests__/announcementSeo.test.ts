// __tests__/announcementSeo.test.ts
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import {
  buildAnnouncementDescription,
  buildNewsArticleJsonLd,
  serializeJsonLd,
  stripDateline,
  toIsoDate,
} from '@/lib/announcementSeo';

describe('stripDateline', () => {
  it('removes "City, Country — Date —" prefix', () => {
    expect(stripDateline('Istanbul, Türkiye — February 20, 2026 — The summit opens.')).toBe('The summit opens.');
  });
  it('removes a day-first date and a single-place dateline', () => {
    expect(stripDateline('Jakarta – 5 March 2026 – Registration is open.')).toBe('Registration is open.');
  });
  it('leaves ordinary dashed sentences alone', () => {
    const text = 'Applications are open — apply before the deadline.';
    expect(stripDateline(text)).toBe(text);
  });
});

describe('buildAnnouncementDescription', () => {
  it('prefers the excerpt over the content', () => {
    expect(buildAnnouncementDescription({ excerpt: 'Short excerpt.', content: '<p>Body</p>' })).toBe('Short excerpt.');
  });
  it('strips html and the dateline from content when there is no excerpt', () => {
    const content = '<p>Istanbul, Türkiye — February 20, 2026 — <strong>Delegates</strong> arrive.</p>';
    expect(buildAnnouncementDescription({ excerpt: null, content })).toBe('Delegates arrive.');
  });
  it('trims at a word boundary within 160 chars', () => {
    const out = buildAnnouncementDescription({ excerpt: 'word '.repeat(60) });
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('…')).toBe(true);
    expect(out).toMatch(/word…$/);
  });
  it('falls back to a default when empty', () => {
    expect(buildAnnouncementDescription({ excerpt: ' ', content: '' })).toMatch(/latest announcement/);
  });
});

describe('toIsoDate', () => {
  it('returns undefined for empty or invalid values', () => {
    expect(toIsoDate('')).toBeUndefined();
    expect(toIsoDate(null)).toBeUndefined();
    expect(toIsoDate('not a date')).toBeUndefined();
  });
  it('anchors a bare date at UTC midnight', () => {
    expect(toIsoDate('2026-02-20')).toBe('2026-02-20T00:00:00.000Z');
  });
});

describe('news article json-ld', () => {
  const base = {
    item: { id: '1', date: '2026-02-20' },
    title: 'Title',
    description: 'Desc',
    image: '/img/a.png',
    canonicalUrl: 'https://x.org/announcements/a',
    baseUrl: 'https://x.org',
    brandName: 'Brand',
  };
  it('builds absolute urls and omits unknown dates/logo', () => {
    const ld = buildNewsArticleJsonLd({ ...base, item: { id: '1' } });
    expect(ld.image).toEqual(['https://x.org/img/a.png']);
    expect(ld).not.toHaveProperty('datePublished');
    expect(ld.publisher).not.toHaveProperty('logo');
  });
  it('escapes < so content cannot close the script tag', () => {
    const out = serializeJsonLd(buildNewsArticleJsonLd({ ...base, title: '</script><script>alert(1)' }));
    expect(out).not.toContain('<');
  });
});
