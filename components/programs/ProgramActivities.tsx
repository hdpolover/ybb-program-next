import { Calendar, Clock3, Hourglass, Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramActivitiesSection } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';
import { parseApiDate } from '@/lib/utils';

type ProgramActivitiesProps = {
  activities?: ProgramActivitiesSection['content'];
};

function formatDate(date: string | null | undefined): string {
  if (!date) return DATA_NOT_ADDED;

  const parsed = parseApiDate(date);
  if (Number.isNaN(parsed.getTime())) return DATA_NOT_ADDED;

  return parsed.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function ProgramActivities({ activities }: ProgramActivitiesProps) {
  if (!activities) return null;

  const title = activities.title || 'Program Activities';
  const subtitle = activities.subtitle || '';
  const items = activities.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className={componentsTheme.programsActivities.sectionWrapper}>
      <div className={componentsTheme.programsActivities.overlay} />
      <div className={componentsTheme.programsActivities.container}>
        <SectionHeader
          eyebrow="Program Rundown"
          title={title}
          subtitle={subtitle}
          align="center"
        />

        <div className={componentsTheme.programsActivities.cardsGrid}>
          {items.map(item => {
              const dateLabel = formatDate(item.date);
              const timeLabel = item.time_range || DATA_NOT_ADDED;
              const durationLabel = item.duration
                ? `Duration: ${item.duration}`
                : DATA_NOT_ADDED;
              const rawDay = item.day || '';

              let displayTitle = item.title || DATA_NOT_ADDED;
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
                      {item.description || DATA_NOT_ADDED}
                    </p>
                  </div>
                </article>
              );
          })}
        </div>

        <p className={componentsTheme.programsActivities.note}>
          <span className={componentsTheme.programsActivities.noteEmphasis}>
            Note:
          </span>{' '}
          This rundown is an estimation only. The final schedule will be updated closer to the program date. Please check back regularly for the most accurate information.
        </p>
      </div>
    </section>
  );
}
