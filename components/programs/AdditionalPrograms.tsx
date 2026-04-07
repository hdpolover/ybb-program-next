 'use client';

import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { PROGRAMS_ADDITIONAL_COPY } from '@/data/programs/sections/additional-programs/programsAdditional';
import type { OtherProgramsSection } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/data/programs/shared/constants';
import { useMemo, useState } from 'react';

type AdditionalProgramsProps = {
  otherPrograms?: OtherProgramsSection['content'];
};

export default function AdditionalPrograms({ otherPrograms }: AdditionalProgramsProps) {
  const { headerTitle, subtitle, items } = PROGRAMS_ADDITIONAL_COPY;

  const apiItems = otherPrograms?.items ?? [];
  const hasApiItems = apiItems.length > 0;

  const sectionTitle = otherPrograms?.title || headerTitle;
  const cards = useMemo(
    () =>
      hasApiItems
        ? apiItems.map(item => ({
            title: item.brand_name || item.name,
            href: `/programs/${item.slug}`,
            cover: item.thumbnail || '/img/programsbackground.png',
            logo: item.brand_logo || '/img/jyslogosolo.png',
            dates: item.start_date ? new Date(item.start_date).getFullYear().toString() : DATA_NOT_ADDED,
          }))
        : items,
    [apiItems, hasApiItems, items],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const count = cards.length;

  const handlePrev = () => {
    if (count <= 1) return;
    setDirection('prev');
    setActiveIndex(prev => (prev - 1 + count) % count);
  };

  const handleNext = () => {
    if (count <= 1) return;
    setDirection('next');
    setActiveIndex(prev => (prev + 1) % count);
  };

  const activeIdx = activeIndex;
  const prevIdx = count > 1 ? (activeIdx - 1 + count) % count : -1;
  const nextIdx = count > 1 ? (activeIdx + 1) % count : -1;

  const renderCardInner = (it: (typeof cards)[number]) => (
    <>
      <div className={jysSectionTheme.programsAdditional.coverWrapper}>
        <Image
          src={it.cover}
          alt={`${it.title} Cover`}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className={jysSectionTheme.programsAdditional.coverImage}
        />
        <div className={jysSectionTheme.programsAdditional.logoBadgesWrapper}>
          <div className={jysSectionTheme.programsAdditional.logoCircle}>
            <Image
              src={it.logo}
              alt={`${it.title} Logo`}
              fill
              sizes="32px"
              className={jysSectionTheme.programsAdditional.logoImage}
            />
          </div>
        </div>
      </div>
      <div className={jysSectionTheme.programsAdditional.cardMetaRow}>
        <div>
          <h4 className={jysSectionTheme.programsAdditional.cardTitle}>{it.title}</h4>
          <p className={jysSectionTheme.programsAdditional.datesText}>{it.dates}</p>
        </div>
        <span className={jysSectionTheme.programsAdditional.arrowCircle}>
          <ArrowRight className={jysSectionTheme.programsAdditional.arrowIcon} />
        </span>
      </div>
    </>
  );

  const getCardPosClass = (idx: number) => {
    if (idx === activeIdx) return jysSectionTheme.programsAdditional.carouselCardActive;
    if (idx === prevIdx) return jysSectionTheme.programsAdditional.carouselCardPrev;
    if (idx === nextIdx) return jysSectionTheme.programsAdditional.carouselCardNext;
    return jysSectionTheme.programsAdditional.carouselCardHidden;
  };

  return (
    <section className={jysSectionTheme.programsAdditional.sectionWrapper}>
      <div className={jysSectionTheme.programsAdditional.container}>
        <SectionHeader title={sectionTitle} />
        <p className={jysSectionTheme.programsAdditional.subtitle}>{subtitle}</p>
        <div className={jysSectionTheme.programsAdditional.sliderWrapper}>
          <div
            className={jysSectionTheme.programsAdditional.carouselStage}
            data-direction={direction}
          >
            {cards.map((it, idx) => {
              const posClass = getCardPosClass(idx);
              const isActive = idx === activeIdx;

              const commonClass = `
                ${jysSectionTheme.programsAdditional.carouselCardBase}
                ${posClass}
              `;

              if (isActive) {
                return (
                  <a
                    key={it.title}
                    href={it.href || '#'}
                    className={commonClass}
                  >
                    {renderCardInner(it)}
                  </a>
                );
              }

              return (
                <div
                  key={it.title}
                  className={commonClass}
                  aria-hidden="true"
                >
                  {renderCardInner(it)}
                </div>
              );
            })}
          </div>

          <div className={jysSectionTheme.programsAdditional.navRow}>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous program"
              className={jysSectionTheme.programsAdditional.navButton}
              disabled={count <= 1}
            >
              <ChevronLeft className={jysSectionTheme.programsAdditional.navIcon} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next program"
              className={jysSectionTheme.programsAdditional.navButton}
              disabled={count <= 1}
            >
              <ChevronRight className={jysSectionTheme.programsAdditional.navIcon} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
