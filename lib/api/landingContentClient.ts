import { ApiRequestError, apiGetWithEnvelope } from '@/lib/api/httpClient';

type LandingEnvelope<T> = {
  statusCode: number;
  message: string;
  data?: T;
};

type LandingFallbackOptions<T> = {
  brandDomain: string;
  landingPath: string;
  fallbackApiPath: string;
  fallbackQuery?: Record<string, string | number | boolean | undefined>;
};

function getLandingContentBaseUrl(): string | null {
  if (typeof window !== 'undefined') return null;
  const baseUrl = process.env.LANDING_CONTENT_INTERNAL_URL?.trim();
  return baseUrl ? baseUrl.replace(/\/+$/, '') : null;
}

async function fetchFromLandingContent<T>(brandDomain: string, landingPath: string): Promise<T> {
  const baseUrl = getLandingContentBaseUrl();
  if (!baseUrl) {
    throw new Error('LANDING_CONTENT_INTERNAL_URL is not configured');
  }

  const path = `/v1/public/${encodeURIComponent(brandDomain)}/${landingPath.replace(/^\/+/, '')}`;
  const url = new URL(path, `${baseUrl}/`);

  const res = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new ApiRequestError({ status: res.status, statusText: res.statusText, url: url.toString() });
  }

  const json = (await res.json()) as LandingEnvelope<T>;
  if (json.statusCode !== 200 || typeof json.data === 'undefined') {
    throw new Error(json.message || 'Unexpected landing-content response');
  }

  return json.data;
}

export async function getLandingPageWithFallback<T>({
  brandDomain,
  landingPath,
  fallbackApiPath,
  fallbackQuery,
}: LandingFallbackOptions<T>): Promise<T> {
  const hasLandingService = Boolean(getLandingContentBaseUrl());

  if (hasLandingService) {
    try {
      return await fetchFromLandingContent<T>(brandDomain, landingPath);
    } catch (error) {
      console.warn('landing-content fetch failed, falling back to API', {
        brandDomain,
        landingPath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return apiGetWithEnvelope<T>(fallbackApiPath, {
    query: fallbackQuery,
    headers: {
      'x-brand-domain': brandDomain,
    },
    cache: 'no-store',
  });
}
