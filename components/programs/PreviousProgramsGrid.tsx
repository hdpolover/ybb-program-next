'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { PreviousProgramsSection } from '@/types/programs';
import { PROGRAMS_PREVIOUS_COPY } from '@/data/programs/sections/previous/programsPrevious';

type PreviousProgramsGridProps = {
  previous?: PreviousProgramsSection['content'];
};

export default function ProgramCarousel({ previous }: PreviousProgramsGridProps) {
  const title = previous?.title || PROGRAMS_PREVIOUS_COPY.title;
  const items = previous?.items ?? [];

  // Map API items to display shape
  const programs = items.map(item => ({
    id: item.id,
    name: item.name,
    year: item.year,
    location: item.location,
    thumbnail: item.thumbnail,
  }));

  const [active, setActive] = useState(0);
  const total = programs.length;

  const next = () => setActive(i => (i + 1) % total);
  const prev = () => setActive(i => (i - 1 + total) % total);

  return (
    <section className={componentsTheme.programsPrevious.sectionWrapper}>
      <div className={componentsTheme.programsPrevious.container}>
        {/* header section untuk previous programs */}
        <SectionHeader eyebrow={PROGRAMS_PREVIOUS_COPY.eyebrow} title={title} />
        <p className={componentsTheme.programsPrevious.subtitle}>
          {PROGRAMS_PREVIOUS_COPY.subtitle}
        </p>

        {total === 0 && (
          <p className={componentsTheme.programsPrevious.subtitle}>
            {PROGRAMS_PREVIOUS_COPY.dataNotAdded}
          </p>
        )}

        {total === 1 && (
          <div className="mt-8 flex justify-center">
            <div className={componentsTheme.programsPrevious.card}>
              <div className={componentsTheme.programsPrevious.cardImageWrapper}>
                {programs[0].thumbnail ? (
                  <Image
                    src={programs[0].thumbnail}
                    alt={programs[0].name || 'Previous program'}
                    fill
                    sizes="(min-width:1024px) 360px, (min-width:640px) 60vw, 100vw"
                    className={componentsTheme.programsPrevious.cardImage}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                    {PROGRAMS_PREVIOUS_COPY.imageNotAdded}
                  </div>
                )}
              </div>

              <div className={componentsTheme.programsPrevious.cardBody}>
                <h3 className={componentsTheme.programsPrevious.cardTitle}>
                  {programs[0].name || PROGRAMS_PREVIOUS_COPY.dataNotAdded}
                </h3>
                <p className={componentsTheme.programsPrevious.cardDate}>
                  {programs[0].year ? String(programs[0].year) : PROGRAMS_PREVIOUS_COPY.dataNotAdded}
                </p>
                <p className={componentsTheme.programsPrevious.cardDate}>
                  {programs[0].location || PROGRAMS_PREVIOUS_COPY.dataNotAdded}
                </p>

                <button
                  type="button"
                  className={clsx(
                    componentsTheme.homeRegistration.guidePrimary,
                    'mt-5 flex w-full items-center justify-center text-sm',
                  )}
                >
                  {PROGRAMS_PREVIOUS_COPY.readMore}
                </button>
              </div>
            </div>
          </div>
        )}

        {total > 1 && (
          <div className={componentsTheme.programsPrevious.stageWrapper}>
            <button
              onClick={prev}
              aria-label={PROGRAMS_PREVIOUS_COPY.ariaPrev}
              className={clsx(
                'absolute left-20 z-30 hidden sm:flex',
                componentsTheme.programsPrevious.arrowButton,
              )}
            >
              <ChevronLeft className={componentsTheme.programsPrevious.chevronIcon} />
            </button>
            <button
              onClick={next}
              aria-label={PROGRAMS_PREVIOUS_COPY.ariaNext}
              className={clsx(
                'absolute right-20 z-30 hidden sm:flex',
                componentsTheme.programsPrevious.arrowButton,
              )}
            >
              <ChevronRight className={componentsTheme.programsPrevious.chevronIcon} />
            </button>

            {/* CAROUSEL STAGE */}
            <div className={componentsTheme.programsPrevious.carouselInner}>
              {programs.map((item, i) => {
                const diff = (i - active + total) % total;

                let transform = '';
                let z = 0;
                let opacity = '';

                if (diff === 0) {
                  transform = 'translate-x-0 scale-100';
                  z = 30;
                  opacity = 'opacity-100';
                } else if (diff === 1 || diff === total - 1) {
                  transform =
                    diff === 1 ? 'translate-x-[55%] scale-95' : '-translate-x-[55%] scale-95';
                  z = 20;
                  opacity = 'opacity-60';
                } else {
                  transform =
                    diff > 1 ? 'translate-x-[120%] scale-90' : '-translate-x-[120%] scale-90';
                  z = 10;
                  opacity = 'opacity-0';
                }

                return (
                  <div
                    key={item.id}
                    className={clsx(componentsTheme.programsPrevious.slideBase, transform, opacity)}
                    style={{ zIndex: z }}
                  >
                    {/* ===== CARD ===== */}
                    <div className={componentsTheme.programsPrevious.card}>
                      <div className={componentsTheme.programsPrevious.cardImageWrapper}>
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.name || 'Previous program'}
                            fill
                            sizes="(min-width:1024px) 360px, (min-width:640px) 60vw, 100vw"
                            className={componentsTheme.programsPrevious.cardImage}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                            {PROGRAMS_PREVIOUS_COPY.imageNotAdded}
                          </div>
                        )}
                      </div>

                      <div className={componentsTheme.programsPrevious.cardBody}>
                        <h3 className={componentsTheme.programsPrevious.cardTitle}>
                          {item.name || PROGRAMS_PREVIOUS_COPY.dataNotAdded}
                        </h3>
                        <p className={componentsTheme.programsPrevious.cardDate}>
                          {item.year ? String(item.year) : PROGRAMS_PREVIOUS_COPY.dataNotAdded}
                        </p>
                        <p className={componentsTheme.programsPrevious.cardDate}>
                          {item.location || PROGRAMS_PREVIOUS_COPY.dataNotAdded}
                        </p>

                        <button
                          type="button"
                          className={clsx(
                            componentsTheme.homeRegistration.guidePrimary,
                            'mt-5 flex w-full items-center justify-center text-sm',
                          )}
                        >
                          {PROGRAMS_PREVIOUS_COPY.readMore}
                        </button>
                      </div>
                    </div>
                    {/* ===== END CARD ===== */}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
