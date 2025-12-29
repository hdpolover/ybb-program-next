import AnnouncementsHero from '@/components/announcements/AnnouncementsHero';
import AnnouncementsGrid from '@/components/announcements/AnnouncementsGrid';
import { announcementsData } from '@/data/announcements';

export default function AnnouncementsPage() {
  const awardAnnouncements = announcementsData.filter(item => item.category === 'awards');
  return (
    <main className="relative">
      {/* Hero slider — highlight beberapa berita terbaru */}
      <AnnouncementsHero />

      {/* Section pengumuman — dipisah ke komponen biar clean */}
      <section id="announcements">
        <AnnouncementsGrid items={announcementsData} />
      </section>

      {/* Meet Our Awardees — news/announcements about winners using same layout */}
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
