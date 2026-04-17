import { CalendarDays, MapPin, Clock, Info, Check } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import RegistrationTutorial from '@/components/sections/RegistrationTutorial';
import FeaturedSpeakers from '@/components/programs/FeaturedSpeakers';
import ProgramRundowns from '@/components/programs/ProgramRundowns';
import ProgramFAQ from '@/components/programs/ProgramFAQ';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { getProgramDetail } from '@/lib/api/programs';
import { headers } from 'next/headers';

function formatDateRange(start: string | null, end: string | null): string {
  if (!start) return 'TBA';
  const s = new Date(start);
  if (!end) return s.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString('en-US', { month: 'long' })} ${s.getDate()} - ${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
}

function calcDuration(start: string | null, end: string | null): string {
  if (!start || !end) return 'TBA';
  const days = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return `${days} Days`;
}

function parseBullets(text: string | null): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const host = (await headers()).get('host') || '';
  const program = await getProgramDetail(slug, host);

  if (!program) notFound();

  const isOpen = program.allowRegistration;
  const ctaLabel = isOpen ? 'Register Now' : 'Registration Closed';
  const ctaHref = isOpen ? '/apply' : undefined;

  const heroBg = program.bannerUrl ?? '/img/bgprogramoverview.png';
  const programTitle = program.name;
  const programTagline = program.shortDescription ?? '';
  const dateRange = formatDateRange(program.startDate, program.endDate);
  const duration = calcDuration(program.startDate, program.endDate);
  const location = program.location ?? 'TBA';

  const overviewBullets = parseBullets(program.benefitsDescription);
  const overviewIntro = program.description ?? '';

  // Map API speakers → FeaturedSpeakers format
  const speakers = (program.speakers ?? []).map(s => ({
    name: s.name,
    title: s.title ?? '',
    org: s.organization ?? '',
    photo: s.photoUrl ?? '/img/speaker1.png',
    href: undefined as string | undefined,
  }));

  // Group schedules by day label for ProgramRundowns
  const schedulesByDay = new Map<string, typeof program.schedules>();
  for (const item of (program.schedules ?? [])) {
    const list = schedulesByDay.get(item.day) ?? [];
    list.push(item);
    schedulesByDay.set(item.day, list);
  }
  const rundownDays = Array.from(schedulesByDay.entries()).map(([label, items]) => ({
    label,
    items: items
      .sort((a, b) => a.order - b.order)
      .map(s => ({
        dateLabel: label,
        activitiesCount: 1,
        timeRange: s.startTime && s.endTime ? `${s.startTime} - ${s.endTime}` : 'All Day',
        duration: '',
        title: s.activity,
        description: s.description ?? '',
      })),
  }));

  // Map API faqs → ProgramFAQ groupsOverride format
  const faqGroups = (() => {
    const byCategory = new Map<string, { q: string; a: string }[]>();
    for (const faq of (program.faqs ?? [])) {
      const key = faq.category || 'General';
      const list = byCategory.get(key) ?? [];
      list.push({ q: faq.question, a: faq.answer });
      byCategory.set(key, list);
    }
    return Array.from(byCategory.entries()).map(([label, fqs]) => ({ label, fqs }));
  })();

  return (
    <main className={componentsTheme.programDetail.mainWrapper}>
      <section
        className={componentsTheme.programDetail.heroSection}
        style={{ backgroundImage: `url('${heroBg}')` }}
      >
        <div className={componentsTheme.programDetail.heroInner}>
          <p className={componentsTheme.programDetail.heroYearText}>Featured Program</p>
          <h1 className={componentsTheme.programDetail.heroTitle}>{programTitle}</h1>
          <p className={componentsTheme.programDetail.heroTagline}>{programTagline}</p>

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

      {/* info strip */}
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
                <p className={componentsTheme.programDetail.infoStripSubtitle}>Program Date</p>
                <h3 className={componentsTheme.programDetail.infoStripValue}>{dateRange}</h3>
              </div>
            </li>
            <li className={componentsTheme.programDetail.infoStripItem}>
              <div className={componentsTheme.programDetail.infoStripIconCircle}>
                <MapPin className={componentsTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={componentsTheme.programDetail.infoStripSubtitle}>Location</p>
                <h3 className={componentsTheme.programDetail.infoStripValue}>{location}</h3>
              </div>
            </li>
            <li className={componentsTheme.programDetail.infoStripItem}>
              <div className={componentsTheme.programDetail.infoStripIconCircle}>
                <Clock className={componentsTheme.programDetail.infoStripIcon} />
              </div>
              <div>
                <p className={componentsTheme.programDetail.infoStripSubtitle}>Duration</p>
                <h3 className={componentsTheme.programDetail.infoStripValue}>{duration}</h3>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* overview section */}
      <section className={componentsTheme.programDetail.overviewSection}>
        <div className={componentsTheme.programDetail.overviewContainer}>
          <SectionHeader eyebrow="Overview" title="Overview" />
          <div className={componentsTheme.programDetail.overviewGrid}>
            <div className={componentsTheme.programDetail.overviewCard}>
              <div className={componentsTheme.programDetail.overviewInner}>
                <div className={componentsTheme.programDetail.overviewIconCircle}>
                  <Info className={componentsTheme.programDetail.overviewIcon} />
                </div>
                <div className={componentsTheme.programDetail.overviewContent}>
                  <p className={componentsTheme.programDetail.overviewText}>{overviewIntro}</p>
                  {overviewBullets.length > 0 && (
                    <ul className={componentsTheme.programDetail.overviewList}>
                      {overviewBullets.map(bullet => (
                        <li key={bullet} className={componentsTheme.programDetail.overviewListItem}>
                          <span className={componentsTheme.programDetail.overviewBulletIconAlt}>
                            <Check className={componentsTheme.programDetail.overviewCheckIcon} />
                          </span>
                          <span className={componentsTheme.programDetail.overviewText}>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* application CTA card */}
            <div className={componentsTheme.programDetail.applicationCard}>
              <div className={componentsTheme.programDetail.applicationImageWrapper}>
                <Image
                  src={program.thumbnailUrl ?? '/img/program-brochure.png'}
                  alt={programTitle}
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className={componentsTheme.programDetail.applicationImage}
                  priority={false}
                />
              </div>
              <div className={componentsTheme.programDetail.applicationBody}>
                <h3 className={componentsTheme.programDetail.applicationTitle}>
                  Join {programTitle}
                </h3>
                <p className={componentsTheme.programDetail.applicationSubtitle}>
                  Secure your spot and be part of an inspiring cohort of young leaders.
                </p>
                <div className={componentsTheme.programDetail.applicationCtaWrapper}>
                  {ctaHref ? (
                    <a href={ctaHref} className={componentsTheme.programDetail.applicationPrimaryCta}>
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

      {speakers.length > 0 && <FeaturedSpeakers speakers={speakers} />}

      {rundownDays.length > 0 && <ProgramRundowns days={rundownDays} />}

      {faqGroups.length > 0 && <ProgramFAQ groupsOverride={faqGroups} />}
    </main>
  );
}

