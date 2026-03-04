import { Calendar, Clock3, Hourglass, Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { PROGRAMS_ACTIVITIES_COPY } from '@/data/programs/sections/activities-info/programsActivitiesInfo';
import type { ProgramActivitiesSection } from '@/types/programs';

type ProgramActivitiesProps = {
  activities?: ProgramActivitiesSection['content'];
};

function formatDate(date: string | null | undefined): string {
  if (!date) return PROGRAMS_ACTIVITIES_COPY.dataNotAdded;

  try {
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return date;
  }
}

export default function ProgramActivities({ activities }: ProgramActivitiesProps) {
  const title = activities?.title || PROGRAMS_ACTIVITIES_COPY.headerTitle;
  const subtitle = activities?.subtitle || PROGRAMS_ACTIVITIES_COPY.headerSubtitleFallback;
  const items = activities?.items ?? [];

  return (
    <section className={componentsTheme.programsActivities.sectionWrapper}>
      <div className={componentsTheme.programsActivities.overlay} />
      <div className={componentsTheme.programsActivities.container}>
        <SectionHeader
          eyebrow={PROGRAMS_ACTIVITIES_COPY.headerEyebrow}
          title={title}
          subtitle={subtitle}
          align="center"
        />

        <div className={componentsTheme.programsActivities.cardsGrid}>
          {items.length > 0 ? (
            items.map(item => {
              const dateLabel = formatDate(item.date);
              const timeLabel = item.time_range || PROGRAMS_ACTIVITIES_COPY.dataNotAdded;
              const durationLabel = item.duration
                ? `Duration: ${item.duration}`
                : PROGRAMS_ACTIVITIES_COPY.dataNotAdded;
              const rawDay = item.day || '';

              let displayTitle = item.title || PROGRAMS_ACTIVITIES_COPY.dataNotAdded;
              if (rawDay) {
                const lowerDay = rawDay.toLowerCase();
                const lowerTitle = displayTitle.toLowerCase();

                if (lowerTitle.startsWith(`${lowerDay}:`)) {
                  displayTitle = displayTitle.slice(rawDay.length + 1).trimStart();
                }
              }

              return (
                <article
                  key={`${item.day}-${item.title}`}
                  className={componentsTheme.programsActivities.card}
                >
                  {/* baris meta bagian atas */}
                  <div className={componentsTheme.programsActivities.metaRow}>
                    <div className={componentsTheme.programsActivities.metaItem}>
                      <Calendar className={componentsTheme.programsActivities.metaIcon} />
                      <span>{dateLabel}</span>
                    </div>
                    <div className={componentsTheme.programsActivities.metaItem}>
                      <Clock3 className={componentsTheme.programsActivities.metaIcon} />
                      <span>{timeLabel}</span>
                    </div>
                    <div className={componentsTheme.programsActivities.metaItem}>
                      <Hourglass className={componentsTheme.programsActivities.metaIcon} />
                      <span>{durationLabel}</span>
                    </div>
                  </div>

                  {/* Judul + bullet checklist */}
                  <div className={componentsTheme.programsActivities.titleWrapper}>
                    <h3 className={componentsTheme.programsActivities.title}>
                      <span className={componentsTheme.programsActivities.dayLabel}>
                        {rawDay ? `${rawDay}:` : ''}
                      </span>{' '}
                      {displayTitle}
                    </h3>

                    <div className={componentsTheme.programsActivities.bulletsGrid}>
                      {item.checklist.map(check => (
                        <div key={check} className={componentsTheme.programsActivities.bulletRow}>
                          <span className={componentsTheme.programsActivities.bulletIconWrapper}>
                            <Check className={componentsTheme.programsActivities.bulletIcon} />
                          </span>
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                    <p className={componentsTheme.programsActivities.description}>
                      {item.description || PROGRAMS_ACTIVITIES_COPY.dataNotAdded}
                    </p>
                  </div>
                </article>
              );
            })
          ) : (
            <article className={componentsTheme.programsActivities.card}>
              <div className={componentsTheme.programsActivities.metaRow}>
                <div className={componentsTheme.programsActivities.metaItem}>
                  <Calendar className={componentsTheme.programsActivities.metaIcon} />
                  <span>{PROGRAMS_ACTIVITIES_COPY.dataNotAdded}</span>
                </div>
                <div className={componentsTheme.programsActivities.metaItem}>
                  <Clock3 className={componentsTheme.programsActivities.metaIcon} />
                  <span>{PROGRAMS_ACTIVITIES_COPY.dataNotAdded}</span>
                </div>
                <div className={componentsTheme.programsActivities.metaItem}>
                  <Hourglass className={componentsTheme.programsActivities.metaIcon} />
                  <span>{PROGRAMS_ACTIVITIES_COPY.dataNotAdded}</span>
                </div>
              </div>
              <div className={componentsTheme.programsActivities.titleWrapper}>
                <h3 className={componentsTheme.programsActivities.title}>
                  {PROGRAMS_ACTIVITIES_COPY.dataNotAdded}
                </h3>
                <p className={componentsTheme.programsActivities.description}>
                  {PROGRAMS_ACTIVITIES_COPY.dataNotAdded}
                </p>
              </div>
            </article>
          )}
        </div>

        <p className={componentsTheme.programsActivities.note}>
          <span className={componentsTheme.programsActivities.noteEmphasis}>
            {PROGRAMS_ACTIVITIES_COPY.notePrefix}
          </span>{' '}
          {PROGRAMS_ACTIVITIES_COPY.noteBody}
        </p>
      </div>
    </section>
  );
}
