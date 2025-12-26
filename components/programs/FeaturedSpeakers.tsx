'use client';

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

export type Speaker = {
  name: string;
  title: string;
  org: string;
  photo: string; // path under /public
  href?: string;
};

export default function FeaturedSpeakers({
  speakers,
  title = 'Featured Speakers',
  subtitle = 'Meet our distinguished speakers and industry experts',
}: {
  speakers: Speaker[];
  title?: string;
  subtitle?: string;
}) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (dir: 'prev' | 'next') => {
    const el = listRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9;
    el.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' });
  };

  const useSlider = speakers.length >= 5;

  return (
    <section className="relative bg-[#edf5ff] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader title={title} />
        <p className="-mt-6 mb-8 text-center text-sm text-pink-600">{subtitle}</p>

        {/* Slider controls (only when many items) */}
        {useSlider ? (
          <div className="relative">
            <div
              ref={listRef}
              className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {speakers.map(sp => (
                <SpeakerCard
                  key={sp.name}
                  speaker={sp}
                  className="w-[320px] shrink-0 snap-start sm:w-[360px]"
                />
              ))}
            </div>

            <div className="pointer-events-none absolute -top-12 right-0 flex gap-2 sm:-top-14">
              <button
                type="button"
                onClick={() => scrollBy('prev')}
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy('next')}
                className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {speakers.map(sp => (
              <SpeakerCard key={sp.name} speaker={sp} className="w-[320px] sm:w-[360px]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SpeakerCard({ speaker, className = '' }: { speaker: Speaker; className?: string }) {
  const { name, title, org, photo, href } = speaker;
  return (
    <a
      href={href || '#'}
      aria-label={`View speaker ${name}`}
      className={`group block overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-pink-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 ${className}`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={photo}
          alt={name}
          fill
          sizes="(min-width:1024px) 320px, 280px"
          className="rounded-t-2xl object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="bg-white p-5">
        <h3 className="text-lg font-extrabold text-blue-900">{name}</h3>
        <p className="mt-1 text-sm font-medium text-slate-700">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{org}</p>
      </div>
    </a>
  );
}
