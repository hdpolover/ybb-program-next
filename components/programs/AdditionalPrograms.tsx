 'use client';

import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { OtherProgramsSection } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

type AdditionalProgramsProps = {
  otherPrograms?: OtherProgramsSection['content'];
};

export default function AdditionalPrograms({ otherPrograms }: AdditionalProgramsProps) {
  if (!otherPrograms) return null;

  const apiItems = otherPrograms.items ?? [];
  if (apiItems.length === 0) return null;

  const sectionTitle = otherPrograms.title || 'Our Additional Programs';

  const cards = apiItems.map(item => ({
    title: item.brand_name || item.name,
    href: `/programs/${item.slug}`,
    cover: item.thumbnail || '/img/programsbackground.png',
    logo: item.brand_logo || '/img/ybb-logo.png',
    dates: item.start_date ? new Date(item.start_date).getFullYear().toString() : DATA_NOT_ADDED,
  }));

  return (
    <section className={componentsTheme.programsAdditional.sectionWrapper}>
      <div className={componentsTheme.programsAdditional.container}>
        <SectionHeader title={sectionTitle} />
        <p className={componentsTheme.programsAdditional.subtitle}>Explore more programs you can join soon</p>
        <div className={componentsTheme.programsAdditional.cardsWrapper}>
          {cards.map(it => (
            <a
              key={it.title}
              href={it.href || '#'}
              className={componentsTheme.programsAdditional.card}
            >
              <div className={componentsTheme.programsAdditional.coverWrapper}>
                <Image
                  src={it.cover}
                  alt={`${it.title} Cover`}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className={componentsTheme.programsAdditional.coverImage}
                />
                <div className={componentsTheme.programsAdditional.logoBadgesWrapper}>
                  <div className={componentsTheme.programsAdditional.logoCircle}>
                    <Image
                      src={it.logo}
                      alt={`${it.title} Logo`}
                      fill
                      sizes="32px"
                      className={componentsTheme.programsAdditional.logoImage}
                    />
                  </div>
                </div>
              </div>
              <div className={componentsTheme.programsAdditional.cardMetaRow}>
                <div>
                  <h4 className={componentsTheme.programsAdditional.cardTitle}>{it.title}</h4>
                  <p className={componentsTheme.programsAdditional.datesText}>{it.dates}</p>
                </div>
                <span className={componentsTheme.programsAdditional.arrowCircle}>
                  <ArrowRight className={componentsTheme.programsAdditional.arrowIcon} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
