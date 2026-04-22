import HeroSection from '@/components/ui/HeroSection';
import BenefitsHighSchoolDetail from '@/components/programs/BenefitsHighSchoolDetail';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { headers } from 'next/headers';

export default async function HighSchoolBenefitsPage() {
  const host = (await headers()).get('host') || '';
  const heroMedia = await getLandingHeroMedia(host, 'programs-benefits-highschool', {
    fallbackImage: '/img/programsbackground.png',
  });

  return (
    <main className="relative">
      <HeroSection
        title="Benefits for High School Students"
        subtitle="Understand how the Japan Youth Summit aligns with national and international curricula while supporting your academic journey."
        bgImage={heroMedia.bgImage ?? '/img/programsbackground.png'}
        galleryImages={heroMedia.galleryImages}
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
