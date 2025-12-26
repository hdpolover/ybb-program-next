import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function AdditionalPrograms() {
  const items: { title: string; dates: string; cover: string; logo: string; href?: string }[] = [
    {
      title: 'World Youth Fest 2025',
      dates: 'October 06 – October 09, 2025',
      cover: '/img/WYScover.png',
      logo: '/img/WYSlogo.png',
    },
    {
      title: 'Middle East Youth Summit 2025',
      dates: 'December 01 – December 04, 2025',
      cover: '/img/MEYScover.png',
      logo: '/img/MEYSlogo.png',
    },
    {
      title: 'Youth Academic Forum 2025',
      dates: 'December 08 – December 11, 2025',
      cover: '/img/YAFcover.png',
      logo: '/img/YAFlogo.png',
    },
    {
      title: 'Korea Youth Summit 2026',
      dates: 'February 02 – February 05, 2026',
      cover: '/img/KYScover.png',
      logo: '/img/KYSlogo.png',
    },
    {
      title: 'Istanbul Youth Summit 2026',
      dates: 'February 09 – February 12, 2026',
      cover: '/img/IYScover.jpg',
      logo: '/img/IYSlogo.png',
    },
  ];
  return (
    <section className={jysSectionTheme.programsAdditional.sectionWrapper}>
      <div className={jysSectionTheme.programsAdditional.container}>
        <SectionHeader title="Our Additional Programs" />
        <p className={jysSectionTheme.programsAdditional.subtitle}>
          Explore more programs you can join soon
        </p>
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
