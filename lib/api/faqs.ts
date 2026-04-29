import type { FaqsPageData } from '@/types/faqs';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain() ?? '');

function resolveBrand(host: string): string {
  return host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')
    ? normalizeBrandUrl(host)
    : DEFAULT_BRAND_URL;
}

export async function getFaqsPageData(host: string): Promise<FaqsPageData> {
  const brandUrl = resolveBrand(host);
  return apiGetWithEnvelope<FaqsPageData>('/v1/landing/faqs', {
    // Fetch a broad first page so category tabs (e.g., Payment) are not dropped
    // by the backend pagination default on program FAQ pages.
    query: { url: brandUrl, page: 1, limit: 200 },
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
}
