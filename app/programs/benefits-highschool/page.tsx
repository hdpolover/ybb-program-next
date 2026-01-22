import HeroSection from '@/components/ui/HeroSection';
import BenefitsHighSchoolDetail from '@/components/programs/BenefitsHighSchoolDetail';

export default function HighSchoolBenefitsPage() {
  return (
    <main className="relative">
      <HeroSection
        title="Benefits for High School Students"
        subtitle="Understand how the Japan Youth Summit aligns with national and international curricula while supporting your academic journey."
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
