import { CalendarDays, MapPin, Clock, Users, FileText, Download, Info, Check } from 'lucide-react';
import Image from 'next/image';
import RegistrationTutorial from '@/components/sections/RegistrationTutorial';
import FeaturedSpeakers from '@/components/programs/FeaturedSpeakers';
import ProgramRundowns from '@/components/programs/ProgramRundowns';
import ProgramFAQ from '@/components/programs/ProgramFAQ';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import {
  PROGRAM_DETAIL_HERO,
  PROGRAM_DETAIL_INFO_STRIP,
  PROGRAM_DETAIL_GUIDELINES,
  PROGRAM_DETAIL_OVERVIEW,
  PROGRAM_DETAIL_APPLICATION,
  PROGRAM_DETAIL_SPEAKERS,
  PROGRAM_DETAIL_RUNDOWN_DAYS,
  PROGRAM_DETAIL_FAQ_GROUPS,
} from '@/data/programs/sections/detail-static/programDetailStatic';

function getProgramMeta(slug: string): {
  yearText: string;
  title: string;
  tagline: string;
  open: boolean;
} {
  switch (slug) {
    case 'jys-2026':
      return {
        yearText: 'Featured Program',
        title: 'Japan Youth Summit 2026',
        tagline: 'Collaboration in Diversity',
        open: true,
      };
    case 'jys-2025':
      return {
        yearText: 'Featured Program',
        title: 'Japan Youth Summit 2025',
        tagline: 'Innovate for Tomorrow',
        open: false,
      };
    case 'jys-2024':
      return {
        yearText: 'Featured Program',
        title: 'Japan Youth Summit 2024',
        tagline: 'Innovate for Tomorrow',
        open: false,
      };
    case 'jys-2023':
      return {
        yearText: 'Featured Program',
        title: 'Japan Youth Summit 2023',
        tagline: 'Innovate for Tomorrow',
        open: false,
      };
    default:
      return {
        yearText: 'Featured Program',
        title: 'Program Details',
        tagline: 'Innovate for Tomorrow',
        open: false,
      };
  }
}

