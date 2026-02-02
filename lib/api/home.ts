import type { HomePageData } from '@/types/home';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

// Must match backend expectation exactly (see Postman collection)
const BRAND_URL = 'https://istanbulyouthsummit.com';

  return apiGetWithEnvelope<HomePageData>('/v1/landing/home', {
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
}
