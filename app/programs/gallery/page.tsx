import HeroSection from '@/components/ui/HeroSection';
import PhotoGallery from '@/components/sections/PhotoGallery';
import OtherProgramsGallery from '@/components/programs/OtherProgramsGallery';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { getHomePageData } from '@/lib/api/home';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import type { ProgramGallerySection } from '@/types/home';
import { headers } from 'next/headers';

function toHost(value: string): string {
  const raw = value.trim();
  if (!raw) return '';
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    return new URL(normalized).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return normalized
      .replace(/^https?:\/\//i, '')
      .split('/')[0]
      .split(':')[0]
      .replace(/^www\./, '')
      .toLowerCase();
  }
}

function extractProgramGallery(homeData: Awaited<ReturnType<typeof getHomePageData>>): ProgramGallerySection | null {
  return (
    homeData.sections.find(
      (section): section is ProgramGallerySection => section.type === 'program_gallery',
    ) || null
  );
}

export default async function ProgramsPhotoGalleryPage() {
  const host = (await headers()).get('host') || '';
  const heroMedia = await getLandingHeroMedia(host, 'programs-gallery', {
    fallbackImage: '/img/bgprogramoverview.png',
  });
  const [homeData, settings] = await Promise.all([
    getHomePageData(host).catch(() => null),
    getSettingsForBrandDomain(host).catch(() => null),
  ]);
  const currentGallery = homeData ? extractProgramGallery(homeData) : null;

  const currentProgramImages = (currentGallery?.content.gallery ?? currentGallery?.content.images ?? []).map((image) => ({
    id: image.id,
    src: image.url,
    caption: image.caption,
  }));

  const currentHost = toHost(host);
  const currentBrandName = settings?.brand?.name?.trim().toLowerCase() || '';
  const availableBrands = settings?.available_brands || [];
  const otherBrands = availableBrands.filter((brand) => {
    const brandHost = toHost(brand.landing_url || brand.website_url || '');
    const brandName = brand.name.trim().toLowerCase();
    return brandHost && brandHost !== currentHost && brandName !== currentBrandName;
  });

  const otherPrograms = (
    await Promise.all(
      otherBrands.map(async (brand) => {
        const brandHost = toHost(brand.landing_url || brand.website_url || '');
        if (!brandHost) return null;

        const otherHome = await getHomePageData(brandHost).catch(() => null);
        if (!otherHome) return null;

        const gallery = extractProgramGallery(otherHome);
        const photos = (gallery?.content.gallery ?? gallery?.content.images ?? [])
          .map((image) => image.url)
          .filter(Boolean)
          .slice(0, 4);

        if (photos.length === 0) return null;

        const hrefRaw = (brand.landing_url || brand.website_url || '').trim();
        const href = hrefRaw ? (/^https?:\/\//i.test(hrefRaw) ? hrefRaw : `https://${hrefRaw}`) : '#';

        return {
          title: gallery?.content.title || brand.name,
          photos,
          href,
        };
      }),
    )
  ).filter((item): item is NonNullable<typeof item> => Boolean(item));

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

      <PhotoGallery
        title={currentGallery?.content.title || 'Photo Gallery'}
        description={currentGallery?.content.description || 'Moments and highlights captured from our programs and community.'}
        images={currentProgramImages}
      />

      <OtherProgramsGallery programs={otherPrograms} />
    </main>
  );
}
