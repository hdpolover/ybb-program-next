import { unstable_cache } from 'next/cache';
import type { SettingsData } from '@/types/settings';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';
import {
  SETTINGS_CACHE_TAG,
  SETTINGS_CACHE_TTL,
  SETTINGS_LS_KEY,
  SETTINGS_LS_TTL_MS,
} from '@/lib/constants/cache';

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain() ?? '');

// Server-side cached fetch — shared by layout SSR and /api/settings route handler.
// unstable_cache keys by function arguments, so each brandDomain gets its own cache entry.
const fetchSettingsFromBackend = unstable_cache(
  async (brandDomain: string): Promise<SettingsData> => {
    return apiGetWithEnvelope<SettingsData>('/v1/landing/settings', {
      headers: { 'x-brand-domain': brandDomain },
      cache: 'no-store', // unstable_cache owns the TTL; skip fetch-level HTTP cache
    });
  },
  [SETTINGS_CACHE_TAG],
  { revalidate: SETTINGS_CACHE_TTL, tags: [SETTINGS_CACHE_TAG] },
);

export async function getSettingsForBrandDomain(brandDomain: string): Promise<SettingsData> {
  const normalizedHost = normalizeBrandUrl(brandDomain);
  const normalized =
    !normalizedHost || normalizedHost === 'localhost' || normalizedHost === '127.0.0.1'
      ? DEFAULT_BRAND_URL
      : normalizedHost;
  return fetchSettingsFromBackend(normalized);
}

export async function getSettings(): Promise<SettingsData> {
  if (typeof window !== 'undefined') {
    // Check localStorage cache first
    try {
      const raw = localStorage.getItem(SETTINGS_LS_KEY);
      if (raw) {
        const { data, cachedAt } = JSON.parse(raw) as { data: SettingsData; cachedAt: number };
        if (Date.now() - cachedAt < SETTINGS_LS_TTL_MS) return data;
        localStorage.removeItem(SETTINGS_LS_KEY);
      }
    } catch {
      // Ignore localStorage errors (e.g. private browsing restrictions)
    }

    // Fall back to the Next.js API route (which uses the server-side cache)
    const res = await fetch('/api/settings', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    const json = (await res.json()) as { statusCode: number; message: string; data: SettingsData };
    if (json.statusCode !== 200 || !json.data) {
      throw new Error(json.message || 'Unexpected API response');
    }

    try {
      localStorage.setItem(
        SETTINGS_LS_KEY,
        JSON.stringify({ data: json.data, cachedAt: Date.now() }),
      );
    } catch {}

    return json.data;
  }

  // Server-side fallback (e.g. called from a non-layout server component)
  return fetchSettingsFromBackend(DEFAULT_BRAND_URL);
}
