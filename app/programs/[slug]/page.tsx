import { CalendarDays, MapPin, Clock, Users, FileText, Download, Info, Check } from 'lucide-react';
import Image from 'next/image';
import RegistrationTutorial from '@/components/sections/RegistrationTutorial';
import FeaturedSpeakers from '@/components/programs/FeaturedSpeakers';
import ProgramRundowns from '@/components/programs/ProgramRundowns';
import ProgramFAQ from '@/components/programs/ProgramFAQ';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
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
    <main className={componentsTheme.programDetail.mainWrapper}>
      {/* hero custom tanpa breadcrumb, sesuai request */}
      <section
        className={componentsTheme.programDetail.heroSection}
        style={{ backgroundImage: `url('${PROGRAM_DETAIL_HERO.backgroundImage}')` }}
      >
        <div className={componentsTheme.programDetail.heroInner}>
          <p className={componentsTheme.programDetail.heroYearText}>{meta.yearText}</p>
          <h1 className={componentsTheme.programDetail.heroTitle}>{meta.title}</h1>
          <p className={componentsTheme.programDetail.heroTagline}>{meta.tagline}</p>

          <div className={componentsTheme.programDetail.heroCtaWrapper}>
            {ctaHref ? (
              <a href={ctaHref} className={componentsTheme.programDetail.heroCta}>
                {ctaLabel}
              </a>
            ) : (
              <span className={componentsTheme.programDetail.heroCtaClosed}>{ctaLabel}</span>
            )}
          </div>
        </div>

        <div className={componentsTheme.programDetail.heroBlurPrimary} />
        <div className={componentsTheme.programDetail.heroBlurSecondary} />
      </section>

      {/* info strip section (ngikut gaya InfoStrip homepage) */}
      <section className={componentsTheme.programDetail.infoStripSection}>
        <div className={componentsTheme.programDetail.infoStripBlurPrimary} />
        <div className={componentsTheme.programDetail.infoStripBlurSecondary} />
        <div className={componentsTheme.programDetail.infoStripBlurTertiary} />
        <div className={componentsTheme.programDetail.infoStripContainer}>
          <ul className={componentsTheme.programDetail.infoStripGrid}>
            <li className={componentsTheme.programDetail.infoStripItem}>
              <div className={componentsTheme.programDetail.infoStripIconCircle}>
                <CalendarDays className={componentsTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={componentsTheme.programDetail.infoStripSubtitle}>
                  {PROGRAM_DETAIL_INFO_STRIP.programDate.label}
                </p>
                <h3 className={componentsTheme.programDetail.infoStripValue}>
                  {PROGRAM_DETAIL_INFO_STRIP.programDate.value}
                </h3>
              </div>
            </li>
            <li className={componentsTheme.programDetail.infoStripItem}>
              <div className={componentsTheme.programDetail.infoStripIconCircle}>
                <MapPin className={componentsTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={componentsTheme.programDetail.infoStripSubtitle}>
                  {PROGRAM_DETAIL_INFO_STRIP.location.label}
                </p>
                <h3 className={componentsTheme.programDetail.infoStripValue}>
                  {PROGRAM_DETAIL_INFO_STRIP.location.value}
                </h3>
              </div>
            </li>
            <li className={componentsTheme.programDetail.infoStripItem}>
              <div className={componentsTheme.programDetail.infoStripIconCircle}>
                <Clock className={componentsTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={componentsTheme.programDetail.infoStripSubtitle}>
                  {PROGRAM_DETAIL_INFO_STRIP.duration.label}
                </p>
                <h3 className={componentsTheme.programDetail.infoStripValue}>
                  {PROGRAM_DETAIL_INFO_STRIP.duration.value}
                </h3>
              </div>
            </li>
            <li className={componentsTheme.programDetail.infoStripItem}>
              <div className={componentsTheme.programDetail.infoStripIconCircle}>
                <Users className={componentsTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={componentsTheme.programDetail.infoStripSubtitle}>
                  {PROGRAM_DETAIL_INFO_STRIP.capacity.label}
                </p>
                <h3 className={componentsTheme.programDetail.infoStripValue}>
                  {PROGRAM_DETAIL_INFO_STRIP.capacity.value}
                </h3>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className={componentsTheme.programDetail.guidelinesSection}>
        <div className={componentsTheme.programDetail.guidelinesContainer}>
          <SectionHeader
            eyebrow={PROGRAM_DETAIL_GUIDELINES.eyebrow}
            title={PROGRAM_DETAIL_GUIDELINES.title}
          />
          <div className={componentsTheme.programDetail.guidelinesCard}>
            <div className={componentsTheme.programDetail.guidelinesBody}>
              <div className={componentsTheme.programDetail.guidelinesIconCircle}>
                <FileText className={componentsTheme.programDetail.guidelinesIcon} />
              </div>
              <p className={componentsTheme.programDetail.guidelinesText}>
                {PROGRAM_DETAIL_GUIDELINES.body}
              </p>
              <div className={componentsTheme.programDetail.guidelinesCtaWrapper}>
                <a
                  href={PROGRAM_DETAIL_GUIDELINES.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={componentsTheme.programDetail.guidelinesButton}
                >
                  <Download className={componentsTheme.programDetail.guidelinesDownloadIcon} />
                  {PROGRAM_DETAIL_GUIDELINES.ctaLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* overview + program application (2 kartu) */}
      <section className={componentsTheme.programDetail.overviewSection}>
        <div className={componentsTheme.programDetail.overviewContainer}>
          <SectionHeader
            eyebrow={PROGRAM_DETAIL_OVERVIEW.eyebrow}
            title={PROGRAM_DETAIL_OVERVIEW.title}
          />
          <div className={componentsTheme.programDetail.overviewGrid}>
            {/* kartu overview utama */}
            <div className={componentsTheme.programDetail.overviewCard}>
              <div className={componentsTheme.programDetail.overviewInner}>
                <div className={componentsTheme.programDetail.overviewIconCircle}>
                  <Info className={componentsTheme.programDetail.overviewIcon} />
                </div>
                <div className={componentsTheme.programDetail.overviewContent}>
                  <p className={componentsTheme.programDetail.overviewText}>
                    {PROGRAM_DETAIL_OVERVIEW.intro}
                  </p>
                  <ul className={componentsTheme.programDetail.overviewList}>
                    {PROGRAM_DETAIL_OVERVIEW.bullets.map(bullet => (
                      <li
                        key={bullet}
                        className={componentsTheme.programDetail.overviewListItem}
                      >
                        <span className={componentsTheme.programDetail.overviewBulletIconAlt}>
                          <Check className={componentsTheme.programDetail.overviewCheckIcon} />
                        </span>
                        <span className={componentsTheme.programDetail.overviewText}>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* kartu program application */}
            <div className={componentsTheme.programDetail.applicationCard}>
              <div className={componentsTheme.programDetail.applicationImageWrapper}>
                <Image
                  src="/img/coverjysbrosur.png"
                  alt="Program Cover"
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className={componentsTheme.programDetail.applicationImage}
                  priority={false}
                />
              </div>
              <div className={componentsTheme.programDetail.applicationBody}>
                <h3 className={componentsTheme.programDetail.applicationTitle}>
                  {PROGRAM_DETAIL_APPLICATION.title}
                </h3>
                <p className={componentsTheme.programDetail.applicationSubtitle}>
                  {PROGRAM_DETAIL_APPLICATION.subtitle}
                </p>
                <div className={componentsTheme.programDetail.applicationCtaWrapper}>
                  {ctaHref ? (
                    <a
                      href={ctaHref}
                      className={componentsTheme.programDetail.applicationPrimaryCta}
                    >
                      {ctaLabel}
                    </a>
                  ) : (
                    <span className={componentsTheme.programDetail.applicationSecondaryCta}>
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
