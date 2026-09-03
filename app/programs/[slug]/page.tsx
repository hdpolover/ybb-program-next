import { CalendarDays, MapPin, Clock, Info, Check, ClipboardCheck, FileText, ChevronDown } from 'lucide-react';
import { notFound } from 'next/navigation';
import { ViewContentTracker } from '@/components/analytics/ViewContentTracker';
import { RegisterCTA } from '@/components/analytics/RegisterCTA';
import RegistrationTutorial from '@/components/sections/RegistrationTutorial';
import FeaturedSpeakers from '@/components/programs/FeaturedSpeakers';
import ProgramRundowns from '@/components/programs/ProgramRundowns';
import ProgramFAQ from '@/components/programs/ProgramFAQ';
import ProgramDetailImage from '@/components/programs/ProgramDetailImage';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { getProgramDetail, getProgramPricingTiers } from '@/lib/api/programs';
import { isRichTextHtml, richTextToPlainText, sanitizeRichTextHtml } from '@/lib/content/richText';
import { formatTokenLabel, getInclusiveCalendarDaySpan, parseApiDate } from '@/lib/utils';
import {
  formatScheduleDate,
  formatScheduleDuration,
  formatScheduleTimeRange,
  parseScheduleDate,
  SCHEDULE_DATE_GROUP_OPTIONS,
  SCHEDULE_DATE_META_OPTIONS,
} from '@/lib/format/datetime';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';
import { headers } from 'next/headers';
import { getActivityData } from '@/lib/api/activity';
import { ActivityToast } from '@/components/marketing/ActivityToast';
import { resolveBrandDomain } from '@/lib/server/envContext';
import { getRegistrationPhase } from '@/lib/registration/status';
import { getEditionRegistrationPhase, narrowestPhase } from '@/lib/registration/isRegistrationOpen';

