// @vitest-environment node
//
// Readable announcement URLs: /announcements/<slug> instead of /<uuid>.
//
// Covers the three pieces that decide which URL a visitor ends up on:
//   - the link helpers (list, search, sitemap all link by slug when present),
//   - the detail/sitemap API calls (the detail page used to search page 1 of
//     the list, so anything older than 20 items 404'd; the sitemap listed only
//     page 1 for the same reason),
//   - the detail page's permanent redirect from an old id URL to the slug URL.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  announcementPath,
  getAnnouncementCanonicalRedirect,
  resolveAnnouncementHref,
} from '@/lib/announcements';

const UUID = '20069fca-e516-429f-a3bc-e88d80ce2021';
const SLUG = 'kwon-hae-suk-explores-ai-for-inclusive-global-communities';

describe('announcement link helpers', () => {
  it('links by slug when the item has one', () => {
    expect(announcementPath({ id: UUID, slug: SLUG })).toBe(`/announcements/${SLUG}`);
    expect(resolveAnnouncementHref({ id: UUID, slug: SLUG, href: '/programs/kys-2026' })).toBe(
      `/announcements/${SLUG}`,
    );
  });

  it('falls back to the id for system announcements, which have no slug', () => {
    expect(announcementPath({ id: UUID, slug: null })).toBe(`/announcements/${UUID}`);
    expect(resolveAnnouncementHref({ id: UUID })).toBe(`/announcements/${UUID}`);
  });

  it('still honours an explicit /announcements/ href from the API', () => {
    expect(resolveAnnouncementHref({ id: UUID, slug: SLUG, href: '/announcements/custom' })).toBe(
      '/announcements/custom',
    );
  });

  it('redirects an id URL to the slug URL, and never redirects the slug URL itself', () => {
    expect(getAnnouncementCanonicalRedirect(UUID, { id: UUID, slug: SLUG })).toBe(`/announcements/${SLUG}`);
    expect(getAnnouncementCanonicalRedirect(SLUG, { id: UUID, slug: SLUG })).toBeNull();
  });

  it('does not redirect an item without a slug', () => {
    expect(getAnnouncementCanonicalRedirect(UUID, { id: UUID, slug: null })).toBeNull();
  });
});

describe('announcement API calls', () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  const jsonResponse = (status: number, body: unknown) => ({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 404 ? 'Not Found' : 'OK',
    json: async () => body,
  });

  const listPage = (ids: string[], page: number, totalPages: number) =>
    jsonResponse(200, {
      statusCode: 200,
      message: 'ok',
      data: {
        slug: 'announcements',
        title: 'Announcements',
        sections: [
          {
            type: 'announcement_list',
            data: ids.map((id) => ({ id, slug: `slug-${id}` })),
            content: { pagination: { total: 0, page, limit: 100, total_pages: totalPages }, filters: {} },
          },
        ],
      },
    });

  beforeEach(() => {
    vi.resetModules();
    process.env.API_INTERNAL_URL = 'http://api.internal';
    process.env.NEXT_PUBLIC_BRAND_DOMAIN = 'koreayouthsummit.com';
    fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getAnnouncementDetail calls the single-announcement endpoint with the brand', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(200, { statusCode: 200, message: 'ok', data: { id: UUID, slug: SLUG } }));
    const { getAnnouncementDetail } = await import('@/lib/api/announcements');

    await expect(getAnnouncementDetail('koreayouthsummit.com', SLUG)).resolves.toEqual({ id: UUID, slug: SLUG });

    const url = new URL(fetchSpy.mock.calls[0][0]);
    expect(url.pathname).toBe(`/v1/landing/announcements/${SLUG}`);
    expect(url.searchParams.get('url')).toBe('koreayouthsummit.com');
    expect(fetchSpy.mock.calls[0][1].headers['x-brand-domain']).toBe('koreayouthsummit.com');
  });

  it('getAnnouncementDetail returns null on 404', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(404, { statusCode: 404, message: 'Announcement not found' }));
    const { getAnnouncementDetail } = await import('@/lib/api/announcements');

    await expect(getAnnouncementDetail('koreayouthsummit.com', 'nope')).resolves.toBeNull();
  });

  it('getAnnouncementDetail rethrows anything other than a 404', async () => {
    fetchSpy.mockResolvedValue(jsonResponse(500, {}));
    const { getAnnouncementDetail } = await import('@/lib/api/announcements');

    await expect(getAnnouncementDetail('koreayouthsummit.com', SLUG)).rejects.toMatchObject({ status: 500 });
  });

  it('listAllPublicAnnouncements walks every page and de-duplicates ids', async () => {
    fetchSpy
      .mockResolvedValueOnce(listPage(['sys-1', 'a', 'b'], 1, 3))
      .mockResolvedValueOnce(listPage(['c', 'd'], 2, 3))
      .mockResolvedValueOnce(listPage(['d', 'e'], 3, 3));
    const { listAllPublicAnnouncements } = await import('@/lib/api/announcements');

    const items = await listAllPublicAnnouncements('koreayouthsummit.com');

    expect(items.map((item) => item.id)).toEqual(['sys-1', 'a', 'b', 'c', 'd', 'e']);
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(new URL(fetchSpy.mock.calls[1][0]).searchParams.get('page')).toBe('2');
    expect(new URL(fetchSpy.mock.calls[1][0]).searchParams.get('limit')).toBe('100');
  });

  it('listAllPublicAnnouncements keeps what it has when a later page fails', async () => {
    fetchSpy.mockResolvedValueOnce(listPage(['a'], 1, 2)).mockResolvedValueOnce(jsonResponse(500, {}));
    const { listAllPublicAnnouncements } = await import('@/lib/api/announcements');

    await expect(listAllPublicAnnouncements('koreayouthsummit.com')).resolves.toEqual([{ id: 'a', slug: 'slug-a' }]);
  });
});

