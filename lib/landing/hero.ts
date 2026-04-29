import { getHomePageData } from '@/lib/api/home';
import type { ProgramGallerySection } from '@/types/home';

export type LandingHeroMedia = {
  bgImage?: string;
  galleryImages?: string[];
};

function collectUniqueUrls(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();

  return values.reduce<string[]>((acc, value) => {
    const nextValue = value?.trim();
    if (!nextValue || seen.has(nextValue)) {
      return acc;
    }

    seen.add(nextValue);
    acc.push(nextValue);
    return acc;
  }, []);
}

function hashString(input: string): number {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length === 0) {
    return [];
  }

  const normalizedOffset = offset % items.length;
  return items.slice(normalizedOffset).concat(items.slice(0, normalizedOffset));
}

function tileImages(images: string[], count: number): string[] {
  if (images.length === 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => images[index % images.length]);
}

function extractHomeGalleryImages(homeData: Awaited<ReturnType<typeof getHomePageData>> | null): string[] {
  const gallerySection = homeData?.sections.find(
    (section): section is ProgramGallerySection => section.type === 'program_gallery',
  );

  const galleryItems = gallerySection?.content.gallery ?? gallerySection?.content.images ?? [];
  return collectUniqueUrls(galleryItems.map((image) => image.url));
}

export async function getLandingHeroMedia(
  host: string,
  pageKey: string,
  options?: {
    fallbackImage?: string | null;
    preferredImages?: Array<string | null | undefined>;
    gallerySize?: number;
    minimumGalleryImages?: number;
  },
): Promise<LandingHeroMedia> {
  const homeData = await getHomePageData(host).catch(() => null);
  const galleryImages = extractHomeGalleryImages(homeData);

  const imagePool = collectUniqueUrls([
    ...(options?.preferredImages ?? []),
    ...galleryImages,
    options?.fallbackImage,
  ]);

  if (imagePool.length === 0) {
    return {};
  }

  const dailySeed = new Date().toISOString().slice(0, 10);
  const orderedImages = rotateArray(
    imagePool,
    hashString(`${host}:${pageKey}:${dailySeed}`),
  );

  if (orderedImages.length >= (options?.minimumGalleryImages ?? 2)) {
    return {
      bgImage: orderedImages[0],
      galleryImages: tileImages(orderedImages, options?.gallerySize ?? 6),
    };
  }

  return {
    bgImage: orderedImages[0],
  };
}
