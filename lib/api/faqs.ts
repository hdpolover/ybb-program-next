import type { FaqsPageData } from '@/types/faqs';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.replace(/^https?:\/\//, '');
}

const BRAND_URL =
  normalizeBrandUrl(process.env.NEXT_PUBLIC_BRAND_DOMAIN || '') || 'istanbulyouthsummit.com';

export async function getFaqsPageData(): Promise<FaqsPageData> {
  return apiGetWithEnvelope<FaqsPageData>('/v1/landing/faqs', {
    query: { url: BRAND_URL },
    headers: {
      'x-brand-domain': BRAND_URL,
    },
  });
}
