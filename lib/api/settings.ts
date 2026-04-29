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

type BrandListItem = {
  id: string;
  slug: string;
  name: string;
  isActive?: boolean;
  deletedAt?: string | null;
  websiteUrl?: string | null;
  landingUrl?: string | null;
  logoIconUrl?: string | null;
  tagline?: string | null;
  description?: string | null;
  location?: string | null;
  city?: string | null;
  country?: string | null;
  address?: string | null;
};

async function fetchAvailableBrands(): Promise<NonNullable<SettingsData['available_brands']>> {
  const brands = await apiGetWithEnvelope<BrandListItem[]>('/v1/brands', { cache: 'no-store' });

  return brands
    .filter((brand) => brand.isActive !== false && !brand.deletedAt)
    .map((brand) => ({
      id: brand.id,
      slug: brand.slug,
      name: brand.name,
      website_url: brand.websiteUrl ?? null,
      landing_url: brand.landingUrl ?? null,
      logo_icon_url: brand.logoIconUrl ?? null,
      tagline: brand.tagline ?? null,
      description: brand.description ?? null,
      location: brand.location ?? null,
      city: brand.city ?? null,
      country: brand.country ?? null,
      address: brand.address ?? null,
    }));
}

export async function getSettingsForBrandDomain(brandDomain: string): Promise<SettingsData> {
  const normalizedHost = normalizeBrandUrl(brandDomain);
  const normalized =
    !normalizedHost || normalizedHost === 'localhost' || normalizedHost === '127.0.0.1'
      ? DEFAULT_BRAND_URL
      : normalizedHost;

  const settings = await fetchSettingsFromBackend(normalized);
  if (Array.isArray(settings.available_brands)) {
    return settings;
  }

  try {
    const availableBrands = await fetchAvailableBrands();
    return {
      ...settings,
      available_brands: availableBrands,
    };
  } catch (error) {
    console.error('Failed to load available brands fallback', error);
    return settings;
  }
}

export async function getSettings(): Promise<SettingsData> {
  if (typeof window !== 'undefined') {
    // Check localStorage cache first
    try {
      const raw = localStorage.getItem(SETTINGS_LS_KEY);
      if (raw) {
        const { data, cachedAt } = JSON.parse(raw) as { data: SettingsData; cachedAt: number };
        const hasAvailableBrands = Array.isArray(data.available_brands);
        if (Date.now() - cachedAt < SETTINGS_LS_TTL_MS && hasAvailableBrands) return data;
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
