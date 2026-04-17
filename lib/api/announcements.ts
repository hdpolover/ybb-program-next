import type { AnnouncementsPageData } from '@/types/announcements';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain() ?? '');

function resolveBrand(host: string): string {
  return host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')
    ? normalizeBrandUrl(host)
    : DEFAULT_BRAND_URL;
}

export async function getAnnouncementsPageData(host: string): Promise<AnnouncementsPageData> {
  const brandUrl = resolveBrand(host);
  return apiGetWithEnvelope<AnnouncementsPageData>('/v1/landing/announcements', {
    query: { url: brandUrl },
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
}
