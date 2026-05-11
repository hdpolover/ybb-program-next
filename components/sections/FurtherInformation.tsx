'use client';

import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

interface GuidelineLink {
  href: string;
  label: string;
  locale: 'eng' | 'ind';
}

interface FurtherInformationProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  desktopBackgroundImageUrl?: string;
  mobileBackgroundImageUrl?: string;
  mockupImageUrl?: string;
  guidebooks?: GuidelineLink[];
  /** 'dark' = dark text (default); 'light' = white text for dark/vivid backgrounds */
  textColorScheme?: 'light' | 'dark';
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
  eyebrow = 'Guideline',
  title = 'Further Information',
  subtitle = 'The complete information regarding this program can be seen in the guideline below.',
  desktopBackgroundImageUrl,
  mobileBackgroundImageUrl,
  mockupImageUrl = '/img/mockupjapan.png',
  guidebooks = DEFAULT_GUIDELINES,
  textColorScheme = 'dark',
}: FurtherInformationProps) {
  if (!guidebooks || guidebooks.length === 0 || guidebooks.every(g => !g.href || g.href === '#')) return null;
  const resolvedDesktopBackground = desktopBackgroundImageUrl?.trim() || undefined;
  const resolvedMobileBackground = mobileBackgroundImageUrl?.trim() || resolvedDesktopBackground;
  const resolvedMockupImage = mockupImageUrl?.trim() || '/img/mockupjapan.png';
  return (
    <section
      className={`${componentsTheme.furtherInfo.sectionWrapper} min-h-[760px] overflow-hidden py-14 sm:min-h-0 sm:py-28`}
    >
      <div className="absolute inset-0 bg-primary/20 sm:hidden" />
      {resolvedMobileBackground && (
        <div className="absolute inset-0 sm:hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${resolvedMobileBackground})` }}
            aria-hidden="true"
          />
        </div>
      )}
      {resolvedDesktopBackground && (
        <div className="absolute inset-0 hidden sm:block">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${resolvedDesktopBackground})` }}
            aria-hidden="true"
          />
        </div>
      )}

      <div className={`${componentsTheme.furtherInfo.card} relative z-10`}>
        <div className={componentsTheme.furtherInfo.innerGrid}>
          <div className={componentsTheme.furtherInfo.leftCol}>
            <div className="sm:hidden">
              <SectionHeader eyebrow={eyebrow} title={title} align="center" colorScheme={textColorScheme} />
            </div>
            <div className="hidden sm:block">
              <SectionHeader eyebrow={eyebrow} title={title} align="left" colorScheme={textColorScheme} />
            </div>
            <p className={`${componentsTheme.furtherInfo.description} break-words ${textColorScheme === 'light' ? 'text-white/80' : ''}`}>{subtitle}</p>

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
            <div
              className={componentsTheme.furtherInfo.mockupWrapper}
              style={{
                backgroundImage: `url(${resolvedMockupImage})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
