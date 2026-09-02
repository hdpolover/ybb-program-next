'use client';
import { useState, useEffect, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Image from 'next/image';
import { componentsTheme } from '@/lib/theme/components';

type GalleryImage = {
  id: string | number;
  src: string;
  caption?: string;
};

function galleryImageAlt(caption: string | undefined, index: number): string {
  const trimmed = caption?.trim();
  return trimmed || `Gallery photo ${index + 1}`;
}

// One program edition (KYS 2025, KYS 2026, ...) the visitor can switch to.
export type GalleryEdition = {
  id: string;
  label: string;
  isActive: boolean;
  images: GalleryImage[];
};

type PhotoGalleryProps = {
  mode?: 'home' | 'page';
  title?: string;
  description?: string;
  images?: GalleryImage[];
  editions?: GalleryEdition[];
  ctaLabel?: string;
  ctaUrl?: string;
};

export default function PhotoGallery({
  mode = 'page',
  title = 'Photo Gallery',
  description = 'Highlights from the Japan Youth Summit program',
  images,
  editions,
  ctaLabel = 'See All Photos',
  ctaUrl = '/programs/gallery',
}: PhotoGalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);
  // 12 = exactly 3 full rows on the 4-column desktop grid. The homepage teaser
  // is already capped at 12 server-side; /programs/gallery pages through the
  // rest via Load More.
  const initialVisible = 12;
  const [visible, setVisible] = useState<number>(initialVisible);
  const [editionId, setEditionId] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // An edition with no images gets no tab — an empty tab is worse than no tab —
  // and a brand with a single edition keeps the original untabbed grid.
  const editionTabs = (editions ?? []).filter(edition => edition.images.length > 0);
  const hasTabs = editionTabs.length > 1;
  // Default to the currently active edition, which is what the untabbed gallery
  // used to show; fall back to the first (newest) edition when the active one
  // has no images of its own.
  const activeEdition =
    editionTabs.find(edition => edition.id === editionId) ??
    editionTabs.find(edition => edition.isActive) ??
    editionTabs[0];

  // No editions at all means a payload cached before `tabs` shipped: fall back
  // to the flat list so the section keeps rendering.
  const photos: GalleryImage[] = activeEdition ? activeEdition.images : images ?? [];

  function selectEdition(id: string) {
    setEditionId(id);
    setSelected(null);
    setVisible(initialVisible);
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const nextIndex =
      e.key === 'ArrowRight'
        ? (index + 1) % editionTabs.length
        : (index - 1 + editionTabs.length) % editionTabs.length;
    const next = editionTabs[nextIndex];
    selectEdition(next.id);
    document.getElementById(`photo-gallery-tab-${next.id}`)?.focus();
  }

  if (photos.length === 0) return null;

  return (
    <section className={componentsTheme.photoGallery.sectionWrapper}>
      <div className={componentsTheme.photoGallery.container}>
        <SectionHeader title={title} />
        <p className={componentsTheme.photoGallery.subtitle}>{description}</p>

        {hasTabs && (
          <div
            className={componentsTheme.photoGallery.tabList}
            role="tablist"
            aria-label="Program edition"
          >
            {editionTabs.map((edition, index) => (
              <button
                key={edition.id}
                id={`photo-gallery-tab-${edition.id}`}
                type="button"
                role="tab"
                aria-selected={activeEdition?.id === edition.id}
                aria-controls="photo-gallery-panel"
                tabIndex={activeEdition?.id === edition.id ? 0 : -1}
                onClick={() => selectEdition(edition.id)}
                onKeyDown={e => onTabKeyDown(e, index)}
                className={`${componentsTheme.photoGallery.tabBase} ${
                  activeEdition?.id === edition.id
                    ? componentsTheme.photoGallery.tabActive
                    : componentsTheme.photoGallery.tabInactive
                }`}
              >
                {edition.label}
              </button>
            ))}
          </div>
        )}

        <div
          className={componentsTheme.photoGallery.grid}
          id="photo-gallery-panel"
          role={hasTabs ? 'tabpanel' : undefined}
          aria-labelledby={hasTabs && activeEdition ? `photo-gallery-tab-${activeEdition.id}` : undefined}
        >
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
                    alt={galleryImageAlt(p.caption, idx)}
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
                  alt={galleryImageAlt(photos[selected].caption, selected)}
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
