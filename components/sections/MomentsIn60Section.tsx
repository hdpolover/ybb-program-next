'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramShortsSection } from '@/types/home';

interface Props {
  section?: ProgramShortsSection;
}

export default function MomentsIn60Section({ section }: Props) {
  if (!section || !section.content.items || section.content.items.length === 0) return null;

  const shorts = section.content.items.filter(s => s.embed_url);
  if (shorts.length === 0) return null;

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
