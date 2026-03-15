import type { HomePageData } from '@/types/home';
import { apiGetWithEnvelope, ApiRequestError } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';
import { cache } from 'react';

function buildBrandUrlVariants(normalizedUrl: string): string[] {
  const noScheme = normalizedUrl.replace(/^https?:\/\//, '');
  const withSlash = `${noScheme.replace(/\/+$/, '')}/`;

  const variants = [noScheme, withSlash];
  return Array.from(new Set(variants.filter(Boolean)));
}

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain());

let homeRateLimitUntil = 0;

function buildHomeFallback(): HomePageData {
  return {
    title: 'Youth Summit',
    slug: null,
    sections: [],
  } as unknown as HomePageData;
}

export async function getHomePageData(host: string): Promise<HomePageData> {
  return getHomePageDataCached(host);
}

const getHomePageDataCached = cache(async (host: string): Promise<HomePageData> => {
  if (Date.now() < homeRateLimitUntil) {
    return buildHomeFallback();
  }

  const hostname = (host || '').split(':')[0];

  const brandUrl = hostname && hostname !== 'localhost' && hostname !== '127.0.0.1'
    ? normalizeBrandUrl(hostname)
    : DEFAULT_BRAND_URL;

  const urlVariants = buildBrandUrlVariants(brandUrl);
  let lastError: unknown = null;

  for (let i = 0; i < urlVariants.length; i += 1) {
    const url = urlVariants[i];
    try {
      return await apiGetWithEnvelope<HomePageData>('/v1/landing/home', {
        query: { url },
        headers: {
          'x-brand-domain': brandUrl,
        },
        next: { revalidate: 0 },
      });
    } catch (e) {
      lastError = e;

      if (e instanceof ApiRequestError && e.status === 429) {
        homeRateLimitUntil = Date.now() + 30_000;
        return buildHomeFallback();
      }

      if (!(e instanceof ApiRequestError) || e.status !== 404) {
        throw e;
      }

      if (i === urlVariants.length - 1) {
        break;
      }
    }
  }

  console.error('Failed to fetch home page data for all brand url variants', {
    brandUrl,
    urlVariants,
  });
  throw lastError instanceof Error ? lastError : new Error('Failed to fetch home page data');
});
