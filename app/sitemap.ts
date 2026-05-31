import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getAnnouncementsPageData } from '@/lib/api/announcements';
import { normalizeBrandUrl } from '@/lib/server/envContext';
import type { AnnouncementListSection } from '@/types/announcements';

const STATIC_PATHS = [
  '/',
  '/announcements',
  '/participant-distribution',
  '/register',
  '/login',
  '/about',
  '/program',
  '/faq',
  '/contact',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url).replace(/\/+$/, '');
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));

  try {
    const host = normalizeBrandUrl(new URL(siteUrl).host);
    const pageData = await getAnnouncementsPageData(host);
    const listSection = pageData.sections.find(
      (section): section is AnnouncementListSection => section.type === 'announcement_list',
    );

    const announcementEntries: MetadataRoute.Sitemap = (listSection?.data ?? []).map((item) => {
      const parsedDate = item.date ? new Date(item.date) : null;
      const lastModified = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : now;

      return {
        url: `${siteUrl}/announcements/${encodeURIComponent(String(item.id))}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.6,
      };
    });

    return [...staticEntries, ...announcementEntries];
  } catch {
    return staticEntries;
  }
}
