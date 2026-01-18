import type { HomePageData } from '@/types/home';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';

export async function getHomePageData(hostname: string): Promise<HomePageData> {
  // Ensure the hostname has a protocol. If not, assume https.
  // The API expects 'url' query param to identify the tenant.
  // We can let the caller handle the protocol or add it here.
  // Assuming the API expects the full URL like 'https://youthacademicforum.com'
  
  const protocol = hostname.includes('localhost') ? 'http' : 'https';
  const brandUrl = hostname.startsWith('http') ? hostname : `${protocol}://${hostname}`;

  return apiGetWithEnvelope<HomePageData>('/v1/landing/home', {
    query: { url: brandUrl },
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
}
