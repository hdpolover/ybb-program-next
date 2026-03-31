import { headers } from 'next/headers';

export function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  // Strip protocol first, then strip port (localhost:3000 → localhost, domain.com:8080 → domain.com)
  const withoutProtocol = trimmed.replace(/^https?:\/\//, '');
  return withoutProtocol.split(':')[0];
}

/**
 * Returns the configured environment domain (from NEXT_PUBLIC_BRAND_DOMAIN)
 * Will throw an error if the environment variable is not set since we are enforcing no-hardcoded-fallbacks policy.
 */
export function getEnvBrandDomain(): string {
  const envDomain = process.env.NEXT_PUBLIC_BRAND_DOMAIN || process.env.YBB_BRAND_DOMAIN;
  if (!envDomain) {
    throw new Error("Missing NEXT_PUBLIC_BRAND_DOMAIN or YBB_BRAND_DOMAIN in the environment variables.");
  }
  return normalizeBrandUrl(envDomain);
}

/**
 * Resolves the brand domain either from the request headers or the default env.
 */
export async function resolveBrandDomain(): Promise<string> {
  const h = await headers();
  const hostnameRaw = h.get('x-hostname') || h.get('host') || '';
  const hostname = hostnameRaw.split(':')[0];

  const defaultDomain = getEnvBrandDomain();

  if (!hostname || hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) {
    return defaultDomain;
  }

  return normalizeBrandUrl(hostname);
}

/**
 * Resolves the brand domain from a standard Web Request object
 */
export function resolveBrandDomainFromRequest(request: Request): string {
  const hostnameRaw = request.headers.get('x-hostname') || request.headers.get('host') || '';
  const hostname = hostnameRaw.split(':')[0];

  const defaultDomain = getEnvBrandDomain();

  if (!hostname || hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) {
    return defaultDomain;
  }

  return normalizeBrandUrl(hostname);
}
