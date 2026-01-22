import { Calendar, Clock3, Hourglass, Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { PROGRAMS_ACTIVITIES_COPY } from '@/data/programsActivitiesInfo';
import type { ProgramActivitiesSection } from '@/types/programs';

type ProgramActivitiesProps = {
  activities?: ProgramActivitiesSection['content'];
};

function formatDate(date: string | null | undefined): string {
  if (!date) return 'Data not added';

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
  const title = activities?.title || 'Japan Youth Summit 2026 Activity';
  const subtitle = activities?.subtitle || 'Data not added';
  const items = activities?.items ?? [];

  return (
    <section className={jysSectionTheme.programsActivities.sectionWrapper}>
      <div className={jysSectionTheme.programsActivities.overlay} />
      <div className={jysSectionTheme.programsActivities.container}>
        <SectionHeader eyebrow="Program Rundown" title={title} subtitle={subtitle} align="center" />

        <div className={jysSectionTheme.programsActivities.cardsGrid}>
          {items.length > 0 ? (
            items.map(item => {
              const dateLabel = formatDate(item.date);
              const timeLabel = item.time_range || 'Data not added';
              const durationLabel = item.duration ? `Duration: ${item.duration}` : 'Data not added';
              const rawDay = item.day || '';

              let displayTitle = item.title || 'Data not added';
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
                  className={jysSectionTheme.programsActivities.card}
                >
                  {/* Top meta row */}
                  <div className={jysSectionTheme.programsActivities.metaRow}>
                    <div className={jysSectionTheme.programsActivities.metaItem}>
                      <Calendar className={jysSectionTheme.programsActivities.metaIcon} />
                      <span>{dateLabel}</span>
                    </div>
                    <div className={jysSectionTheme.programsActivities.metaItem}>
                      <Clock3 className={jysSectionTheme.programsActivities.metaIcon} />
                      <span>{timeLabel}</span>
                    </div>
                    <div className={jysSectionTheme.programsActivities.metaItem}>
                      <Hourglass className={jysSectionTheme.programsActivities.metaIcon} />
                      <span>{durationLabel}</span>
                    </div>
                  </div>

                  {/* Title + bullets */}
                  <div className={jysSectionTheme.programsActivities.titleWrapper}>
                    <h3 className={jysSectionTheme.programsActivities.title}>
                      <span className={jysSectionTheme.programsActivities.dayLabel}>
                        {rawDay ? `${rawDay}:` : ''}
                      </span>{' '}
                      {displayTitle}
                    </h3>

                    <div className={jysSectionTheme.programsActivities.bulletsGrid}>
                      {item.checklist.map(check => (
                        <div key={check} className={jysSectionTheme.programsActivities.bulletRow}>
                          <span className={jysSectionTheme.programsActivities.bulletIconWrapper}>
                            <Check className={jysSectionTheme.programsActivities.bulletIcon} />
                          </span>
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                    <p className={jysSectionTheme.programsActivities.description}>
                      {item.description || 'Data not added'}
                    </p>
                  </div>
                </article>
              );
            })
          ) : (
            <p className={jysSectionTheme.programsActivities.description}>Data not added</p>
          )}
        </div>

        <p className={jysSectionTheme.programsActivities.note}>
          <span className={jysSectionTheme.programsActivities.noteEmphasis}>
            {PROGRAMS_ACTIVITIES_COPY.notePrefix}
          </span>{' '}
          {PROGRAMS_ACTIVITIES_COPY.noteBody}
        </p>
      </div>
    </section>
  );
}
