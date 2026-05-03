import { headers } from 'next/headers';

const resolvedHostCache = new Map<string, string>();
// Cap the host-resolution cache to prevent unbounded growth from request-controlled Host headers.
const MAX_RESOLVED_HOST_CACHE = 50;

export function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  // Strip protocol first, then strip port (localhost:3000 → localhost, domain.com:8080 → domain.com)
  const withoutProtocol = trimmed.replace(/^https?:\/\//, '');
  return withoutProtocol.split(':')[0];
}

function resolveFromHost(hostnameRaw: string, defaultDomain: string | null): string {
  const cacheKey = `${hostnameRaw}|${defaultDomain ?? ''}`;
  const cached = resolvedHostCache.get(cacheKey);
  if (cached) return cached;

  const hostname = hostnameRaw.split(':')[0];
  const resolved =
    !hostname || hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')
      ? defaultDomain || 'localhost'
      : normalizeBrandUrl(hostname);

  if (resolvedHostCache.size < MAX_RESOLVED_HOST_CACHE) {
    resolvedHostCache.set(cacheKey, resolved);
  }
  return resolved;
}

/**
 * Returns the configured environment domain (from NEXT_PUBLIC_BRAND_DOMAIN)
 * For multi-brand deployments, this is optional - the domain will be resolved from request headers.
 */
export function getEnvBrandDomain(): string | null {
  const envDomain = process.env.NEXT_PUBLIC_BRAND_DOMAIN || process.env.YBB_BRAND_DOMAIN;
  if (!envDomain) {
    return null;
  }
  return normalizeBrandUrl(envDomain);
}

/**
 * Resolves the brand domain either from the request headers or the default env.
 * For multi-brand deployments, extracts domain from request headers.
 */
export async function resolveBrandDomain(): Promise<string> {
  const h = await headers();
  const hostnameRaw = h.get('x-hostname') || h.get('host') || '';
  const defaultDomain = getEnvBrandDomain();
  return resolveFromHost(hostnameRaw, defaultDomain);
}

/**
 * Resolves the brand domain from a standard Web Request object
 * For multi-brand deployments, extracts domain from request headers.
 */
export function resolveBrandDomainFromRequest(request: Request): string {
  const hostnameRaw = request.headers.get('x-hostname') || request.headers.get('host') || '';
  const defaultDomain = getEnvBrandDomain();
  return resolveFromHost(hostnameRaw, defaultDomain);
}
