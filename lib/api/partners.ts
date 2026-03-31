import type { PartnersPageData } from '@/types/partners';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain());

function resolveBrand(host: string): string {
  return host && host !== 'localhost' && !host.startsWith('127.0.0.1')
    ? normalizeBrandUrl(host)
    : DEFAULT_BRAND_URL;
}

export async function getPartnersPageData(host: string): Promise<PartnersPageData> {
  const brandUrl = resolveBrand(host);
  return apiGetWithEnvelope<PartnersPageData>('/v1/landing/partners-sponsors', {
    query: { url: brandUrl },
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
}
