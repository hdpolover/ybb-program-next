import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

const API_BASE_URL = getServerApiBaseUrl();
const BRAND_STATUS_CACHE_TTL_MS = 30_000;

type BrandStatus = { exists: boolean; maintenance: boolean };
const brandStatusCache = new Map<string, { value: BrandStatus; expiresAt: number }>();

const REFERRAL_PARAMS = ['t', 'c', 's', 'q', 'ref'] as const;
const REFERRAL_COOKIE_NAME = 'ybb_referral_code';
const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; 

const getDefaultBrandUrl = (): string | null => {
  const raw = process.env.NEXT_PUBLIC_BRAND_DOMAIN || process.env.YBB_BRAND_DOMAIN;
  if (!raw) return null;
  return raw.trim().replace(/\/+$/, '').replace(/^https?:\/\//, '');
};


const resolveBrandUrl = (request: NextRequest): string => {
  const hostname = request.headers.get('host') || '';
  const cleanHostname = hostname.split(':')[0]; 
  
  if (!cleanHostname || cleanHostname.startsWith('localhost') || cleanHostname.startsWith('127.0.0.1')) {
    return getDefaultBrandUrl() || 'localhost';
  }
  
  return cleanHostname;
};

// Resolves brand existence + maintenance state from a single landing/settings call.
// - 404 => brand definitively not found for this domain (exists: false).
// - Any other failure (5xx, network) => fail open (exists: true) so a transient API
//   outage never black-holes a real brand behind the "unavailable" page.
async function getBrandStatus(brandUrl: string): Promise<BrandStatus> {
  const now = Date.now();
  const cached = brandStatusCache.get(brandUrl);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const cache = (value: BrandStatus): BrandStatus => {
    brandStatusCache.set(brandUrl, { value, expiresAt: now + BRAND_STATUS_CACHE_TTL_MS });
    return value;
  };

  try {
    const url = new URL('/v1/landing/settings', API_BASE_URL);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandUrl,
      },
    });

    if (res.status === 404) {
      return cache({ exists: false, maintenance: false });
    }

    if (!res.ok) {
      // Transient/non-404 error: fail open, don't cache so the next request retries.
      return { exists: true, maintenance: false };
    }

    const json = (await res.json()) as {
      statusCode: number;
      message: string;
      data?: {
        maintenance?: {
          is_maintenance_mode?: boolean;
        };
      } | null;
    };

    return cache({
      exists: true,
      maintenance: Boolean(json?.data?.maintenance?.is_maintenance_mode),
    });
  } catch {
    if (cached) {
      return cached.value;
    }
    // Network error with no cached value: fail open.
    return { exists: true, maintenance: false };
  }
}

const getDirectReferralCode = (request: NextRequest): string | null => {
  const code =
    request.nextUrl.searchParams.get('referralCode') || request.nextUrl.searchParams.get('t');
  return code && code.trim().length > 0 ? code.trim() : null;
};

const resolveReferralCode = async (
  request: NextRequest,
  brandUrl: string,
): Promise<string | null> => {
  const directCode = getDirectReferralCode(request);
  if (directCode) return directCode;

  const shareToken = request.nextUrl.searchParams.get('r');
  if (!shareToken || shareToken.trim().length === 0) return null;

  try {
    const url = new URL('/v1/participants/ambassador/share-token/resolve', API_BASE_URL);
    url.searchParams.set('token', shareToken);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandUrl,
      },
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const json = (await response.json()) as {
      data?: { referralCode?: string } | null;
      referralCode?: string;
    };

    const referralCode = json?.data?.referralCode || json?.referralCode || null;
    return referralCode && referralCode.trim().length > 0 ? referralCode.trim() : null;
  } catch {
    return null;
  }
};

const attachReferralCookie = async (
  request: NextRequest,
  response: NextResponse,
  brandUrl: string,
): Promise<NextResponse> => {
  const referralCode = await resolveReferralCode(request, brandUrl);
  if (!referralCode) return response;

  response.cookies.set(REFERRAL_COOKIE_NAME, referralCode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
};

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const searchParams = new URLSearchParams(nextUrl.search);

  let referralToken: string | null = null;
  let matchedParam: string | null = null;

  for (const param of REFERRAL_PARAMS) {
    const value = searchParams.get(param);
    if (value && value.trim().length > 0) {
      referralToken = value.trim().toUpperCase();
      matchedParam = param;
      break;
    }
  }

  if (referralToken && matchedParam) {
    searchParams.delete(matchedParam);
    const cleanSearch = searchParams.toString();
    const cleanUrl = new URL(nextUrl.pathname + (cleanSearch ? `?${cleanSearch}` : ''), nextUrl.origin);

    const response = NextResponse.redirect(cleanUrl);

    const existing = request.cookies.get(REFERRAL_COOKIE_NAME);
    if (!existing) {
      response.cookies.set(REFERRAL_COOKIE_NAME, referralToken, {
        maxAge: REFERRAL_COOKIE_MAX_AGE,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });
    }

    return response;
  }

  // Resolve brand URL dynamically from request (multi-brand support)
  const brandUrl = resolveBrandUrl(request);
  
  // Get the hostname from the request headers
  const hostname = request.headers.get('host') || '';
  
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add the hostname to the headers so it can be accessed in server components
  requestHeaders.set('x-hostname', hostname);
  
  // You can also add logic here to rewrite paths based on hostname if needed
  // For example, if you wanted to map domains to specific paths internally

  const { pathname } = request.nextUrl;

  const isExemptRoute =
    pathname === '/maintenance' ||
    pathname === '/unavailable' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico';

  if (!isExemptRoute) {
    const { exists, maintenance } = await getBrandStatus(brandUrl);

    // No brand resolves for this domain: show a friendly, brand-neutral page.
    // Rewrite (not redirect) so the user keeps their URL and there's no flash.
    if (!exists) {
      const url = request.nextUrl.clone();
      url.pathname = '/unavailable';
      return NextResponse.rewrite(url);
    }

    if (maintenance) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return attachReferralCookie(request, NextResponse.redirect(url), brandUrl);
    }
  }
  
  return attachReferralCookie(request, NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  }), brandUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|img/).*)',
  ],
};
