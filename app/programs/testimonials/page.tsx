import HeroSection from '@/components/ui/HeroSection';
import TestimonialsGrid from '@/components/programs/testimonials/TestimonialsGrid';
import TestimonialsImpact from '@/components/programs/testimonials/TestimonialsImpact';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { headers } from 'next/headers';

export default async function ProgramsTestimonialsPage() {
  const host = (await headers()).get('host') || '';
  const heroMedia = await getLandingHeroMedia(host, 'programs-testimonials', {
    fallbackImage: '/img/bgprogramoverview.png',
  });

  return (
    <main className="relative">
      <HeroSection
        title="Testimonials"
        subtitle="Stories and feedback from participants across cohorts."
        bgImage={heroMedia.bgImage ?? '/img/bgprogramoverview.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Programs' },
          { href: '/programs/testimonials', label: 'Testimonials' },
        ]}
      />

      {/* grid testimoni utama */}
      <TestimonialsGrid />

      {/* section impact testimoni lanjutan */}
      <TestimonialsImpact />
    </main>
  );
}
