import HeroSection from '@/components/ui/HeroSection';
import StatsSummarySection from '@/components/programs/insights/StatsSummary';
import ProgramThemeSection from '@/components/programs/insights/ProgramTheme';
import ParticipantsByCountrySection from '@/components/programs/insights/ParticipantsByCountry';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { headers } from 'next/headers';

export default async function ProgramInsightsPage() {
  const host = (await headers()).get('host') || '';
  const heroMedia = await getLandingHeroMedia(host, 'programs-insights', {
    fallbackImage: '/img/bgprogramoverview.png',
  });

  return (
    <main className="relative">
      <HeroSection
        title="Insight & Analytics"
        subtitle="Data-driven view of participation, engagement, and impact across our programs."
        bgImage={heroMedia.bgImage ?? '/img/bgprogramoverview.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Programs' },
          { href: '/programs/insights', label: 'Insight & Analytics' },
        ]}
      />
      <StatsSummarySection />
      <ProgramThemeSection />
      <ParticipantsByCountrySection />
    </main>
  );
}
