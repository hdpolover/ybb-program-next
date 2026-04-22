import HeroSection from '@/components/ui/HeroSection';
import BenefitsUniversityProfessionalDetail from '@/components/programs/BenefitsUniversityProfessionalDetail';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { headers } from 'next/headers';

export default async function UniversityProfessionalBenefitsPage() {
  const host = (await headers()).get('host') || '';
  const heroMedia = await getLandingHeroMedia(host, 'programs-benefits-university-professional', {
    fallbackImage: '/img/programsbackground.png',
  });

  return (
    <main className="relative">
      <HeroSection
        title="Benefits for University Students & Professionals"
        subtitle="Discover how the Japan Youth Summit supports your academic, professional, and leadership journey on a global scale."
        bgImage={heroMedia.bgImage ?? '/img/programsbackground.png'}
        galleryImages={heroMedia.galleryImages}
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