describe('announcement detail page', () => {
  const getAnnouncementDetail = vi.fn();
  const permanentRedirect = vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  });
  const notFound = vi.fn(() => {
    throw new Error('NOT_FOUND');
  });

  beforeEach(() => {
    vi.resetModules();
    getAnnouncementDetail.mockReset();
    permanentRedirect.mockClear();
    notFound.mockClear();
    vi.doMock('next/headers', () => ({
      headers: async () => ({ get: (name: string) => (name === 'host' ? 'koreayouthsummit.com' : null) }),
    }));
    vi.doMock('next/navigation', () => ({ permanentRedirect, notFound }));
    vi.doMock('@/lib/api/announcements', () => ({ getAnnouncementDetail }));
  });

  afterEach(() => {
    vi.doUnmock('next/headers');
    vi.doUnmock('next/navigation');
    vi.doUnmock('@/lib/api/announcements');
  });

  const renderPage = async (key: string) => {
    const { default: Page } = await import('@/app/announcements/[key]/page');
    return Page({ params: Promise.resolve({ key }) });
  };

  it('permanently redirects an old id URL to the slug URL', async () => {
    getAnnouncementDetail.mockResolvedValue({ id: UUID, slug: SLUG, title: 'T' });

    await expect(renderPage(UUID)).rejects.toThrow(`REDIRECT:/announcements/${SLUG}`);
    expect(getAnnouncementDetail).toHaveBeenCalledWith('koreayouthsummit.com', UUID);
  });

  it('renders the slug URL without redirecting', async () => {
    getAnnouncementDetail.mockResolvedValue({ id: UUID, slug: SLUG, title: 'T' });

    await expect(renderPage(SLUG)).resolves.toBeTruthy();
    expect(permanentRedirect).not.toHaveBeenCalled();
  });

  it('404s when the API has no public announcement for the key', async () => {
    getAnnouncementDetail.mockResolvedValue(null);

    await expect(renderPage('draft-or-missing')).rejects.toThrow('NOT_FOUND');
  });

  it('uses the slug for canonical and Open Graph URLs', async () => {
    getAnnouncementDetail.mockResolvedValue({ id: UUID, slug: SLUG, title: 'T' });
    vi.doMock('@/lib/server/envContext', () => ({ resolveBrandDomain: async () => 'koreayouthsummit.com' }));

    const { generateMetadata } = await import('@/app/announcements/[key]/page');
    const metadata = await generateMetadata({ params: Promise.resolve({ key: UUID }) });

    expect(metadata.alternates?.canonical).toBe(`/announcements/${SLUG}`);
    expect((metadata.openGraph as { url?: string } | undefined)?.url).toBe(`/announcements/${SLUG}`);
    vi.doUnmock('@/lib/server/envContext');
  });
});
