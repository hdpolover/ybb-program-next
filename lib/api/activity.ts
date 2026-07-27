// lib/api/activity.ts
import { unstable_cache } from 'next/cache';
import { apiGetWithEnvelope } from './httpClient';
import { ACTIVITY_CACHE_TAG, ACTIVITY_CACHE_TTL, getActivityCacheTag } from '../constants/cache';

export type ActivityType = 'registered' | 'accepted';

export interface ActivityItem {
  type: ActivityType;
  name: string;
  country: string;
  countryCode: string;
  programName: string;
}

interface ActivityResponse {
  enabled: boolean;
  items: ActivityItem[];
}

const fetcherByBrand = new Map<string, (url: string) => Promise<ActivityResponse>>();

function getActivityFetcher(brandUrl: string): (url: string) => Promise<ActivityResponse> {
  const cacheKey = brandUrl || 'default';
  const existing = fetcherByBrand.get(cacheKey);
  if (existing) return existing;

  const fetcher = unstable_cache(
    async (url: string): Promise<ActivityResponse> => {
      return apiGetWithEnvelope<ActivityResponse>('/v1/landing/activity', {
        query: { url },
        headers: { 'x-brand-domain': brandUrl },
        cache: 'no-store',
      });
    },
    [ACTIVITY_CACHE_TAG, cacheKey],
    { revalidate: ACTIVITY_CACHE_TTL, tags: [ACTIVITY_CACHE_TAG, getActivityCacheTag(brandUrl)] },
  );

  fetcherByBrand.set(cacheKey, fetcher);
  return fetcher;
}

export async function getActivityData(brandUrl: string): Promise<ActivityItem[]> {
  try {
    const response = await getActivityFetcher(brandUrl)(brandUrl);
    if (!response?.enabled || !Array.isArray(response.items)) return [];
    return response.items;
  } catch {
    // Activity is decoration. A failure here must never break the page.
    return [];
  }
}
