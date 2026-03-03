import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { PROGRAMS_ADDITIONAL_COPY } from '@/data/programs/sections/additional-programs/programsAdditional';
import type { OtherProgramsSection } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/data/programs/shared/constants';

type AdditionalProgramsProps = {
  otherPrograms?: OtherProgramsSection['content'];
};

export default function AdditionalPrograms({ otherPrograms }: AdditionalProgramsProps) {
  const { headerTitle, subtitle, items } = PROGRAMS_ADDITIONAL_COPY;

  const apiItems = otherPrograms?.items ?? [];
  const hasApiItems = apiItems.length > 0;

  const sectionTitle = otherPrograms?.title || headerTitle;
  const cards = hasApiItems
    ? apiItems.map(item => ({
        title: item.brand_name || item.name,
        href: `/programs/${item.slug}`,
        cover: item.thumbnail || '/img/programsbackground.png',
        logo: item.brand_logo || '/img/jyslogosolo.png',
        dates: item.start_date ? new Date(item.start_date).getFullYear().toString() : DATA_NOT_ADDED,
      }))
    : items;
  return (
    <section className={jysSectionTheme.programsAdditional.sectionWrapper}>
      <div className={jysSectionTheme.programsAdditional.container}>
        <SectionHeader title={sectionTitle} />
        <p className={jysSectionTheme.programsAdditional.subtitle}>{subtitle}</p>
        <div className={jysSectionTheme.programsAdditional.cardsWrapper}>
          {cards.map(it => (
            <a
              key={it.title}
              href={it.href || '#'}
              className={jysSectionTheme.programsAdditional.card}
            >
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
