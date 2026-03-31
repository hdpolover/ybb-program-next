import type { PartnersPageData } from '@/types/partners';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const BRAND_URL = normalizeBrandUrl(getEnvBrandDomain());

export async function getPartnersPageData(): Promise<PartnersPageData> {
  return apiGetWithEnvelope<PartnersPageData>('/v1/landing/partners-sponsors', {
    query: { url: BRAND_URL },
    headers: {
      'x-brand-domain': BRAND_URL,
    },
  });
}
