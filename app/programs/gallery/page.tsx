import HeroSection from '@/components/ui/HeroSection';
import PhotoGallery from '@/components/sections/PhotoGallery';
import OtherProgramsGallery from '@/components/programs/OtherProgramsGallery';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { headers } from 'next/headers';

export default async function ProgramsPhotoGalleryPage() {
  const host = (await headers()).get('host') || '';
  const heroMedia = await getLandingHeroMedia(host, 'programs-gallery', {
    fallbackImage: '/img/bgprogramoverview.png',
  });

  return (
    <main className="relative">
      <HeroSection
        title="Photo Gallery"
        subtitle="Moments and highlights captured from our programs and community."
        bgImage={heroMedia.bgImage ?? '/img/bgprogramoverview.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Programs' },
          { href: '/programs/gallery', label: 'Photo Gallery' },
        ]}
      />

      {/* gallery utama */}
      <PhotoGallery />

      {/* daftar program lain */}
      <OtherProgramsGallery />
    </main>
  );
}
