import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramImportantDatesSection } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';
import { parseApiDate } from '@/lib/utils';

type VisualStatus = 'active' | 'upcoming' | 'closed';

type ProgramSchedulesProps = {
  dates?: ProgramImportantDatesSection['content'];
};

function mapStatus(status?: string, isActive?: boolean): VisualStatus {
  const s = status?.toLowerCase() ?? '';
  if (isActive) return 'active';
  if (s === 'upcoming') return 'upcoming';
  if (s === 'active' || s === 'ongoing') return 'active';
  return 'closed';
}

function normalizeDateToken(value: string): string {
  const parsed = parseApiDate(value.trim());
  if (Number.isNaN(parsed.getTime())) {
    return value.trim();
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function formatDateDisplay(value?: string): string {
  const raw = (value ?? '').trim();
  if (!raw) return DATA_NOT_ADDED;

  const parts = raw.split(/\s*[-–]\s*/).map((part) => part.trim()).filter(Boolean);
  if (parts.length === 2) {
    return `${normalizeDateToken(parts[0])} – ${normalizeDateToken(parts[1])}`;
  }

  return normalizeDateToken(raw);
}

function getStartTimestamp(value?: string): number {
  const raw = (value ?? '').trim();
  if (!raw) return Number.MAX_SAFE_INTEGER;
  const [first] = raw.split(/\s*[-–]\s*/);
  const parsed = parseApiDate(first.trim());
  if (Number.isNaN(parsed.getTime())) return Number.MAX_SAFE_INTEGER;
  return parsed.getTime();
}

function isMeaningfulDescription(name?: string, description?: string): boolean {
  const safeName = (name ?? '').trim().toLowerCase();
  const safeDescription = (description ?? '').trim().toLowerCase();
  if (!safeDescription) return false;
  return safeDescription !== safeName;
}

function StatusBadge({ visualStatus, label }: { visualStatus: VisualStatus; label?: string }) {
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

export default function ProgramSchedules({ dates }: ProgramSchedulesProps) {
  if (!dates) return null;

  const title = dates.title || 'Key dates and important deadlines';
  const subtitle = dates.subtitle || '';
  const items = dates.items ?? [];
  if (items.length === 0) return null;

  const active = items
    .filter((item) => mapStatus(item.status, item.is_active) === 'active')
    .sort((a, b) => getStartTimestamp(a.date_display) - getStartTimestamp(b.date_display));
  const upcoming = items
    .filter((item) => mapStatus(item.status, item.is_active) === 'upcoming')
    .sort((a, b) => getStartTimestamp(a.date_display) - getStartTimestamp(b.date_display));
  const completed = items
    .filter((item) => mapStatus(item.status, item.is_active) === 'closed')
    .sort((a, b) => getStartTimestamp(b.date_display) - getStartTimestamp(a.date_display));

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

        <div className={componentsTheme.programsSchedules.listWrapper}>
          {sections.map((section) => (
            <div key={section.key}>
              <div className={componentsTheme.programsSchedules.groupHeader}>
                <h3 className={componentsTheme.programsSchedules.groupTitle}>{section.title}</h3>
                <span className={componentsTheme.programsSchedules.groupCount}>
                  {section.items.length} schedule{section.items.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className={componentsTheme.programsSchedules.timelineWrapper}>
                {section.items.map((item) => {
                  const visualStatus = mapStatus(item.status, item.is_active);
                  const dateLabel = formatDateDisplay(item.date_display);
                  const dotClass = visualStatus === 'active'
                    ? componentsTheme.programsSchedules.timelineDotActive
                    : visualStatus === 'upcoming'
                      ? componentsTheme.programsSchedules.timelineDotUpcoming
                      : componentsTheme.programsSchedules.timelineDotClosed;

                  return (
                    <div key={`${item.name}-${item.date_display}`} className={componentsTheme.programsSchedules.timelineItem}>
                      <span className={`${componentsTheme.programsSchedules.timelineDot} ${dotClass}`} />
                      <article className={componentsTheme.programsSchedules.card}>
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
          ))}
        </div>

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

