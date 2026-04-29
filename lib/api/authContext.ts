import { apiGetWithEnvelope } from '@/lib/api/httpClient';

export type BackendAuthContext = {
  brandDomain: string;
  brandId: string | null;
  requireEmailVerification: boolean;
  programId: string | null;
  programSlug: string | null;
  localProviderId: string | null;
  providers: Array<{
    id: string;
    name: string;
    displayName: string;
    description: string;
    isOAuth: boolean;
    icon: string;
    buttonColor: string;
  }>;
};

/**
 * Resolves brand+program+localProvider from the backend by domain.
 *
 * Why direct: previous routes used a loopback fetch — server-side fetch from
 * the Next.js worker back to its own public URL (/api/auth/context). On
 * Cloudflare/Vercel/Dokploy serverless runtimes that loopback either fails
 * with "fetch failed" or hits firewall rules. Calling the backend directly
 * avoids the re-entrant request entirely.
 */
export function fetchAuthContext(brandDomain: string): Promise<BackendAuthContext> {
  return apiGetWithEnvelope<BackendAuthContext>('/v1/auth/context', {
    headers: { 'x-brand-domain': brandDomain },
    cache: 'no-store',
  });
}
