import { NextResponse } from 'next/server';
import { getFeatureFlags } from '@/lib/server/featureFlags';

/**
 * Build a canonical origin string (scheme://host[:port]) by running the
 * combined value through the URL parser, which strips default ports and
 * lower-cases the authority.  Returns '' on any parse failure.
 */
function buildOrigin(proto: string, host: string): string {
  try {
    return new URL(`${proto}://${host}`).origin;
  } catch {
    return '';
  }
}

/**
 * Derive the effective origin of the server from request headers.
 * Uses x-forwarded-proto (supports comma-separated values from load-balancers)
 * and x-forwarded-host / host.  Falls back to "https" in production so that
 * the comparison never accidentally passes on http vs https mismatch.
 */
function getRequestOrigin(request: Request): string {
  const host =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  if (!host) return '';
  const rawProto = request.headers.get('x-forwarded-proto') || '';
  const proto =
    rawProto.split(',')[0].trim() ||
    (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  return buildOrigin(proto, host);
}

/**
 * Extract the full origin (scheme://host[:port]) from the Origin header, or
 * fall back to the origin portion of the Referer URL.
 */
function getIncomingOrigin(request: Request): string {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).origin;
    } catch {
      return '';
    }
  }

  const referer = request.headers.get('referer');
  if (!referer) return '';
  try {
    return new URL(referer).origin;
  } catch {
    return '';
  }
}

function isSameOriginRequest(request: Request): { valid: boolean; reason?: string } {
  const requestOrigin = getRequestOrigin(request);
  const incomingOrigin = getIncomingOrigin(request);

  if (!requestOrigin) return { valid: false, reason: 'missing-request-origin' };
  if (!incomingOrigin) return { valid: false, reason: 'missing-incoming-origin' };
  if (requestOrigin !== incomingOrigin) return { valid: false, reason: 'origin-mismatch' };
  return { valid: true };
}

export function getCsrfGuardRejection(request: Request): NextResponse | null {
  const flags = getFeatureFlags();
  const result = isSameOriginRequest(request);
  const enforceGuard = flags.enableCsrfGuard || process.env.NODE_ENV === 'production';

  if (!result.valid && !enforceGuard) {
    console.warn('[bff-csrf-guard] log-only violation', {
      method: request.method,
      path: new URL(request.url).pathname,
      reason: result.reason,
    });
    return null;
  }

  if (!result.valid) {
    return NextResponse.json(
      { statusCode: 403, message: 'Forbidden: cross-origin request blocked', data: null },
      { status: 403 },
    );
  }

  return null;
}
