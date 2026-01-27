import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { PROGRAMS_ADDITIONAL_COPY } from '@/data/programs/sections/additional-programs/programsAdditional';

export default function AdditionalPrograms() {
  const { headerTitle, subtitle, items } = PROGRAMS_ADDITIONAL_COPY;
  return (
    <section className={jysSectionTheme.programsAdditional.sectionWrapper}>
      <div className={jysSectionTheme.programsAdditional.container}>
        <SectionHeader title={headerTitle} />
        <p className={jysSectionTheme.programsAdditional.subtitle}>{subtitle}</p>
        <div className={jysSectionTheme.programsAdditional.cardsWrapper}>
          {items.map(it => (
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
