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

// The API declares a { enabled, items } DTO, but the shared transform interceptor
// flattens any { items: [] } response: items becomes the envelope's `data` and the
// remaining fields move to `meta`. apiGetWithEnvelope returns `data`, so what arrives
// here is the bare item array. An empty array already means the feature is disabled,
// so the enabled flag carries no extra information on this side.
const fetcherByBrand = new Map<string, (url: string) => Promise<ActivityItem[]>>();

function getActivityFetcher(brandUrl: string): (url: string) => Promise<ActivityItem[]> {
  const cacheKey = brandUrl || 'default';
  const existing = fetcherByBrand.get(cacheKey);
  if (existing) return existing;

  const fetcher = unstable_cache(
    async (url: string): Promise<ActivityItem[]> => {
      return apiGetWithEnvelope<ActivityItem[]>('/v1/landing/activity', {
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
    const items = await getActivityFetcher(brandUrl)(brandUrl);
    return Array.isArray(items) ? items : [];
  } catch {
    // Activity is decoration. A failure here must never break the page.
    return [];
  }
}
