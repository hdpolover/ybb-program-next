import type { PartnersPageData } from '@/types/partners';
import { getLandingPageWithFallback } from '@/lib/api/landingContentClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain() ?? '');

function resolveBrand(host: string): string {
  return host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')
    ? normalizeBrandUrl(host)
    : DEFAULT_BRAND_URL;
}

export async function getPartnersPageData(host: string): Promise<PartnersPageData> {
  const brandUrl = resolveBrand(host);
  return getLandingPageWithFallback<PartnersPageData>({
    brandDomain: brandUrl,
    landingPath: 'partners',
    fallbackApiPath: '/v1/landing/partners-sponsors',
    fallbackQuery: { url: brandUrl },
  });
}
