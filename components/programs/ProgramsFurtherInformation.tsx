"use client";

import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

interface GuidebookLink {
  href: string;
  label: string;
}

interface ProgramsFurtherInformationProps {
  title?: string;
  subtitle?: string;
  guidebooks?: GuidebookLink[];
}

export default function ProgramsFurtherInformationSection({
  title,
  subtitle,
  guidebooks,
}: ProgramsFurtherInformationProps) {
  if (!title && !subtitle && (!guidebooks || guidebooks.length === 0)) return null;

  const displayTitle = title || 'Further Information';
  const displaySubtitle = subtitle || 'The complete information regarding this program can be seen in the guidebook below.';
  const displayGuidebooks = guidebooks && guidebooks.length > 0
    ? guidebooks
    : [
        { href: '#', label: 'Read Guidebook (Eng)' },
        { href: '#', label: 'Read Guidebook (Ind)' },
      ];

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
              <SectionHeader eyebrow="Guidebook" title={displayTitle} align="left" />
              <p className={componentsTheme.furtherInfoPrograms.description}>{displaySubtitle}</p>

              <div className={componentsTheme.furtherInfoPrograms.buttonsCol}>
                {displayGuidebooks.map(link =>
                  link.href && link.href !== '#' ? (
                    <a
                      key={link.label}
                      href={link.href}
                      className={`${componentsTheme.furtherInfoPrograms.guideButtonBase} ${componentsTheme.homeRegistration.guidePrimary}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span
                      key={`${link.label}-disabled`}
                      aria-disabled="true"
                      className={`${componentsTheme.furtherInfoPrograms.guideButtonBase} ${componentsTheme.homeRegistration.guidePrimary} pointer-events-none flex cursor-not-allowed items-center justify-center opacity-60`}
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
