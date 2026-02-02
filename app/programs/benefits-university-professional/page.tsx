import HeroSection from '@/components/ui/HeroSection';
import BenefitsUniversityProfessionalDetail from '@/components/programs/BenefitsUniversityProfessionalDetail';
import { PROGRAMS_HERO_BENEFITS_UNIPRO } from '@/data/programs/sections/subpages-hero/programsSubpagesHero';

export default function UniversityProfessionalBenefitsPage() {
  return (
    <main className="relative">
      <HeroSection
        title={PROGRAMS_HERO_BENEFITS_UNIPRO.title}
        subtitle={PROGRAMS_HERO_BENEFITS_UNIPRO.subtitle}
        bgImage="/img/programsbackground.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          {
            href: '/programs/benefits-university-professional',
            label: 'Benefits for University Students & Professionals',
          },
        ]}
        align="center"
        decorVariant="compact"
        textSize="sm"
      />

      <BenefitsUniversityProfessionalDetail />
    </main>
  );
}
