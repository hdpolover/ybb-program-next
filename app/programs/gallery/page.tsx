import HeroSection from '@/components/ui/HeroSection';
import PhotoGallery from '@/components/sections/PhotoGallery';
import OtherProgramsGallery from '@/components/programs/OtherProgramsGallery';

export default function ProgramsPhotoGalleryPage() {
  return (
    <main className="relative">
      <HeroSection
        title="Photo Gallery"
        subtitle="Moments and highlights captured from our programs and community."
        bgImage="/img/bgprogramoverview.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Programs' },
          { href: '/programs/gallery', label: 'Photo Gallery' },
        ]}
      />

      {/* Gallery */}
      <PhotoGallery />

      {/* Other Programs */}
      <OtherProgramsGallery />
    </main>
  );
}
