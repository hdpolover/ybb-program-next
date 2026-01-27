import HeroSection from '@/components/ui/HeroSection';
import BenefitsHighSchoolDetail from '@/components/programs/BenefitsHighSchoolDetail';
import { PROGRAMS_HERO_BENEFITS_HIGHSCHOOL } from '@/data/programs/sections/subpages-hero/programsSubpagesHero';

export default function HighSchoolBenefitsPage() {
  return (
    <main className="relative">
      <HeroSection
        title={PROGRAMS_HERO_BENEFITS_HIGHSCHOOL.title}
        subtitle={PROGRAMS_HERO_BENEFITS_HIGHSCHOOL.subtitle}
        bgImage="/img/programsbackground.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs/benefits-highschool', label: 'Benefits for High School Students' },
        ]}
        align="center"
        decorVariant="compact"
        textSize="sm"
      />

      <BenefitsHighSchoolDetail />
    </main>
  );
}
