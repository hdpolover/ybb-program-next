import HeroSection from '@/components/ui/HeroSection';
import BenefitsUniversityProfessionalDetail from '@/components/programs/BenefitsUniversityProfessionalDetail';

export default function UniversityProfessionalBenefitsPage() {
  return (
    <main className="relative">
      <HeroSection
        title="Benefits for University Students & Professionals"
        subtitle="Discover how the Japan Youth Summit supports your academic, professional, and leadership journey on a global scale."
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
