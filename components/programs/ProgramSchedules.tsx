import { CalendarDays } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramImportantDatesItem, ProgramImportantDatesSection } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';
import {
  formatTimelineDateLabel,
  getTimelineVisualStatus,
  sortTimelineItems,
  type TimelineVisualStatus,
} from '@/lib/format/timeline';

type ProgramSchedulesProps = {
  dates?: ProgramImportantDatesSection['content'];
};

function isMeaningfulDescription(name?: string, description?: string): boolean {
  const safeName = (name ?? '').trim().toLowerCase();
  const safeDescription = (description ?? '').trim().toLowerCase();
  if (!safeDescription) return false;
  return safeDescription !== safeName;
}

function StatusBadge({ visualStatus, label }: { visualStatus: TimelineVisualStatus; label?: string }) {
  const text = label || DATA_NOT_ADDED;
  if (visualStatus === 'active') {
    return (
      <span className={componentsTheme.programsSchedules.statusActive}>
        <span className={componentsTheme.programsSchedules.statusActiveDot} /> {text}
      </span>
    );
  }
  if (visualStatus === 'upcoming') {
    return (
      <span className={componentsTheme.programsSchedules.statusUpcoming}>
        <span className={componentsTheme.programsSchedules.statusUpcomingDot} /> {text}
      </span>
    );
  }
  return (
    <span className={componentsTheme.programsSchedules.statusClosed}>
      <span className={componentsTheme.programsSchedules.statusClosedDot} /> {text}
    </span>
  );
}

function EmptyState() {
  return (
    <div className={componentsTheme.programsSchedules.emptyState}>
      <span className={componentsTheme.programsSchedules.emptyStateIconWrapper}>
        <CalendarDays className={componentsTheme.programsSchedules.emptyStateIcon} />
      </span>
      <p className={componentsTheme.programsSchedules.emptyStateTitle}>No schedule published yet</p>
      <p className={componentsTheme.programsSchedules.emptyStateText}>
        Key dates and deadlines for this program will appear here once they are announced.
      </p>
    </div>
  );
}

function TimelineGroup({ title, items }: { title: string; items: ProgramImportantDatesItem[] }) {
  return (
    <div>
      <div className={componentsTheme.programsSchedules.groupHeader}>
        <h3 className={componentsTheme.programsSchedules.groupTitle}>{title}</h3>
        <span className={componentsTheme.programsSchedules.groupCount}>
          {items.length} schedule{items.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className={componentsTheme.programsSchedules.timelineWrapper}>
        {items.map((item, index) => {
          const visualStatus = getTimelineVisualStatus(item.status, item.is_active);
          const dateLabel = formatTimelineDateLabel(item);
          const dotClass = visualStatus === 'active'
            ? componentsTheme.programsSchedules.timelineDotActive
            : visualStatus === 'upcoming'
              ? componentsTheme.programsSchedules.timelineDotUpcoming
              : componentsTheme.programsSchedules.timelineDotClosed;
          const cardAccentClass = visualStatus === 'active'
            ? componentsTheme.programsSchedules.cardAccentActive
            : visualStatus === 'upcoming'
              ? componentsTheme.programsSchedules.cardAccentUpcoming
              : componentsTheme.programsSchedules.cardAccentClosed;
          const isLast = index === items.length - 1;

          return (
            <div key={`${item.name}-${item.date_display}-${index}`} className={componentsTheme.programsSchedules.timelineItem}>
              <div className={componentsTheme.programsSchedules.timelineMarkerCol}>
                <span className={`${componentsTheme.programsSchedules.timelineDot} ${dotClass}`} />
                {!isLast && (
                  <span className={componentsTheme.programsSchedules.timelineConnector} aria-hidden="true" />
                )}
              </div>
              <article className={`${componentsTheme.programsSchedules.card} ${cardAccentClass}`}>
                <div className={componentsTheme.programsSchedules.cardHeader}>
                  <p className={componentsTheme.programsSchedules.cardDate}>{dateLabel}</p>
                  <StatusBadge visualStatus={visualStatus} label={item.status} />
                </div>
                <h3 className={componentsTheme.programsSchedules.cardTitle}>
                  {item.name || DATA_NOT_ADDED}
                </h3>
                {isMeaningfulDescription(item.name, item.description) && (
                  <p className={componentsTheme.programsSchedules.cardDescription}>
                    {item.description}
                  </p>
                )}
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProgramSchedules({ dates }: ProgramSchedulesProps) {
  if (!dates) return null;

  const title = dates.title || 'Key dates and important deadlines';
  const subtitle = dates.subtitle || '';
  const items = dates.items ?? [];

  const active = sortTimelineItems(
    items.filter((item) => getTimelineVisualStatus(item.status, item.is_active) === 'active'),
    'asc',
  );
  const upcoming = sortTimelineItems(
    items.filter((item) => getTimelineVisualStatus(item.status, item.is_active) === 'upcoming'),
    'asc',
  );
  const completed = sortTimelineItems(
    items.filter((item) => getTimelineVisualStatus(item.status, item.is_active) === 'closed'),
    'desc',
  );

  const sections = [
    { key: 'active', title: 'Active now', items: active },
    { key: 'upcoming', title: 'Upcoming', items: upcoming },
    { key: 'completed', title: 'Completed', items: completed },
  ].filter((section) => section.items.length > 0);

  return (
    <section className={componentsTheme.programsSchedules.sectionWrapper}>
      <div className={componentsTheme.programsSchedules.container}>
        <SectionHeader
          eyebrow="Program Schedules"
          title={title}
          subtitle={subtitle}
          align="center"
        />

        {sections.length > 0 ? (
          <div className={componentsTheme.programsSchedules.listWrapper}>
            {sections.map((section) => (
              <TimelineGroup key={section.key} title={section.title} items={section.items} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        <p className={componentsTheme.programsSchedules.note}>
          <span className={componentsTheme.programsSchedules.noteEmphasis}>
            Important:
          </span>{' '}
          All dates and deadlines are subject to change. Please check this page regularly for the most up-to-date information.
        </p>
      </div>
    </section>
  );
}
