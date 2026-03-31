import type { FaqsPageData } from '@/types/faqs';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const BRAND_URL = normalizeBrandUrl(getEnvBrandDomain());

export async function getFaqsPageData(): Promise<FaqsPageData> {
  return apiGetWithEnvelope<FaqsPageData>('/v1/landing/faqs', {
    query: { url: BRAND_URL },
    headers: {
      'x-brand-domain': BRAND_URL,
    },
  });
}
