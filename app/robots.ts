import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { headers } from 'next/headers';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const hostnameRaw = h.get('x-hostname') || h.get('host') || '';
  const fallbackHost = normalizeBrandUrl(getEnvBrandDomain() || new URL(siteConfig.url).host);
  const host = normalizeBrandUrl(hostnameRaw) || fallbackHost;
  const protocol = h.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https');
  const siteUrl = `${protocol}://${host}`.replace(/\/+$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
