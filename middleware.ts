import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the hostname from the request headers
  const hostname = request.headers.get('host') || '';
  
  // Clone the request headers
  const requestHeaders = new Headers(request.headers);
  
  // Add the hostname to the headers so it can be accessed in server components
  requestHeaders.set('x-hostname', hostname);
  
  // You can also add logic here to rewrite paths based on hostname if needed
  // For example, if you wanted to map domains to specific paths internally
  
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
