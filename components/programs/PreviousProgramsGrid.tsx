'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { PreviousProgramsSection } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

type PreviousProgramsGridProps = {
  previous?: PreviousProgramsSection['content'];
};

export default function ProgramCarousel({ previous }: PreviousProgramsGridProps) {
  const [active, setActive] = useState(0);

  if (!previous) return null;

  const title = previous.title || 'Previous Programs';
  const items = previous.items ?? [];
  if (items.length === 0) return null;

  // Map API items to display shape
  const programs = items.map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    year: item.year,
    location: item.location,
    thumbnail: item.thumbnail,
  }));
  const total = programs.length;

  const next = () => setActive(i => (i + 1) % total);
  const prev = () => setActive(i => (i - 1 + total) % total);
  const archiveHref = '/programs/previous';

  const renderCard = (program: (typeof programs)[number]) => (
    <div className={componentsTheme.programsPrevious.card}>
      <div className={componentsTheme.programsPrevious.cardImageWrapper}>
        <Image
          src={program.thumbnail || '/img/programsbackground.png'}
          alt={program.name || 'Previous program'}
          fill
          sizes="(min-width:1024px) 360px, (min-width:640px) 60vw, 100vw"
          className={componentsTheme.programsPrevious.cardImage}
        />
      </div>

      <div className={componentsTheme.programsPrevious.cardBody}>
        <h3 className={componentsTheme.programsPrevious.cardTitle}>
          {program.name || DATA_NOT_ADDED}
        </h3>
        <p className={componentsTheme.programsPrevious.cardDate}>
          {program.year ? String(program.year) : DATA_NOT_ADDED}
        </p>
        <p className={componentsTheme.programsPrevious.cardDate}>
          {program.location?.trim() || 'Location to be announced'}
        </p>

        <Link
          href={`/programs/${program.slug}`}
          className={clsx(
            componentsTheme.homeRegistration.guidePrimary,
            'mt-5 flex w-full items-center justify-center text-sm',
          )}
        >
          Read More
        </Link>
      </div>
    </div>
  );

  return (
    <section className={componentsTheme.programsPrevious.sectionWrapper}>
      <div className={componentsTheme.programsPrevious.container}>
        <SectionHeader eyebrow="Previous Program" title={title} />
        <p className={componentsTheme.programsPrevious.subtitle}>
          A look back at our previous program editions
        </p>
        <div className="mb-8 flex justify-center">
          <Link
            href={archiveHref}
            className={componentsTheme.programsCurrent.secondaryCta}
          >
            View All Previous Programs
          </Link>
        </div>

        {total === 1 && (
          <div className="mt-8 flex justify-center">
            {renderCard(programs[0])}
          </div>
        )}

        {total > 1 && (
          <div className={componentsTheme.programsPrevious.stageWrapper}>
            <button
              onClick={prev}
              aria-label="Previous program"
              className={clsx(
                'absolute left-20 z-30 hidden sm:flex',
                componentsTheme.programsPrevious.arrowButton,
              )}
            >
              <ChevronLeft className={componentsTheme.programsPrevious.chevronIcon} />
            </button>
            <button
              onClick={next}
              aria-label="Next program"
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
                    {renderCard(item)}
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
