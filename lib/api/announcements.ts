import type { AnnouncementsPageData } from '@/types/announcements';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
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
