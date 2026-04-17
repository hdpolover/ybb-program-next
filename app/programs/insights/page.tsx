import HeroSection from '@/components/ui/HeroSection';
import StatsSummarySection from '@/components/programs/insights/StatsSummary';
import ProgramThemeSection from '@/components/programs/insights/ProgramTheme';
import ParticipantsByCountrySection from '@/components/programs/insights/ParticipantsByCountry';

export default function ProgramInsightsPage() {
  return (
    <main className="relative">
      <HeroSection
        title="Insight & Analytics"
        subtitle="Data-driven view of participation, engagement, and impact across our programs."
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
