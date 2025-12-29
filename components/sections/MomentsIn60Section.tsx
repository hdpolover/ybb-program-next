'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

const shorts = [
  {
    id: 'short-1',
    embedUrl: 'https://www.youtube.com/embed/TnCyfXh_p2M?rel=0&mute=1',
  },
  {
    id: 'short-2',
    embedUrl: 'https://www.youtube.com/embed/Jwgd05MZ4iI?rel=0&mute=1',
  },
  {
    id: 'short-3',
    embedUrl: 'https://www.youtube.com/embed/vsNbESxF1wM?rel=0&mute=1',
  },
  {
    id: 'short-4',
    embedUrl: 'https://www.youtube.com/embed/PKJyaMElURY?rel=0&mute=1',
  },
  {
    id: 'short-5',
    embedUrl: 'https://www.youtube.com/embed/2h8vSDcr5PI?rel=0&mute=1',
  },
  {
    id: 'short-6',
    embedUrl: 'https://www.youtube.com/embed/2OViDwjKre0?rel=0&mute=1',
  },
  {
    id: 'short-7',
    embedUrl: 'https://www.youtube.com/embed/HX5Wesz0jgk?rel=0&mute=1',
  },
  {
    id: 'short-8',
    embedUrl: 'https://www.youtube.com/embed/DxDSMQLvyS0?rel=0&mute=1',
  },
];

export default function MomentsIn60Section() {
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
    <section className={jysSectionTheme.momentsShorts.sectionWrapper}>
      <div
        className={jysSectionTheme.momentsShorts.card}
        style={{
          backgroundImage: `url(${jysSectionTheme.momentsShorts.cardBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)] items-center gap-8">
          <div>
            <SectionHeader
              eyebrow="Short Highlights"
              title="Discover Our Moments in 60 Seconds"
              align="left"
            />
            <p className={jysSectionTheme.momentsShorts.description}>
              Watch bite-sized YouTube Shorts from Japan Youth Summit’s workshops, cultural
              sessions, and everyday moments in Osaka.
            </p>
          </div>

          <div className="relative">
            <div className={jysSectionTheme.momentsShorts.shortsRow}>
              {visibleShorts.map(short => (
                <div key={short.id} className={jysSectionTheme.momentsShorts.shortWrapper}>
                  <iframe
                    src={short.embedUrl}
                    title="Japan Youth Summit short highlight"
                    className={jysSectionTheme.momentsShorts.shortIframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/10 px-2 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur hover:bg-black/25"
              aria-label="Previous shorts"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-black/10 px-2 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur hover:bg-black/25"
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
