import AnnouncementsGrid from '@/components/announcements/AnnouncementsGrid';
import HeroSection from '@/components/ui/HeroSection';
import { getAnnouncementsPageData } from '@/lib/api/announcements';
import { buildAnnouncementsHref, parseAnnouncementsSearchParams, resolveAnnouncementHref } from '@/lib/announcements';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import { resolveBrandDomain } from '@/lib/server/envContext';
import type { AnnouncementApiItem, AnnouncementListSection, AnnouncementsHeroSection } from '@/types/announcements';

// The awardees rail is capped rather than paginated: it is a highlight
// strip, not a browsable list.
const AWARDS_CATEGORY = 'awards';
const AWARDS_LIMIT = 6;

type AnnouncementsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: AnnouncementsPageProps): Promise<Metadata> {
  const host = await resolveBrandDomain();
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const parsed = parseAnnouncementsSearchParams(await searchParams);
  // Self-referencing canonical: each page/filter combination is a distinct,
  // real HTML document (see SEO requirement in the pagination plumbing task),
  // not a duplicate of page 1.
  const canonicalPath = buildAnnouncementsHref(parsed);

  try {
    const announcementsPage = await getAnnouncementsPageData(host, {
      page: parsed.page,
      search: parsed.search,
      category: parsed.category,
      tag: parsed.tag,
      programId: parsed.programId,
      year: parsed.year,
    });
    const heroSection = announcementsPage.sections.find(
      (section): section is AnnouncementsHeroSection => section.type === 'hero',
    );
    const title = announcementsPage.title?.trim() || 'Announcements';
    const description =
      heroSection?.content.subheadline?.trim() ||
      'Stay informed about the latest Youth Break the Boundaries announcements.';

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      openGraph: {
        title,
        description,
        type: 'website',
        url: canonicalPath,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      metadataBase: new URL(baseUrl),
      title: 'Announcements',
      description: 'Latest announcements from Youth Break the Boundaries.',
      alternates: {
        canonical: canonicalPath,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }
}

export default async function AnnouncementsPage({ searchParams }: AnnouncementsPageProps) {
  const host = (await headers()).get('host') || '';
  const parsed = parseAnnouncementsSearchParams(await searchParams);
  let announcementsPage: Awaited<ReturnType<typeof getAnnouncementsPageData>> | null = null;

  // The awardees rail is its own query, not a slice of the main list. Deriving
  // it from the current page meant it emptied out as soon as a visitor paged
  // past the awards posts, or filtered to something else.
  let awardsPage: Awaited<ReturnType<typeof getAnnouncementsPageData>> | null = null;

  const [listResult, awardsResult] = await Promise.allSettled([
    getAnnouncementsPageData(host, {
      page: parsed.page,
      search: parsed.search,
      category: parsed.category,
      tag: parsed.tag,
      programId: parsed.programId,
      year: parsed.year,
    }),
    getAnnouncementsPageData(host, { category: AWARDS_CATEGORY, page: 1, limit: AWARDS_LIMIT }),
  ]);

  if (listResult.status === 'fulfilled') {
    announcementsPage = listResult.value;
  } else {
    console.error('Failed to fetch announcements page data', listResult.reason);
  }

  // A failed awards fetch hides that rail; it must not take the page down.
  if (awardsResult.status === 'fulfilled') {
    awardsPage = awardsResult.value;
  } else {
    console.error('Failed to fetch awardee announcements', awardsResult.reason);
  }

  const heroSection = announcementsPage?.sections.find(
    (section): section is AnnouncementsHeroSection => section.type === 'hero',
  );

  const announcementListSection = announcementsPage?.sections.find(
    (section): section is AnnouncementListSection => section.type === 'announcement_list',
  );

  const toGridItem = (item: AnnouncementApiItem) => ({
    id: item.id,
    image: item.image || '/img/announcementbackground.png',
    title: item.title || announcementsPage?.title || 'Announcements',
    excerpt: item.excerpt || '',
    author: item.author || 'YBB',
    date: item.date || '',
    href: resolveAnnouncementHref(item.id, item.href),
    category: item.category || undefined,
    tags: item.tags ?? undefined,
  });

  const items = (announcementListSection?.data ?? []).map(toGridItem);

  const awardAnnouncements = (
    awardsPage?.sections.find(
      (section): section is AnnouncementListSection => section.type === 'announcement_list',
    )?.data ?? []
  ).map(toGridItem);

  const pagination = announcementListSection?.content?.pagination;
  const filterValues = announcementListSection?.content?.filters;

  const heroHeadline = heroSection?.content.headline || 'Latest News & Updates';
  const heroSubheadline =
    heroSection?.content.subheadline || 'Stay informed about our latest activities and opportunities.';
  const heroMedia = await getLandingHeroMedia(host, 'announcements', {
    preferredImages: items.map((item) => item.image),
    fallbackImage: '/img/announcementbackground.png',
  });

  return (
    <main className="relative">
      <HeroSection
        title={heroHeadline}
        subtitle={heroSubheadline}
        bgImage={heroMedia.bgImage ?? '/img/announcementbackground.png'}
        galleryImages={heroMedia.galleryImages}
        align="left"
        textSize="sm"
      />

      {/* Section pengumuman - dipisah ke komponen biar clean */}
      <section id="announcements">
        <AnnouncementsGrid items={items} pagination={pagination} filters={filterValues} current={parsed} />
      </section>

      {/* Meet Our Awardees - news/announcements about winners using same layout */}
      {awardAnnouncements.length > 0 ? (
        <section id="awardees">
          <AnnouncementsGrid
            items={awardAnnouncements}
            title="Meet Our Awardees"
            subtitle="Announcements and stories about our award winners."
            showControls={false}
          />
        </section>
      ) : null}
    </main>
  );
}
