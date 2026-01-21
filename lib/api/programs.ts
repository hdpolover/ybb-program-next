import type { ProgramsPageData } from '@/types/programs';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

const BRAND_URL = 'https://istanbulyouthsummit.com';

export async function getProgramsPageData(): Promise<ProgramsPageData> {
  return apiGetWithEnvelope<ProgramsPageData>('/v1/landing/programs', {
    query: { url: BRAND_URL },
    headers: {
      'x-brand-domain': BRAND_URL,
    },
  });
}
