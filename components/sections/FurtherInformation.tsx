'use client';

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

interface GuidelineLink {
  href: string;
  label: string;
  locale: 'eng' | 'ind';
}

interface FurtherInformationProps {
  title?: string;
  subtitle?: string;
  guidebooks?: GuidelineLink[];
}

const DEFAULT_GUIDELINES: GuidelineLink[] = [
  {
    href: '#',
    label: 'Read Guideline (Eng)',
    locale: 'eng',
  },
  {
    href: '#',
    label: 'Read Guideline (Ind)',
    locale: 'ind',
  },
];

export default function FurtherInformationSection({
  title = 'Further Information',
  subtitle = 'The complete information regarding this program can be seen in the guideline below.',
  guidebooks = DEFAULT_GUIDELINES,
}: FurtherInformationProps) {
  if (!guidebooks || guidebooks.length === 0 || guidebooks.every(g => !g.href || g.href === '#')) return null;
  return (
    <section
      className={`${componentsTheme.furtherInfo.sectionWrapper} min-h-[760px] overflow-hidden py-14 sm:min-h-0 sm:py-28`}
    >
      <div className="absolute inset-0 bg-primary/20 sm:hidden" />
      <div className="absolute inset-0 sm:hidden">
        <Image
          src="/img/backgroundformobile.png"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 hidden sm:block">
        <Image
          src="/img/halfback.png"
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
      </div>

      <div className={`${componentsTheme.furtherInfo.card} relative z-10`}>
        <div className={componentsTheme.furtherInfo.innerGrid}>
          <div className={componentsTheme.furtherInfo.leftCol}>
            <div className="sm:hidden">
              <SectionHeader eyebrow="Guideline" title={title} align="center" />
            </div>
            <div className="hidden sm:block">
              <SectionHeader eyebrow="Guideline" title={title} align="left" />
            </div>
            <p className={`${componentsTheme.furtherInfo.description} break-words`}>{subtitle}</p>

            <div className={componentsTheme.furtherInfo.buttonsCol}>
              {guidebooks.map((link, index) => (
                link.href && link.href !== '#' ? (
                  <a
                    key={`${link.locale}-${link.href}-${index}`}
                    href={link.href}
                    className={`${componentsTheme.furtherInfo.guideButtonBase} w-full max-w-xs truncate ${
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
                    className={`${componentsTheme.furtherInfo.guideButtonBase} w-full max-w-xs truncate ${
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
