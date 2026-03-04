'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HeroSection from '@/components/ui/HeroSection';
import { announcementsData } from '@/data/announcements';

const SLIDE_INTERVAL_MS = 5000;

const HERO_SLIDES = [
  {
    id: 'slide-1',
    bgImage: '/img/announcementbackground.png',
    get title() {
      return announcementsData[0]?.title ?? 'Announcements';
    },
    get subtitle() {
      return (
        announcementsData[0]?.excerpt ??
        'Latest updates, deadlines, and official notices from YBB & JYS.'
      );
    },
  },
  {
    id: 'slide-2',
    bgImage: '/img/announcementbackground1.png',
    get title() {
      return announcementsData[1]?.title ?? 'Announcements';
    },
    get subtitle() {
      return (
        announcementsData[1]?.excerpt ??
        'Stay informed about important program updates and timelines.'
      );
    },
  },
  {
    id: 'slide-3',
    bgImage: '/img/announcementbackground2.png',
    get title() {
      return announcementsData[2]?.title ?? 'Announcements';
    },
    get subtitle() {
      return (
        announcementsData[2]?.excerpt ??
        'Discover the latest opportunities, scholarships, and program changes.'
      );
    },
  },
];

export default function AnnouncementsHero() {
  const [index, setIndex] = useState(0);

  // auto-rotate
  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const current = HERO_SLIDES[index];

  const goPrev = () => {
    setIndex(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goNext = () => {
    setIndex(prev => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative">
      <HeroSection
        title={current.title}
        subtitle={current.subtitle}
        bgImage={current.bgImage}
        align="left"
        textSize="sm"
      />

      {/* Controls */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 md:px-10">
        <button
          type="button"
          onClick={goPrev}
          className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-md shadow-primary/100/20 ring-1 ring-white/60 backdrop-blur transition hover:bg-primary/10 hover:text-primary"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary shadow-md shadow-primary/100/20 ring-1 ring-white/60 backdrop-blur transition hover:bg-primary/10 hover:text-primary"
          aria-label="Next announcement"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
        <div className="pointer-events-auto inline-flex gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 shadow-sm shadow-black/20 backdrop-blur">
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index
                  ? 'bg-white shadow-sm shadow-primary/100/40'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
