import type { PartnersPageData } from '@/types/partners';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.replace(/^https?:\/\//, '');
}

const BRAND_URL =
  normalizeBrandUrl(process.env.NEXT_PUBLIC_BRAND_DOMAIN || '') || 'japanyouthsummit.com';

export async function getPartnersPageData(): Promise<PartnersPageData> {
  return apiGetWithEnvelope<PartnersPageData>('/v1/landing/partners-sponsors', {
    query: { url: BRAND_URL },
    headers: {
      'x-brand-domain': BRAND_URL,
    },
  });
}
