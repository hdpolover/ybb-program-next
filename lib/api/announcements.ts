import type { AnnouncementsPageData } from '@/types/announcements';
import { getLandingPageWithFallback } from '@/lib/api/landingContentClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain() ?? '');

function resolveBrand(host: string): string {
  return host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')
    ? normalizeBrandUrl(host)
    : DEFAULT_BRAND_URL;
}

export async function getAnnouncementsPageData(host: string): Promise<AnnouncementsPageData> {
  const brandUrl = resolveBrand(host);
  return getLandingPageWithFallback<AnnouncementsPageData>({
    brandDomain: brandUrl,
    landingPath: 'announcements',
    fallbackApiPath: '/v1/landing/announcements',
    fallbackQuery: { url: brandUrl },
  });
}
