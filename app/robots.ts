import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl.replace(/\/+$/, '')}/sitemap.xml`,
    host: siteUrl.replace(/\/+$/, ''),
  };
}
