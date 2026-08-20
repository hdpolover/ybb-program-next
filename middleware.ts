import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

const API_BASE_URL = getServerApiBaseUrl();
const BRAND_STATUS_CACHE_TTL_MS = 30_000;

type BrandStatus = { exists: boolean; maintenance: boolean };
const brandStatusCache = new Map<string, { value: BrandStatus; expiresAt: number }>();

// Params that may carry a referral code. Deliberately narrow: `q`, `c` and `s`
// used to be on this list, which meant any URL carrying one of them was treated
// as a referral link. `/search?q=eligibilities` had its query stripped and the
// word stored as a referral code, and values like ELIGIBILITIES and LANG really
// did end up on participant records in production.
const REFERRAL_CODE_PARAMS = ['referralCode', 't', 'ref'] as const;
const REFERRAL_COOKIE_NAME = 'ybb_referral_code';
const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const REFERRAL_CODE_MIN_LENGTH = 6;
const REFERRAL_CODE_MAX_LENGTH = 20;
const REFERRAL_CODE_PATTERN = new RegExp(
  `^[A-Z0-9-]{${REFERRAL_CODE_MIN_LENGTH},${REFERRAL_CODE_MAX_LENGTH}}$`,
);
const SESSION_COOKIE_NAME = 'accessToken';
const SIGNUP_PATH = '/login';

/**
 * Folds a candidate referral code into the form the backend matches on, or
 * returns null when it does not look like a code at all.
 *
 * The backend looks codes up by exact match and every code it generates is
 * uppercase, so a hand-typed or link-mangled lowercase code has to be folded
 * before it is persisted. The shape check is a garbage filter: it keeps prose
 * and over-length values (which overflow the VarChar(20) column and surface as
 * an opaque 500) out of the cookie. It is NOT what stops page params being
 * mistaken for codes -- real words pass any rule loose enough to admit real
 * codes, so that job belongs to REFERRAL_CODE_PARAMS being narrow.
 */
export function normalizeReferralCode(code: string | null | undefined): string | null {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  return REFERRAL_CODE_PATTERN.test(normalized) ? normalized : null;
}

/**
 * Decides whether a resolved referral code is safe to persist in the
 * ybb_referral_code cookie.
 */
export function shouldStoreReferralCode(code: string): boolean {
  return normalizeReferralCode(code) !== null;
}

/**
 * Ambassador share links used to land on the program page, where visitors
 * browsed and left without ever creating an account. They now go straight to
 * the sign-up form. Two carve-outs: a visitor who already has a session keeps
 * the destination they clicked (bouncing a signed-in participant onto a
 * sign-up form is worse than the original behaviour), and a request already on
 * the sign-up path needs no hop, which is what keeps this loop-free.
 */
export function shouldRedirectReferralToSignup(params: {
  pathname: string;
  isAuthenticated: boolean;
}): boolean {
  return !params.isAuthenticated && params.pathname !== SIGNUP_PATH;
}

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
  for (const param of REFERRAL_CODE_PARAMS) {
    const code = request.nextUrl.searchParams.get(param);
    if (code && code.trim().length > 0) return code.trim();
  }
  return null;
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
  const referralCode = normalizeReferralCode(await resolveReferralCode(request, brandUrl));
  if (!referralCode) return response;

  response.cookies.set(REFERRAL_COOKIE_NAME, referralCode, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: REFERRAL_COOKIE_MAX_AGE,
  });

  return response;
};

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // Referral params used to be stripped from the URL and redirected away here,
  // purely so the code would not linger in the address bar. That cosmetic strip
  // was destructive: it ran before any route check and deleted the param
  // whether or not the value looked like a referral code, which is how
  // `/search?q=...` lost its query. Capture is now non-destructive and happens
  // in attachReferralCookie on the response the request was going to get
  // anyway, so no page is ever redirected for carrying a param it owns.

  // Resolve brand URL dynamically from request (multi-brand support)
  const brandUrl = resolveBrandUrl(request);

  // Ambassador share links (?r=<share token>) drop the visitor straight onto
  // the sign-up form instead of the page the link points at. The referral
  // cookie is attached to the redirect response itself, so attribution
  // survives the hop; `r` is deliberately dropped from the target so the
  // follow-up request cannot bounce again. Scoped to `r` only: that is the one
  // param the platform actually mints, and the plaintext code params merely set
  // the cookie in place without moving the visitor.
  const shareToken = nextUrl.searchParams.get('r');
  if (
    shareToken &&
    shareToken.trim().length > 0 &&
    shouldRedirectReferralToSignup({
      pathname: nextUrl.pathname,
      isAuthenticated: request.cookies.has(SESSION_COOKIE_NAME),
    })
  ) {
    const signupUrl = new URL(SIGNUP_PATH, nextUrl.origin);
    signupUrl.searchParams.set('mode', 'signup');
    return attachReferralCookie(request, NextResponse.redirect(signupUrl), brandUrl);
  }

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
