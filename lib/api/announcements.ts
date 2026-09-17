import type { AnnouncementApiItem, AnnouncementListSection, AnnouncementsPageData } from '@/types/announcements';
import { apiGetWithEnvelope, ApiRequestError } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain() ?? '');

function resolveBrand(host: string): string {
  return host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')
    ? normalizeBrandUrl(host)
    : DEFAULT_BRAND_URL;
}

// Mirrors the backend's ListAnnouncementsQueryDto (page/limit/search/category/tag/
// programId/year) — see services/api/src/modules/landing/dto/landing-announcements-query.dto.ts.
export type AnnouncementsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  programId?: string;
  year?: number;
};

/**
 * One announcement by slug or id (GET /v1/landing/announcements/:key).
 *
 * Replaces the detail page's old approach of searching the first page of the
 * list (default limit 20), which 404'd every announcement older than that.
 * The API applies the same public visibility rules as the list.
 *
 * Returns null only for a 404; any other failure throws, so an API outage
 * surfaces as an error page rather than a misleading "not found".
 */
export async function getAnnouncementDetail(host: string, key: string): Promise<AnnouncementApiItem | null> {
  const brandUrl = resolveBrand(host);
  try {
    return await apiGetWithEnvelope<AnnouncementApiItem>(
      `/v1/landing/announcements/${encodeURIComponent(key)}`,
      {
        query: { url: brandUrl },
        headers: {
          'x-brand-domain': brandUrl,
        },
      },
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}

export async function getAnnouncementsPageData(
  host: string,
  params: AnnouncementsQueryParams = {},
): Promise<AnnouncementsPageData> {
  const brandUrl = resolveBrand(host);
  return apiGetWithEnvelope<AnnouncementsPageData>('/v1/landing/announcements', {
    query: {
      url: brandUrl,
      page: params.page,
      limit: params.limit,
      search: params.search,
      category: params.category,
      tag: params.tag,
      programId: params.programId,
      year: params.year,
    },
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
}

// The API caps limit at 100. The page cap bounds one sitemap request to a
// fixed number of API calls however large the archive grows.
const SITEMAP_ANNOUNCEMENTS_PAGE_SIZE = 100;
const SITEMAP_ANNOUNCEMENTS_MAX_PAGES = 50;

/**
 * Every public announcement, not just the first page, for the sitemap. It used
 * to list only page 1 (20 items), so older announcements were invisible to crawlers.
 * Page 1 also carries system announcements, so ids are de-duplicated.
 */
export async function listAllPublicAnnouncements(host: string): Promise<AnnouncementApiItem[]> {
  const byId = new Map<string, AnnouncementApiItem>();

  for (let page = 1; page <= SITEMAP_ANNOUNCEMENTS_MAX_PAGES; page += 1) {
    let pageData: AnnouncementsPageData;
    try {
      pageData = await getAnnouncementsPageData(host, { page, limit: SITEMAP_ANNOUNCEMENTS_PAGE_SIZE });
    } catch (error) {
      // A failure deep in the archive keeps what was already collected; only a
      // page-1 failure propagates, matching the sitemap's old single-call behavior.
      if (page === 1) throw error;
      break;
    }
    const listSection = pageData.sections.find(
      (section): section is AnnouncementListSection => section.type === 'announcement_list',
    );
    const items = listSection?.data ?? [];
    for (const item of items) {
      if (!byId.has(String(item.id))) byId.set(String(item.id), item);
    }

    const totalPages = listSection?.content?.pagination?.total_pages;
    const isLastPage = totalPages !== undefined ? page >= totalPages : items.length < SITEMAP_ANNOUNCEMENTS_PAGE_SIZE;
    if (isLastPage || items.length === 0) break;
  }

  return [...byId.values()];
}
