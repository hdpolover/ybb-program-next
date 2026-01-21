'use client';

import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

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
      className={jysSectionTheme.furtherInfo.sectionWrapper}
      style={{
        backgroundImage: "url('/img/halfback.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={jysSectionTheme.furtherInfo.card}>
        <div className={jysSectionTheme.furtherInfo.innerGrid}>
          <div className={jysSectionTheme.furtherInfo.leftCol}>
            <SectionHeader eyebrow="Guidebook" title={title} align="left" />
            <p className={jysSectionTheme.furtherInfo.description}>{subtitle}</p>

            <div className={jysSectionTheme.furtherInfo.buttonsCol}>
              {guidebooks.map(link => (
                <a
                  key={`${link.locale}-${link.href}`}
                  href={link.href}
                  className={`${jysSectionTheme.furtherInfo.guideButtonBase} ${
                    link.locale === 'eng'
                      ? jysSectionTheme.homeRegistration.guidePrimary
                      : jysSectionTheme.homeRegistration.guideSecondary
                  }`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className={jysSectionTheme.furtherInfo.rightCol}>
            <div className={jysSectionTheme.furtherInfo.mockupWrapper}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
