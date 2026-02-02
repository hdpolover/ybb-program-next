import type { PartnersPageData } from '@/types/partners';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

const BRAND_URL = 'https://istanbulyouthsummit.com';

export async function getPartnersPageData(): Promise<PartnersPageData> {
  return apiGetWithEnvelope<PartnersPageData>('/v1/landing/partners-sponsors', {
    query: { url: BRAND_URL },
    headers: {
      'x-brand-domain': BRAND_URL,
    },
  });
}
