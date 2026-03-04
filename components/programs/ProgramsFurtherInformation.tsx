"use client";

import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
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
    <section
      className={componentsTheme.furtherInfoPrograms.sectionWrapper}
      style={{
        backgroundImage: "url('/img/halfback1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={componentsTheme.furtherInfoPrograms.card}>
        <div className={componentsTheme.furtherInfoPrograms.innerGrid}>
          <div className={componentsTheme.furtherInfoPrograms.leftCol}>
            <div>
              <SectionHeader eyebrow="Guidebook" title={title} align="left" />
              <p className={componentsTheme.furtherInfoPrograms.description}>{subtitle}</p>

              <div className={componentsTheme.furtherInfoPrograms.buttonsCol}>
                {guidebooks.map(link =>
                  link.href && link.href !== '#' ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`${componentsTheme.furtherInfoPrograms.guideButtonBase} ${
                        link.locale === 'eng'
                          ? componentsTheme.homeRegistration.guidePrimary
                          : componentsTheme.homeRegistration.guideSecondary
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
                      className={`${componentsTheme.furtherInfoPrograms.guideButtonBase} ${
                        link.locale === 'eng'
                          ? componentsTheme.homeRegistration.guidePrimary
                          : componentsTheme.homeRegistration.guideSecondary
                      } pointer-events-none flex cursor-not-allowed items-center justify-center opacity-60`}
                    >
                      {DATA_NOT_ADDED}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className={componentsTheme.furtherInfoPrograms.rightCol}>
            <div className={componentsTheme.furtherInfoPrograms.mockupWrapper}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
