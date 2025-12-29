'use client';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Image from 'next/image';
import { jysSectionTheme } from '@/lib/theme/jys-components';
export default function PhotoGallery({ mode = 'page' }: { mode?: 'home' | 'page' }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [visible, setVisible] = useState<number>(12);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const photos: { src: string; caption: string }[] = [
    { src: '/img/programoverview.png', caption: 'Program overview session' },
    { src: '/img/programhighlight1.jpg', caption: 'Keynote highlight' },
    { src: '/img/osaka.jpg', caption: 'Cultural exposure activity' },
    { src: '/img/jysprogram1.jpg', caption: 'Delegates during forum' },
    { src: '/img/galeri1.png', caption: 'Interactive workshop' },
    { src: '/img/galeri2.png', caption: 'Panel discussion' },
    { src: '/img/galeri3.png', caption: 'Team collaboration' },
    { src: '/img/galeri4.png', caption: 'Awarding moment' },
    { src: '/img/galeri5.png', caption: 'Participant presentation' },
    { src: '/img/galeri6.png', caption: 'Networking session' },
    { src: '/img/galeri7.png', caption: 'Q&A with speakers' },
    { src: '/img/galeri8.png', caption: 'Closing ceremony' },
    // Tambahan contoh biar tombol "Load More" ada isinya
    { src: '/img/programoverview.png', caption: 'Program overview session' },
    { src: '/img/programhighlight1.jpg', caption: 'Keynote highlight' },
    { src: '/img/osaka.jpg', caption: 'Cultural exposure activity' },
    { src: '/img/jysprogram1.jpg', caption: 'Delegates during forum' },
  ];

  return (
    <section className={jysSectionTheme.photoGallery.sectionWrapper}>
      <div className={jysSectionTheme.photoGallery.container}>
        <SectionHeader title="Photo Gallery" />
        <p className={jysSectionTheme.photoGallery.subtitle}>
          Highlights from the Japan Youth Summit program
        </p>

        <div className={jysSectionTheme.photoGallery.grid}>
          {photos.slice(0, visible).map((p, idx) => (
            <div key={`${p.src}-${idx}`} className={jysSectionTheme.photoGallery.itemWrapper}>
              <button
                type="button"
                onClick={() => setSelected(idx)}
                className={jysSectionTheme.photoGallery.itemButton}
                aria-label="Open photo"
              >
                <span className={jysSectionTheme.photoGallery.itemImageWrapper}>
                  <Image
                    src={p.src}
                    alt={p.caption}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                    className={jysSectionTheme.photoGallery.itemImage}
                  />
                </span>
              </button>
            </div>
          ))}
        </div>

        {selected !== null && (
          <div
            className={jysSectionTheme.photoGallery.modalOverlay}
            role="dialog"
            aria-modal="true"
            onClick={() => setSelected(null)}
          >
            <div
              className={jysSectionTheme.photoGallery.modalCard}
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={jysSectionTheme.photoGallery.modalCloseButton}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className={jysSectionTheme.photoGallery.modalImageWrapper}>
                <Image
                  src={photos[selected].src}
                  alt={photos[selected].caption}
                  width={1920}
                  height={1080}
                  sizes="100vw"
                  className={jysSectionTheme.photoGallery.modalImage}
                />
              </div>
              <div className={jysSectionTheme.photoGallery.modalCaption}>
                {photos[selected].caption}
              </div>
            </div>
          </div>
        )}

        {mode === 'home' ? (
          <div className="mt-8 flex justify-center">
            <a href="/programs/gallery" className={jysSectionTheme.photoGallery.homeCtaButton}>
              See All Photos
            </a>
          </div>
        ) : (
          visible < photos.length && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible(v => Math.min(v + 8, photos.length))}
                className={jysSectionTheme.photoGallery.loadMoreButton}
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
