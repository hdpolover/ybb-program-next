import type { HomePageData } from '@/types/home';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

const BRAND_URL = 'https://istanyouthsummit.com';

export async function getHomePageData(): Promise<HomePageData> {
  return apiGetWithEnvelope<HomePageData>('/v1/landing/home', {
    query: { url: BRAND_URL },
    headers: {
      'x-brand-domain': BRAND_URL,
    },
  });
}
