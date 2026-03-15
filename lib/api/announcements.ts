import type { AnnouncementsPageData } from '@/types/announcements';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const BRAND_URL = normalizeBrandUrl(getEnvBrandDomain());

export async function getAnnouncementsPageData(): Promise<AnnouncementsPageData> {
  return apiGetWithEnvelope<AnnouncementsPageData>('/v1/landing/announcements', {
    query: { url: BRAND_URL },
    headers: {
      'x-brand-domain': BRAND_URL,
    },
  });
}
