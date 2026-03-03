import HeroSection from '@/components/ui/HeroSection';
import PhotoGallery from '@/components/sections/PhotoGallery';
import OtherProgramsGallery from '@/components/programs/OtherProgramsGallery';
import { PROGRAMS_HERO_GALLERY } from '@/data/programs/sections/subpages-hero/programsSubpagesHero';

export default function ProgramsPhotoGalleryPage() {
  return (
    <main className="relative">
      <HeroSection
        title={PROGRAMS_HERO_GALLERY.title}
        subtitle={PROGRAMS_HERO_GALLERY.subtitle}
        bgImage="/img/bgprogramoverview.png"
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