export default function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const meta = getProgramMeta(slug);

  const ctaLabel = meta.open ? 'Register Now' : 'Registration Closed';
  const ctaHref = meta.open ? '/apply' : undefined;

  return (
    <main className={jysSectionTheme.programDetail.mainWrapper}>
      {/* hero custom tanpa breadcrumb, sesuai request */}
      <section
        className={jysSectionTheme.programDetail.heroSection}
        style={{ backgroundImage: `url('${PROGRAM_DETAIL_HERO.backgroundImage}')` }}
      >
        <div className={jysSectionTheme.programDetail.heroInner}>
          <p className={jysSectionTheme.programDetail.heroYearText}>{meta.yearText}</p>
          <h1 className={jysSectionTheme.programDetail.heroTitle}>{meta.title}</h1>
          <p className={jysSectionTheme.programDetail.heroTagline}>{meta.tagline}</p>

          <div className={jysSectionTheme.programDetail.heroCtaWrapper}>
            {ctaHref ? (
              <a href={ctaHref} className={jysSectionTheme.programDetail.heroCta}>
                {ctaLabel}
              </a>
            ) : (
              <span className={jysSectionTheme.programDetail.heroCtaClosed}>{ctaLabel}</span>
            )}
          </div>
        </div>

        <div className={jysSectionTheme.programDetail.heroBlurPrimary} />
        <div className={jysSectionTheme.programDetail.heroBlurSecondary} />
      </section>

      {/* info strip section (ngikut gaya InfoStrip homepage) */}
      <section className={jysSectionTheme.programDetail.infoStripSection}>
        <div className={jysSectionTheme.programDetail.infoStripBlurPrimary} />
        <div className={jysSectionTheme.programDetail.infoStripBlurSecondary} />
        <div className={jysSectionTheme.programDetail.infoStripBlurTertiary} />
        <div className={jysSectionTheme.programDetail.infoStripContainer}>
          <ul className={jysSectionTheme.programDetail.infoStripGrid}>
            <li className={jysSectionTheme.programDetail.infoStripItem}>
              <div className={jysSectionTheme.programDetail.infoStripIconCircle}>
                <CalendarDays className={jysSectionTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={jysSectionTheme.programDetail.infoStripSubtitle}>
                  {PROGRAM_DETAIL_INFO_STRIP.programDate.label}
                </p>
                <h3 className={jysSectionTheme.programDetail.infoStripValue}>
                  {PROGRAM_DETAIL_INFO_STRIP.programDate.value}
                </h3>
              </div>
            </li>
            <li className={jysSectionTheme.programDetail.infoStripItem}>
              <div className={jysSectionTheme.programDetail.infoStripIconCircle}>
                <MapPin className={jysSectionTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={jysSectionTheme.programDetail.infoStripSubtitle}>
                  {PROGRAM_DETAIL_INFO_STRIP.location.label}
                </p>
                <h3 className={jysSectionTheme.programDetail.infoStripValue}>
                  {PROGRAM_DETAIL_INFO_STRIP.location.value}
                </h3>
              </div>
            </li>
            <li className={jysSectionTheme.programDetail.infoStripItem}>
              <div className={jysSectionTheme.programDetail.infoStripIconCircle}>
                <Clock className={jysSectionTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={jysSectionTheme.programDetail.infoStripSubtitle}>
                  {PROGRAM_DETAIL_INFO_STRIP.duration.label}
                </p>
                <h3 className={jysSectionTheme.programDetail.infoStripValue}>
                  {PROGRAM_DETAIL_INFO_STRIP.duration.value}
                </h3>
              </div>
            </li>
            <li className={jysSectionTheme.programDetail.infoStripItem}>
              <div className={jysSectionTheme.programDetail.infoStripIconCircle}>
                <Users className={jysSectionTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={jysSectionTheme.programDetail.infoStripSubtitle}>
                  {PROGRAM_DETAIL_INFO_STRIP.capacity.label}
                </p>
                <h3 className={jysSectionTheme.programDetail.infoStripValue}>
                  {PROGRAM_DETAIL_INFO_STRIP.capacity.value}
                </h3>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className={jysSectionTheme.programDetail.guidelinesSection}>
        <div className={jysSectionTheme.programDetail.guidelinesContainer}>
          <SectionHeader
            eyebrow={PROGRAM_DETAIL_GUIDELINES.eyebrow}
            title={PROGRAM_DETAIL_GUIDELINES.title}
          />
          <div className={jysSectionTheme.programDetail.guidelinesCard}>
            <div className={jysSectionTheme.programDetail.guidelinesBody}>
              <div className={jysSectionTheme.programDetail.guidelinesIconCircle}>
                <FileText className={jysSectionTheme.programDetail.guidelinesIcon} />
              </div>
              <p className={jysSectionTheme.programDetail.guidelinesText}>
                {PROGRAM_DETAIL_GUIDELINES.body}
              </p>
              <div className={jysSectionTheme.programDetail.guidelinesCtaWrapper}>
                <a
                  href={PROGRAM_DETAIL_GUIDELINES.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={jysSectionTheme.programDetail.guidelinesButton}
                >
                  <Download className={jysSectionTheme.programDetail.guidelinesDownloadIcon} />
                  {PROGRAM_DETAIL_GUIDELINES.ctaLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* overview + program application (2 kartu) */}
      <section className={jysSectionTheme.programDetail.overviewSection}>
        <div className={jysSectionTheme.programDetail.overviewContainer}>
          <SectionHeader
            eyebrow={PROGRAM_DETAIL_OVERVIEW.eyebrow}
            title={PROGRAM_DETAIL_OVERVIEW.title}
          />
          <div className={jysSectionTheme.programDetail.overviewGrid}>
            {/* kartu overview utama */}
            <div className={jysSectionTheme.programDetail.overviewCard}>
              <div className={jysSectionTheme.programDetail.overviewInner}>
                <div className={jysSectionTheme.programDetail.overviewIconCircle}>
                  <Info className={jysSectionTheme.programDetail.overviewIcon} />
                </div>
                <div className={jysSectionTheme.programDetail.overviewContent}>
                  <p className={jysSectionTheme.programDetail.overviewText}>
                    {PROGRAM_DETAIL_OVERVIEW.intro}
                  </p>
                  <ul className={jysSectionTheme.programDetail.overviewList}>
                    {PROGRAM_DETAIL_OVERVIEW.bullets.map(bullet => (
                      <li
                        key={bullet}
                        className={jysSectionTheme.programDetail.overviewListItem}
                      >
                        <span className={jysSectionTheme.programDetail.overviewBulletIconAlt}>
                          <Check className={jysSectionTheme.programDetail.overviewCheckIcon} />
                        </span>
                        <span className={jysSectionTheme.programDetail.overviewText}>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* kartu program application */}
            <div className={jysSectionTheme.programDetail.applicationCard}>
              <div className={jysSectionTheme.programDetail.applicationImageWrapper}>
                <Image
                  src="/img/coverjysbrosur.png"
                  alt="Program Cover"
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className={jysSectionTheme.programDetail.applicationImage}
                  priority={false}
                />
              </div>
              <div className={jysSectionTheme.programDetail.applicationBody}>
                <h3 className={jysSectionTheme.programDetail.applicationTitle}>
                  {PROGRAM_DETAIL_APPLICATION.title}
                </h3>
                <p className={jysSectionTheme.programDetail.applicationSubtitle}>
                  {PROGRAM_DETAIL_APPLICATION.subtitle}
                </p>
                <div className={jysSectionTheme.programDetail.applicationCtaWrapper}>
                  {ctaHref ? (
                    <a
                      href={ctaHref}
                      className={jysSectionTheme.programDetail.applicationPrimaryCta}
                    >
                      {ctaLabel}
                    </a>
                  ) : (
                    <span className={jysSectionTheme.programDetail.applicationSecondaryCta}>
                      {ctaLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <RegistrationTutorial />

      <FeaturedSpeakers speakers={PROGRAM_DETAIL_SPEAKERS} />

      <ProgramRundowns days={PROGRAM_DETAIL_RUNDOWN_DAYS} />

      <ProgramFAQ groupsOverride={PROGRAM_DETAIL_FAQ_GROUPS} />
    </main>
  );
}
