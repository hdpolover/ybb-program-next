import { NextRequest, NextResponse } from 'next/server';

/**
 * Referral token middleware
 *
 * Detects generic referral query parameters on any page request, stores the
 * token in a cookie (30-day expiry, HttpOnly), and strips the param from the
 * URL so the user never sees it lingering.
 *
 * Supported params (in priority order): t, c, s, q, ref
 */

const REFERRAL_PARAMS = ['t', 'c', 's', 'q', 'ref'] as const;
const COOKIE_NAME = 'ybb_referral_code';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(request: NextRequest) {
    const { nextUrl } = request;
    const searchParams = new URLSearchParams(nextUrl.search);

    // Find the first matching referral param
    let token: string | null = null;
    let matchedParam: string | null = null;

    for (const param of REFERRAL_PARAMS) {
        const value = searchParams.get(param);
        if (value && value.trim().length > 0) {
            token = value.trim().toUpperCase();
            matchedParam = param;
            break;
        }
    }

    if (!token || !matchedParam) {
        // No referral param — pass through unchanged
        return NextResponse.next();
    }

    // Strip the referral param from the URL
    searchParams.delete(matchedParam);
    const cleanSearch = searchParams.toString();
    const cleanUrl = new URL(nextUrl.pathname + (cleanSearch ? `?${cleanSearch}` : ''), nextUrl.origin);

    const response = NextResponse.redirect(cleanUrl);

    // Only store if no cookie already exists (first-touch attribution)
    const existing = request.cookies.get(COOKIE_NAME);
    if (!existing) {
        response.cookies.set(COOKIE_NAME, token, {
            maxAge: COOKIE_MAX_AGE,
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
        });
    }

    return response;
}

export const config = {
    /*
     * Match all routes except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - API routes (we handle the cookie there directly)
     */
    matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