function parseValidDate(value: unknown): Date | null {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'object') {
    const candidate = value as Record<string, unknown>;
    const nested = candidate.$date ?? candidate.date ?? candidate.value ?? candidate.iso;
    if (nested !== undefined) return parseValidDate(nested);
  }

  const raw = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
  if (!raw.trim()) return null;

  const parsed = parseApiDate(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateRange(start: string | null, end: string | null): string {
  const s = parseValidDate(start);
  if (!s) return 'TBA';
  const e = parseValidDate(end);
  if (!e) return s.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString('en-US', { month: 'long' })} ${s.getDate()} - ${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
}

function calcDuration(start: string | null, end: string | null): string {
  const days = getInclusiveCalendarDaySpan(start, end);
  if (days === null || !Number.isFinite(days) || days <= 0) return 'TBA';
  return `${days} Days`;
}

function firstNonEmpty(...values: Array<string | null | undefined>): string | null {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function parseBullets(text: string | null): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Kept as the raw host header for getProgramDetail -- do not change what that call
  // receives, it is a working code path and out of scope here.
  const host = (await headers()).get('host') || '';
  // resolveBrandDomain() mirrors app/page.tsx: handles x-hostname, maps localhost to the
  // configured env default, and strips ports. Using the raw host here (like getProgramDetail
  // does) makes the activity toast work on the home page but silently not on this page in
  // local dev/preview, since those environments hit the localhost/port branches differently.
  const activityHost = await resolveBrandDomain();
  const [program, activityItems] = await Promise.all([
    getProgramDetail(slug, host),
    getActivityData(activityHost),
  ]);

  if (!program) notFound();

  // eslint-disable-next-line react-hooks/purity -- server component, Date.now() is safe here; function runs once per request, not on re-render
  const now = Date.now();
  const endDate = parseValidDate(program.endDate ?? program.startDate);
  const hasEnded = endDate ? endDate.getTime() < now : false;
  const isArchiveProgram = program.status === 'completed' || hasEnded;
  // Tri-state: a program whose registrationOpenDate has not arrived is
  // 'upcoming', and must not be labelled "Registration Closed".
  //
  // BOTH gates, narrowed: the program gate answers "would the backend accept a
  // registration at all", the window gate answers "is there a fee tier a
  // visitor can pick and pay for today". This hero's CTA lands on /apply, so a
  // programme open until December whose only fee window lapsed in August used
  // to send visitors to a page where every card read Closed and nothing was
  // purchasable. lib/registration/isRegistrationOpen documents that these two
  // must never contradict each other on one screen; narrowing is how.
  //
  // A failed tiers call yields no tiers, and an edition with no fee tiers at
  // all falls back to the programme's own dates, so the hero degrades to the
  // program-gate answer rather than to "Closed".
  const pricingTiers = isArchiveProgram
    ? []
    : await getProgramPricingTiers(program.id, host).catch((tierError) => {
        console.error('[ProgramDetail] Failed to fetch pricing tiers:', tierError);
        return [];
      });
  const registrationPhase = isArchiveProgram
    ? 'closed'
    : narrowestPhase(
        getRegistrationPhase(program, new Date(now)),
        getEditionRegistrationPhase(
          pricingTiers,
          { open: program.registrationOpenDate ?? null, close: program.registrationCloseDate ?? null },
          new Date(now),
        ),
      );
  const isOpen = registrationPhase === 'open';
  const isUpcoming = registrationPhase === 'upcoming';
  const resolvedProgramTitle =
    firstNonEmpty(program.name, [program.brand?.name, program.year].filter(Boolean).join(' ')) ?? 'Program Archive';
  const heroEyebrow = isArchiveProgram ? 'Program Archive' : 'Featured Program';
  const heroCtaLabel = isOpen
    ? 'Register Now'
    : isArchiveProgram
      ? 'View Previous Programs'
      : isUpcoming
        ? 'Registration Opens Soon'
        : 'Registration Closed';
  const heroCtaHref = isOpen ? '/apply' : isArchiveProgram ? '/programs/previous' : undefined;
  const applicationTitle = isArchiveProgram ? `Explore ${resolvedProgramTitle}` : `Join ${resolvedProgramTitle}`;
  const applicationSubtitle = isArchiveProgram
    ? 'Browse the highlights, schedule, speakers, and resources from this completed edition.'
    : 'Secure your spot and be part of an inspiring cohort of young leaders.';
  const applicationFallbackLabel = isArchiveProgram
    ? 'Back to Previous Programs'
    : isUpcoming
      ? 'Registration Opens Soon'
      : 'Registration Closed';
  const applicationFallbackHref = isArchiveProgram ? '/programs/previous' : undefined;

  const programTitle = resolvedProgramTitle;
  const heroBg = firstNonEmpty(program.bannerUrl, program.thumbnailUrl, '/img/bgprogramoverview.png')!;
  const cardImage = firstNonEmpty(program.thumbnailUrl, program.bannerUrl, '/img/programoverview.png')!;
  const shortDescriptionText = richTextToPlainText(program.shortDescription);
  const programTagline =
    shortDescriptionText ||
    (isArchiveProgram
      ? 'Explore this completed edition and browse the highlights that were preserved.'
      : 'Discover the program overview, schedule, and key information for this edition.');
  const formattedDateRange = formatDateRange(program.startDate, program.endDate);
  const dateRange = formattedDateRange === 'TBA'
    ? isArchiveProgram
      ? 'Archive dates unavailable'
      : 'Dates to be announced'
    : formattedDateRange;
  const formattedDuration = calcDuration(program.startDate, program.endDate);
  const duration = formattedDuration === 'TBA'
    ? isArchiveProgram
      ? 'Duration unavailable'
      : 'To be announced'
    : formattedDuration;
  const location =
    firstNonEmpty(program.location) ??
    (isArchiveProgram ? 'Archive location unavailable' : 'Location to be announced');

  const overviewHtml = isRichTextHtml(program.description) ? sanitizeRichTextHtml(program.description) : '';
  const overviewIntro = overviewHtml
    ? ''
    : richTextToPlainText(program.description) ||
      (isArchiveProgram
        ? 'This archived edition does not have a full write-up yet, but you can still explore the preserved schedule, speakers, and other published details below.'
        : 'A full program overview will appear here once the latest content is published.');
  const overviewRichListHtml = isRichTextHtml(program.benefitsDescription)
    ? sanitizeRichTextHtml(program.benefitsDescription)
    : '';
  const overviewBullets = overviewRichListHtml ? [] : parseBullets(program.benefitsDescription);
  const requirementsHtml = isRichTextHtml(program.requirementsDescription)
    ? sanitizeRichTextHtml(program.requirementsDescription)
    : '';
  const requirementBullets = requirementsHtml ? [] : parseBullets(program.requirementsDescription);
  const plainTermsText = richTextToPlainText(program.termsAndConditions);
  const termsHtml = isRichTextHtml(program.termsAndConditions)
    ? sanitizeRichTextHtml(program.termsAndConditions)
    : '';
  const termsText = termsHtml ? '' : plainTermsText;

  // Map API speakers → FeaturedSpeakers format
  const speakers = (program.speakers ?? []).map(s => ({
    name: s.name,
    title: s.title ?? '',
    org: s.organization ?? '',
    photo: s.photoUrl ?? '/img/speaker1.png',
    href: undefined as string | undefined,
  }));

  // Group schedules by actual date for ProgramRundowns, then sort the tabs chronologically.
  const schedulesByDay = new Map<string, typeof program.schedules>();
  for (const item of (program.schedules ?? [])) {
    // Use the actual date string as the key, not the "Day X" label
    const dateKey = item.day;
    const list = schedulesByDay.get(dateKey) ?? [];
    list.push(item);
    schedulesByDay.set(dateKey, list);
  }
  const rundownDays = Array.from(schedulesByDay.entries())
    .map(([rawDay, items]) => {
      const parsed = parseScheduleDate(rawDay);
      return {
        sortTime: parsed ? parsed.getTime() : Number.MAX_SAFE_INTEGER,
        label: formatScheduleDate(rawDay, SCHEDULE_DATE_GROUP_OPTIONS, rawDay),
        items: items
          .sort((a, b) => a.order - b.order)
          .map(s => ({
            dateLabel: formatScheduleDate(s.day, SCHEDULE_DATE_META_OPTIONS, s.day),
            activitiesCount: 1,
            timeRange: formatScheduleTimeRange(s.startTime, s.endTime),
            duration: formatScheduleDuration(s.startTime, s.endTime) ?? '',
            title: s.activity?.trim() || DATA_NOT_ADDED,
            description: s.description?.trim() ?? '',
          })),
      };
    })
    .filter(day => day.sortTime !== Number.MAX_SAFE_INTEGER) // Filter out invalid dates
    .sort((a, b) => a.sortTime - b.sortTime)
    .map(({ label, items }) => ({ label, items }));

  // Map API faqs → ProgramFAQ groupsOverride format
  const faqGroups = (() => {
    const byCategory = new Map<string, { q: string; a: string }[]>();
    for (const faq of (program.faqs ?? [])) {
      const key = faq.category || 'General';
      const list = byCategory.get(key) ?? [];
      list.push({ q: faq.question, a: faq.answer });
      byCategory.set(key, list);
    }
    return Array.from(byCategory.entries()).map(([label, fqs]) => ({
      label: formatTokenLabel(label, 'General'),
      fqs,
    }));
  })();

  return (
    <main className={componentsTheme.programDetail.mainWrapper}>
      <ViewContentTracker contentId={program.id} contentName={resolvedProgramTitle} />
      <section
        className={componentsTheme.programDetail.heroSection}
        style={{ backgroundImage: `url('${heroBg}'), url('/img/bgprogramoverview.png')` }}
      >
        <div className={componentsTheme.programDetail.heroInner}>
          <p className={componentsTheme.programDetail.heroYearText}>{heroEyebrow}</p>
          <h1 className={componentsTheme.programDetail.heroTitle}>{programTitle}</h1>
          <p className={componentsTheme.programDetail.heroTagline}>{programTagline}</p>

          <div className={componentsTheme.programDetail.heroCtaWrapper}>
            {heroCtaHref ? (
              <RegisterCTA
                href={heroCtaHref}
                className={componentsTheme.programDetail.heroCta}
                contentName={resolvedProgramTitle}
              >
                {heroCtaLabel}
              </RegisterCTA>
            ) : (
              <span className={componentsTheme.programDetail.heroCtaClosed}>{heroCtaLabel}</span>
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
                  {overviewHtml ? (
                    <div
                      className={componentsTheme.programDetail.overviewRichText}
                      dangerouslySetInnerHTML={{ __html: overviewHtml }}
                    />
                  ) : (
                    <p className={componentsTheme.programDetail.overviewText}>{overviewIntro}</p>
                  )}
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
                  {!overviewBullets.length && overviewRichListHtml && (
                    <div
                      className={componentsTheme.programDetail.overviewRichText}
                      dangerouslySetInnerHTML={{ __html: overviewRichListHtml }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* application CTA card */}
            <div className={componentsTheme.programDetail.applicationCard}>
              <div className={componentsTheme.programDetail.applicationImageWrapper}>
                <ProgramDetailImage
                  src={program.thumbnailUrl ?? program.bannerUrl}
                  fallbackSrc={cardImage}
                  alt={`${programTitle} cover image`}
                  sizes="(min-width:1024px) 50vw, 100vw"
                  className={componentsTheme.programDetail.applicationImage}
                />
              </div>
              <div className={componentsTheme.programDetail.applicationBody}>
                <h3 className={componentsTheme.programDetail.applicationTitle}>{applicationTitle}</h3>
                <p className={componentsTheme.programDetail.applicationSubtitle}>
                  {applicationSubtitle}
                </p>
                <div className={componentsTheme.programDetail.applicationCtaWrapper}>
                  {heroCtaHref ? (
                    <RegisterCTA
                      href={heroCtaHref}
                      className={componentsTheme.programDetail.applicationPrimaryCta}
                      contentName={resolvedProgramTitle}
                    >
                      {heroCtaLabel}
                    </RegisterCTA>
                  ) : applicationFallbackHref ? (
                    <a href={applicationFallbackHref} className={componentsTheme.programDetail.applicationPrimaryCta}>
                      {applicationFallbackLabel}
                    </a>
                  ) : (
                    <span className={componentsTheme.programDetail.applicationSecondaryCta}>
                      {applicationFallbackLabel}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {(requirementBullets.length > 0 || Boolean(requirementsHtml)) && (
        <section className={componentsTheme.programDetail.requirementsSection}>
          <div className={componentsTheme.programDetail.requirementsContainer}>
            <SectionHeader eyebrow="Requirements" title="Who Can Apply" />
            <div className={componentsTheme.programDetail.requirementsCard}>
              <div className={componentsTheme.programDetail.overviewInner}>
                <div className={componentsTheme.programDetail.overviewIconCircle}>
                  <ClipboardCheck className={componentsTheme.programDetail.overviewIcon} />
                </div>
                <div className={componentsTheme.programDetail.overviewContent}>
                  {requirementsHtml ? (
                    <div
                      className={componentsTheme.programDetail.overviewRichText}
                      dangerouslySetInnerHTML={{ __html: requirementsHtml }}
                    />
                  ) : (
                    <ul className={componentsTheme.programDetail.overviewList}>
                      {requirementBullets.map(bullet => (
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
          </div>
        </section>
      )}

      {!isArchiveProgram && <RegistrationTutorial />}

      {speakers.length > 0 && <FeaturedSpeakers speakers={speakers} />}

      {rundownDays.length > 0 && <ProgramRundowns days={rundownDays} />}

      {faqGroups.length > 0 && <ProgramFAQ groupsOverride={faqGroups} />}

      {(termsText || termsHtml) && (
        <section className={componentsTheme.programDetail.termsSection}>
          <div className={componentsTheme.programDetail.termsContainer}>
            <details className={componentsTheme.programDetail.termsDetails}>
              <summary className={componentsTheme.programDetail.termsSummary}>
                <FileText className={componentsTheme.programDetail.termsIcon} />
                <span>Terms &amp; Conditions</span>
                <ChevronDown className={componentsTheme.programDetail.termsChevron} />
              </summary>
              <div className={componentsTheme.programDetail.termsBody}>
                {termsHtml ? (
                  <div
                    className={componentsTheme.programDetail.termsRichText}
                    dangerouslySetInnerHTML={{ __html: termsHtml }}
                  />
                ) : (
                  <p className={componentsTheme.programDetail.termsText}>{termsText}</p>
                )}
              </div>
            </details>
          </div>
        </section>
      )}
      <ActivityToast items={activityItems} />
    </main>
  );
}
