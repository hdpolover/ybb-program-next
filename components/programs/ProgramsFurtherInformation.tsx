"use client";

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { PROGRAMS_FURTHER_INFO_DEFAULT } from '@/data/programs/sections/further-info/programsFurtherInfo';
import { DATA_NOT_ADDED } from '@/data/programs/shared/constants';

interface GuidebookLink {
  href: string;
  label: string;
  locale: 'eng' | 'ind';
}

interface ProgramsFurtherInformationProps {
  title?: string;
  subtitle?: string;
  guidebooks?: GuidebookLink[];
}

export default function ProgramsFurtherInformationSection({
  title = PROGRAMS_FURTHER_INFO_DEFAULT.title,
  subtitle = PROGRAMS_FURTHER_INFO_DEFAULT.subtitle,
  guidebooks = PROGRAMS_FURTHER_INFO_DEFAULT.guidebooks,
}: ProgramsFurtherInformationProps) {
  return (
    <section className={jysSectionTheme.furtherInfoPrograms.sectionWrapper}>
      <div className={jysSectionTheme.furtherInfoPrograms.mobileBgWrapper}>
        <Image
          src="/img/bgshorts60.jpg"
          alt=""
          fill
          priority
          className={jysSectionTheme.furtherInfoPrograms.mobileBgImage}
        />
      </div>
      <div className={jysSectionTheme.furtherInfoPrograms.desktopBgWrapper}>
        <Image
          src="/img/halfback1.png"
          alt=""
          fill
          priority
          className={jysSectionTheme.furtherInfoPrograms.desktopBgImage}
        />
      </div>

      <div className={jysSectionTheme.furtherInfoPrograms.card}>
        <div className={jysSectionTheme.furtherInfoPrograms.innerGrid}>
          <div className={jysSectionTheme.furtherInfoPrograms.leftCol}>
            <div>
              <div className="sm:hidden">
                <SectionHeader eyebrow="Guidebook" title={title} align="center" />
              </div>
              <div className="hidden sm:block">
                <SectionHeader eyebrow="Guidebook" title={title} align="left" />
              </div>
              <p className={jysSectionTheme.furtherInfoPrograms.description}>{subtitle}</p>

              <div className={jysSectionTheme.furtherInfoPrograms.buttonsCol}>
                {guidebooks.map(link =>
                  link.href && link.href !== '#' ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`${jysSectionTheme.furtherInfoPrograms.guideButtonBase} ${
                        link.locale === 'eng'
                          ? jysSectionTheme.homeRegistration.guidePrimary
                          : jysSectionTheme.homeRegistration.guideSecondary
                      }`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span
                      key={`${link.label}-disabled`}
                      aria-disabled="true"
                      className={`${jysSectionTheme.furtherInfoPrograms.guideButtonBase} ${
                        link.locale === 'eng'
                          ? jysSectionTheme.homeRegistration.guidePrimary
                          : jysSectionTheme.homeRegistration.guideSecondary
                      } pointer-events-none flex cursor-not-allowed items-center justify-center opacity-60`}
                    >
                      {DATA_NOT_ADDED}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className={jysSectionTheme.furtherInfoPrograms.rightCol}>
            <div className={jysSectionTheme.furtherInfoPrograms.mockupWrapper}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
