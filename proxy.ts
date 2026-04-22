import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com';

// Get default brand URL from env (optional for multi-brand)
const getDefaultBrandUrl = (): string | null => {
  const raw = process.env.NEXT_PUBLIC_BRAND_DOMAIN || process.env.YBB_BRAND_DOMAIN;
  if (!raw) return null;
  return raw.trim().replace(/\/+$/, '').replace(/^https?:\/\//, '');
};

// Resolve brand URL from request (for multi-brand support)
const resolveBrandUrl = (request: NextRequest): string => {
  const hostname = request.headers.get('host') || '';
  const cleanHostname = hostname.split(':')[0]; // Remove port
  
  if (!cleanHostname || cleanHostname.startsWith('localhost') || cleanHostname.startsWith('127.0.0.1')) {
    return getDefaultBrandUrl() || 'localhost';
  }
  
  return cleanHostname;
};

async function isMaintenanceModeEnabled(brandUrl: string): Promise<boolean> {
  try {
    const url = new URL('/v1/landing/settings', API_BASE_URL);

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandUrl,
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

export async function proxy(request: NextRequest) {
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
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico';

  if (!isExemptRoute) {
    const maintenanceEnabled = await isMaintenanceModeEnabled(brandUrl);
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
    '/((?!api|_next/static|_next/image|favicon.ico|img/).*)',
  ],
};
