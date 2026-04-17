'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Image from 'next/image';
import { componentsTheme } from '@/lib/theme/components';

type GalleryImage = {
  id: string | number;
  src: string;
  caption: string;
};

type PhotoGalleryProps = {
  mode?: 'home' | 'page';
  title?: string;
  description?: string;
  images?: GalleryImage[];
  ctaLabel?: string;
  ctaUrl?: string;
};

export default function PhotoGallery({
  mode = 'page',
  title = 'Photo Gallery',
  description = 'Highlights from the Japan Youth Summit program',
  images,
  ctaLabel = 'See All Photos',
  ctaUrl = '/programs/gallery',
}: PhotoGalleryProps) {
  if (!images || images.length === 0) return null;

  const [selected, setSelected] = useState<number | null>(null);
  const [visible, setVisible] = useState<number>(12);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const photos: GalleryImage[] = images ?? [];

  return (
    <section className={componentsTheme.photoGallery.sectionWrapper}>
      <div className={componentsTheme.photoGallery.container}>
        <SectionHeader title={title} />
        <p className={componentsTheme.photoGallery.subtitle}>{description}</p>

        <div className={componentsTheme.photoGallery.grid}>
          {photos.slice(0, visible).map((p, idx) => (
            <div
              key={p.id ?? `${p.src}-${idx}`}
              className={componentsTheme.photoGallery.itemWrapper}
            >
              <button
                type="button"
                onClick={() => setSelected(idx)}
                className={componentsTheme.photoGallery.itemButton}
                aria-label="Open photo"
              >
                <span className={componentsTheme.photoGallery.itemImageWrapper}>
                  <Image
                    src={p.src}
                    alt={p.caption}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                    className={componentsTheme.photoGallery.itemImage}
                  />
                </span>
              </button>
            </div>
          ))}
        </div>

        {selected !== null && (
          <div
            className={componentsTheme.photoGallery.modalOverlay}
            role="dialog"
            aria-modal="true"
            onClick={() => setSelected(null)}
          >
            <div
              className={componentsTheme.photoGallery.modalCard}
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={componentsTheme.photoGallery.modalCloseButton}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className={componentsTheme.photoGallery.modalImageWrapper}>
                <Image
                  src={photos[selected].src}
                  alt={photos[selected].caption}
                  width={1920}
                  height={1080}
                  sizes="100vw"
                  className={componentsTheme.photoGallery.modalImage}
                />
              </div>
              <div className={componentsTheme.photoGallery.modalCaption}>
                {photos[selected].caption}
              </div>
            </div>
          </div>
        )}

        {mode === 'home' ? (
          <div className="mt-8 flex justify-center">
            <a href={ctaUrl} className={componentsTheme.photoGallery.homeCtaButton}>
              {ctaLabel}
            </a>
          </div>
        ) : (
          visible < photos.length && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible(v => Math.min(v + 8, photos.length))}
                className={componentsTheme.photoGallery.loadMoreButton}
              >
                Load More Photos
              </button>
            </div>
          )
        )}
      </div>
    </section>
  );
}
