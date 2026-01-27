import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE_URL = 'https://staging-api.ybbhub.com';
const BRAND_URL = 'https://istanbulyouthsummit.com';

async function isMaintenanceModeEnabled(): Promise<boolean> {
  try {
    const url = new URL('/v1/landing/settings', API_BASE_URL);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': BRAND_URL,
      },
    });

    if (!res.ok) return false;

    const json = (await res.json()) as {
      statusCode: number;
      message: string;
      data?: {
        maintenance?: {
          is_maintenance_mode?: boolean;
        };
      } | null;
    };

    return Boolean(json?.data?.maintenance?.is_maintenance_mode);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
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
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico';

  if (!isExemptRoute) {
    const maintenanceEnabled = await isMaintenanceModeEnabled();
    if (maintenanceEnabled) {
      const url = request.nextUrl.clone();
      url.pathname = '/maintenance';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
