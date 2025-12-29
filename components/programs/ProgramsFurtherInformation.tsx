'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

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

export default function ProgramsFurtherInformationSection({
  title = 'Further Information',
  subtitle = 'The complete information regarding this program can be seen in the guidebook below.',
  guidebooks = DEFAULT_GUIDEBOOKS,
}: ProgramsFurtherInformationProps) {
  return (
    <section
      className={jysSectionTheme.furtherInfoPrograms.sectionWrapper}
      style={{
        backgroundImage: "url('/img/halfback1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className={jysSectionTheme.furtherInfoPrograms.card}>
        <div className={jysSectionTheme.furtherInfoPrograms.innerGrid}>
          <div className={jysSectionTheme.furtherInfoPrograms.leftCol}>
            <div style={{ marginTop: '100px' }}>
              <SectionHeader eyebrow="Guidebook" title={title} align="left" />
              <p className={jysSectionTheme.furtherInfoPrograms.description}>{subtitle}</p>

              <div className={jysSectionTheme.furtherInfoPrograms.buttonsCol}>
                {guidebooks.map(link => (
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
                ))}
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
