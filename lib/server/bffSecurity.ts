import { NextResponse } from 'next/server';
import { getFeatureFlags } from '@/lib/server/featureFlags';

function normalizeHost(value: string | null): string {
  if (!value) return '';
  return value.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0].split(':')[0];
}

function getRequestHost(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = request.headers.get('host');
  const hostname = request.headers.get('x-hostname');
  return normalizeHost(forwardedHost || host || hostname);
}

function getOriginHost(request: Request): string {
  const origin = request.headers.get('origin');
  if (origin) {
    try {
      return normalizeHost(new URL(origin).host);
    } catch {
      return '';
    }
  }

  const referer = request.headers.get('referer');
  if (!referer) return '';
  try {
    return normalizeHost(new URL(referer).host);
  } catch {
    return '';
  }
}

function isSameOriginRequest(request: Request): { valid: boolean; reason?: string } {
  const requestHost = getRequestHost(request);
  const originHost = getOriginHost(request);

  if (!requestHost) return { valid: false, reason: 'missing-host' };
  if (!originHost) return { valid: false, reason: 'missing-origin' };
  if (requestHost !== originHost) return { valid: false, reason: 'origin-mismatch' };
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
