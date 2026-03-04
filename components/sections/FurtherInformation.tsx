'use client';

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { DATA_NOT_ADDED } from '@/data/home/shared/constants';

interface GuidebookLink {
  href: string;
  label: string;
  locale: 'eng' | 'ind';
}

interface FurtherInformationProps {
  title?: string;
  subtitle?: string;
  guidebooks?: GuidebookLink[];
}

const DEFAULT_GUIDEBOOKS: GuidebookLink[] = [
  {
    href: '#',
    label: 'Read Guidebook (Eng)',
    locale: 'eng',
  },
  {
    href: '#',
    label: 'Read Guidebook (Ind)',
    locale: 'ind',
  },
];

export default function FurtherInformationSection({
  title = 'Further Information',
  subtitle = 'The complete information regarding this program can be seen in the guidebook below.',
  guidebooks = DEFAULT_GUIDEBOOKS,
}: FurtherInformationProps) {
  return (
    <section
      className={`${componentsTheme.furtherInfo.sectionWrapper} min-h-[760px] py-14 sm:min-h-0 sm:py-28`}
    >
      <div className="absolute inset-0 bg-primary/20 sm:hidden" />
      <div className="absolute inset-x-0 bottom-0 h-[72%] sm:hidden">
        <Image
          src="/img/backgroundformobile.png"
          alt=""
          fill
          priority
          className="object-contain object-bottom"
        />
      </div>
      <div className="absolute inset-0 hidden sm:block">
        <Image
          src="/img/halfback.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className={`${componentsTheme.furtherInfo.card} relative z-10`}>
        <div className={componentsTheme.furtherInfo.innerGrid}>
          <div className={componentsTheme.furtherInfo.leftCol}>
            <div className="sm:hidden">
              <SectionHeader eyebrow="Guidebook" title={title} align="center" />
            </div>
            <div className="hidden sm:block">
              <SectionHeader eyebrow="Guidebook" title={title} align="left" />
            </div>
            <p className={componentsTheme.furtherInfo.description}>{subtitle}</p>

            <div className={componentsTheme.furtherInfo.buttonsCol}>
              {guidebooks.map((link, index) => (
                link.href && link.href !== '#' ? (
                  <a
                    key={`${link.locale}-${link.href}-${index}`}
                    href={link.href}
                    className={`${componentsTheme.furtherInfo.guideButtonBase} ${
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
                    key={`${link.locale}-disabled-${index}`}
                    aria-disabled="true"
                    className={`${componentsTheme.furtherInfo.guideButtonBase} ${
                      link.locale === 'eng'
                        ? componentsTheme.homeRegistration.guidePrimary
                        : componentsTheme.homeRegistration.guideSecondary
                    } pointer-events-none flex cursor-not-allowed items-center justify-center opacity-60`}
                  >
                    {DATA_NOT_ADDED}
                  </span>
                )
              ))}
            </div>
          </div>

          <div className={componentsTheme.furtherInfo.rightCol}>
            <div className={componentsTheme.furtherInfo.mockupWrapper}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
