'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramShortsSection } from '@/types/home';

const DEFAULT_SHORTS = [
  { id: 'short-1', embed_url: 'https://www.youtube.com/embed/TnCyfXh_p2M?rel=0&mute=1' },
  { id: 'short-2', embed_url: 'https://www.youtube.com/embed/Jwgd05MZ4iI?rel=0&mute=1' },
  { id: 'short-3', embed_url: 'https://www.youtube.com/embed/vsNbESxF1wM?rel=0&mute=1' },
  { id: 'short-4', embed_url: 'https://www.youtube.com/embed/PKJyaMElURY?rel=0&mute=1' },
  { id: 'short-5', embed_url: 'https://www.youtube.com/embed/2h8vSDcr5PI?rel=0&mute=1' },
  { id: 'short-6', embed_url: 'https://www.youtube.com/embed/2OViDwjKre0?rel=0&mute=1' },
  { id: 'short-7', embed_url: 'https://www.youtube.com/embed/HX5Wesz0jgk?rel=0&mute=1' },
  { id: 'short-8', embed_url: 'https://www.youtube.com/embed/DxDSMQLvyS0?rel=0&mute=1' },
];

interface Props {
  section?: ProgramShortsSection;
}

export default function MomentsIn60Section({ section }: Props) {
  const shorts = (section?.content.items ?? DEFAULT_SHORTS).filter(s => s.embed_url);
  const eyebrow = section?.content.eyebrow ?? 'Short Highlights';
  const title = section?.content.title ?? 'Discover Our Moments in 60 Seconds';
  const description = section?.content.description ?? "Japan Youth Summit's workshops, cultural night, and sessions — all captured in 60-second highlights straight from Osaka."

  const [startIndex, setStartIndex] = useState(0);

  const visibleShorts = shorts
    .slice(startIndex, startIndex + 3)
    .concat(
      startIndex + 3 > shorts.length ? shorts.slice(0, (startIndex + 3) % shorts.length) : []
    );

  const handleNext = () => {
    setStartIndex(prev => (prev + 1) % shorts.length);
  };

  const handlePrev = () => {
    setStartIndex(prev => (prev - 1 + shorts.length) % shorts.length);
  };

  return (
    <section className={componentsTheme.momentsShorts.sectionWrapper}>
      <div
        className={componentsTheme.momentsShorts.card}
        style={{
          backgroundImage: `url(${componentsTheme.momentsShorts.cardBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          <div>
            <SectionHeader
              eyebrow={eyebrow}
              title={title}
              align="left"
            />
            <p className={componentsTheme.momentsShorts.description}>
              {description}
            </p>
          </div>

          <div className="relative sm:px-10">
            <div className={componentsTheme.momentsShorts.shortsRow}>
              {visibleShorts.map(short => (
                <div key={short.id} className={componentsTheme.momentsShorts.shortWrapper}>
                  <iframe
                    src={short.embed_url!}
                    title="Program short highlight"
                    className={componentsTheme.momentsShorts.shortIframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 sm:hidden">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center justify-center rounded-full bg-black/10 px-4 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur hover:bg-black/25"
                aria-label="Previous shorts"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center rounded-full bg-black/10 px-4 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur hover:bg-black/25"
                aria-label="Next shorts"
              >
                Next
              </button>
            </div>

            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/10 px-2 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur hover:bg-black/25 sm:inline-flex"
              aria-label="Previous shorts"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/10 px-2 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur hover:bg-black/25 sm:inline-flex"
              aria-label="Next shorts"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
