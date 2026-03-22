import AnnouncementsGrid from '@/components/announcements/AnnouncementsGrid';
import HeroSection from '@/components/ui/HeroSection';
import { getAnnouncementsPageData } from '@/lib/api/announcements';
import type { AnnouncementListSection, AnnouncementsHeroSection } from '@/types/announcements';

export default async function AnnouncementsPage() {
  let announcementsPage: Awaited<ReturnType<typeof getAnnouncementsPageData>> | null = null;

  try {
    announcementsPage = await getAnnouncementsPageData();
  } catch (e) {
    console.error('Failed to fetch announcements page data', e);
  }

  const heroSection = announcementsPage?.sections.find(
    (section): section is AnnouncementsHeroSection => section.type === 'hero',
  );

  const announcementListSection = announcementsPage?.sections.find(
    (section): section is AnnouncementListSection => section.type === 'announcement_list',
  );

  const items = (announcementListSection?.data ?? []).map(item => ({
    id: item.id,
    image: item.image || '/img/announcementbackground.png',
    title: item.title || announcementsPage?.title || 'Announcements',
    excerpt: item.excerpt || '',
    author: item.author || 'YBB',
    date: item.date || '',
    href: item.href || undefined,
    category: (item.category as any) || undefined,
  }));

  const awardAnnouncements = items.filter(item => item.category === 'awards');

  const heroHeadline = heroSection?.content.headline || 'Latest News & Updates';
  const heroSubheadline =
    heroSection?.content.subheadline || 'Stay informed about our latest activities and opportunities.';

  return (
    <main className="relative">
      <HeroSection
        title={heroHeadline}
        subtitle={heroSubheadline}
        bgImage="/img/announcementbackground.png"
        align="left"
        textSize="sm"
      />

      {/* Section pengumuman - dipisah ke komponen biar clean */}
      <section id="announcements">
        <AnnouncementsGrid items={items} />
      </section>

      {/* Meet Our Awardees - news/announcements about winners using same layout */}
      {awardAnnouncements.length > 0 ? (
        <section id="awardees">
          <AnnouncementsGrid
            items={awardAnnouncements}
            title="Meet Our Awardees"
            subtitle="Announcements and stories about winners from Japan Youth Summit awards."
            showControls={false}
          />
        </section>
      ) : null}
    </main>
  );
}
