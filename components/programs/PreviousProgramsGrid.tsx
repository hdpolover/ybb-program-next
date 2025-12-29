'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

const programs = [
  {
    title: 'Japan Youth Summit 2023',
    date: 'August 08 – August 11, 2023',
    image: '/img/bannerjys.png',
  },
  {
    title: 'Japan Youth Summit 2024',
    date: 'August 12 – August 15, 2024',
    image: '/img/bannerjys.png',
  },
  {
    title: 'Japan Youth Summit 2025',
    date: 'August 10 – August 13, 2025',
    image: '/img/bannerjys.png',
  },
];

export default function ProgramCarousel() {
  const [active, setActive] = useState(0);
  const total = programs.length;

  const next = () => setActive(i => (i + 1) % total);
  const prev = () => setActive(i => (i - 1 + total) % total);

  return (
    <section className={jysSectionTheme.programsPrevious.sectionWrapper}>
      <div className={jysSectionTheme.programsPrevious.container}>
        {/* HEADER */}
        <SectionHeader eyebrow="Previous Program" title="Previous Japan Youth Summit Programs" />
        <p className={jysSectionTheme.programsPrevious.subtitle}>
          A look back at past Japan Youth Summit editions
        </p>

        {/* CAROUSEL STAGE + ARROWS */}
        <div className={jysSectionTheme.programsPrevious.stageWrapper}>
          <button
            onClick={prev}
            aria-label="Previous program"
            className={clsx(
              'absolute left-20 z-30 hidden sm:flex',
              jysSectionTheme.programsPrevious.arrowButton
            )}
          >
            <ChevronLeft className={jysSectionTheme.programsPrevious.chevronIcon} />
          </button>
          <button
            onClick={next}
            aria-label="Next program"
            className={clsx(
              'absolute right-20 z-30 hidden sm:flex',
              jysSectionTheme.programsPrevious.arrowButton
            )}
          >
            <ChevronRight className={jysSectionTheme.programsPrevious.chevronIcon} />
          </button>

          {/* CAROUSEL STAGE */}
          <div className={jysSectionTheme.programsPrevious.carouselInner}>
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
                  key={i}
                  className={clsx(jysSectionTheme.programsPrevious.slideBase, transform, opacity)}
                  style={{ zIndex: z }}
                >
                  {/* ===== CARD ===== */}
                  <div className={jysSectionTheme.programsPrevious.card}>
                    <div className={jysSectionTheme.programsPrevious.cardImageWrapper}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width:1024px) 360px, (min-width:640px) 60vw, 100vw"
                        className={jysSectionTheme.programsPrevious.cardImage}
                      />
                    </div>

                    <div className={jysSectionTheme.programsPrevious.cardBody}>
                      <h3 className={jysSectionTheme.programsPrevious.cardTitle}>{item.title}</h3>
                      <p className={jysSectionTheme.programsPrevious.cardDate}>{item.date}</p>

                      <button
                        type="button"
                        className={clsx(
                          jysSectionTheme.homeRegistration.guidePrimary,
                          'mt-5 flex w-full items-center justify-center text-sm'
                        )}
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                  {/* ===== END CARD ===== */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
