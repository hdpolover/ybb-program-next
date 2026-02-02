import type { HomePageData } from '@/types/home';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

// Must match backend expectation exactly (see Postman collection)
const BRAND_URL = 'https://istanbulyouthsummit.com';

const DEFAULT_BRAND_URL = process.env.NEXT_PUBLIC_BRAND_DOMAIN || BRAND_URL;

export async function getHomePageData(host: string): Promise<HomePageData> {
  const hostname = (host || '').split(':')[0];

  const brandUrl = hostname && hostname !== 'localhost' && hostname !== '127.0.0.1'
    ? `https://${hostname}`
    : DEFAULT_BRAND_URL;
  return apiGetWithEnvelope<HomePageData>('/v1/landing/home', {
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
}
