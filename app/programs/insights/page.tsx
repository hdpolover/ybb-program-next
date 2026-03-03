import HeroSection from '@/components/ui/HeroSection';
import StatsSummarySection from '@/components/programs/insights/StatsSummary';
import ProgramThemeSection from '@/components/programs/insights/ProgramTheme';
import ParticipantsByCountrySection from '@/components/programs/insights/ParticipantsByCountry';
import { PROGRAMS_HERO_INSIGHTS } from '@/data/programs/sections/subpages-hero/programsSubpagesHero';

export default function ProgramInsightsPage() {
  return (
    <main className="relative">
      <HeroSection
        title={PROGRAMS_HERO_INSIGHTS.title}
        subtitle={PROGRAMS_HERO_INSIGHTS.subtitle}
        bgImage="/img/bgprogramoverview.png"
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
