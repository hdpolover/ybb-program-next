import { Calendar, Clock3, Hourglass, Check, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramActivitiesSection, ProgramActivitiesItem } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';
import { parseApiDate } from '@/lib/utils';

type ProgramActivitiesProps = {
  activities?: ProgramActivitiesSection['content'];
};

type ActivityGroup = {
  key: string;
  sortTime: number;
  dateLabel: string;
  dayHint: string | null;
  items: ProgramActivitiesItem[];
};

function parseDateValue(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = parseApiDate(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateForMeta(date: string | null | undefined): string {
  const parsed = parseDateValue(date);
  if (!parsed) return DATA_NOT_ADDED;
  return parsed.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateForGroup(date: string | null | undefined): string {
  const parsed = parseDateValue(date);
  if (!parsed) return DATA_NOT_ADDED;
  return parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatClockToken(value: string): string {
  const normalized = value.trim();
  const match = normalized.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return normalized;

  const rawHour = Number(match[1]);
  const minutes = match[2];
  if (!Number.isFinite(rawHour) || rawHour < 0 || rawHour > 23) return normalized;

  const suffix = rawHour >= 12 ? 'PM' : 'AM';
  const hour = ((rawHour + 11) % 12) + 1;
  return `${hour}:${minutes} ${suffix}`;
}

function formatTimeRange(value: string | null | undefined): string {
  const raw = (value ?? '').trim();
  if (!raw) return DATA_NOT_ADDED;

  const tokens = raw.split(/\s*[-–]\s*/).map((token) => token.trim()).filter(Boolean);
  if (tokens.length === 2) {
    return `${formatClockToken(tokens[0])} – ${formatClockToken(tokens[1])}`;
  }
  return formatClockToken(raw);
}

function parseStartMinutes(value: string | null | undefined): number {
  const raw = (value ?? '').trim();
  if (!raw) return Number.MAX_SAFE_INTEGER;
  const [first] = raw.split(/\s*[-–]\s*/);
  const match = first.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number(match[1]) * 60 + Number(match[2]);
}

function extractDayHint(item: ProgramActivitiesItem): string | null {
  const fromDay = (item.day ?? '').match(/day\s*\d+/i)?.[0];
  if (fromDay) {
    return fromDay.replace(/day\s*(\d+)/i, 'Day $1');
  }

  const fromTitle = (item.title ?? '').match(/day\s*\d+/i)?.[0];
  if (fromTitle) {
    return fromTitle.replace(/day\s*(\d+)/i, 'Day $1');
  }

  const rawDay = (item.day ?? '').trim();
  if (rawDay && !/^\d{4}-\d{2}-\d{2}$/.test(rawDay)) {
    return rawDay;
  }

  return null;
}

function normalizeTitle(item: ProgramActivitiesItem): string {
  const rawTitle = (item.title ?? '').trim();
  if (!rawTitle) return DATA_NOT_ADDED;

  return rawTitle
    .replace(/^\d{4}-\d{2}-\d{2}\s*:\s*/i, '')
    .replace(/^day\s*\d+\s*:\s*/i, '')
    .trim() || DATA_NOT_ADDED;
}

function buildGroups(items: ProgramActivitiesItem[]): ActivityGroup[] {
  const groupMap = new Map<string, ActivityGroup>();

  items.forEach((item, index) => {
    const parsedDate = parseDateValue(item.date);
    const dateKey = parsedDate ? parsedDate.toISOString().slice(0, 10) : `misc-${index}`;
    const groupKey = `group-${dateKey}`;
    const dayHint = extractDayHint(item);

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, {
        key: groupKey,
        sortTime: parsedDate ? parsedDate.getTime() : Number.MAX_SAFE_INTEGER + index,
        dateLabel: formatDateForGroup(item.date),
        dayHint,
        items: [],
      });
    }

    const group = groupMap.get(groupKey)!;
    if (!group.dayHint && dayHint) {
      group.dayHint = dayHint;
    }
    group.items.push(item);
  });

  const sortedGroups = [...groupMap.values()].sort((a, b) => a.sortTime - b.sortTime);
  sortedGroups.forEach((group) => {
    group.items.sort((a, b) => parseStartMinutes(a.time_range) - parseStartMinutes(b.time_range));
  });

  return sortedGroups;
}

export default function ProgramActivities({ activities }: ProgramActivitiesProps) {
  if (!activities) return null;

  const title = activities.title || 'Program Activities';
  const subtitle = activities.subtitle || '';
  const items = activities.items ?? [];
  if (items.length === 0) return null;

  const groupedActivities = buildGroups(items);

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

        <div className="mt-8 space-y-8">
          {groupedActivities.map((group, groupIndex) => {
            const dayLabel = group.dayHint || `Day ${groupIndex + 1}`;
            const heading = group.dateLabel === DATA_NOT_ADDED
              ? dayLabel
              : `${dayLabel} · ${group.dateLabel}`;

            return (
              <div key={group.key} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{heading}</h3>
                {/* Swipe indicator for mobile */}
                {group.items.length > 1 && (
                  <p className="flex items-center justify-end gap-1 text-xs font-medium text-slate-500 sm:hidden">
                    Swipe for more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                )}
                <div className={componentsTheme.programsActivities.cardsGrid}>
                  {group.items.map((item, itemIndex) => {
                    const dateLabel = formatDateForMeta(item.date);
                    const timeLabel = formatTimeRange(item.time_range);
                    const durationLabel = item.duration
                      ? `Duration: ${item.duration}`
                      : DATA_NOT_ADDED;
                    const displayTitle = normalizeTitle(item);

                    return (
                      <article
                        key={`${group.key}-${displayTitle}-${itemIndex}`}
                        className={componentsTheme.programsActivities.card}
                      >
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

                        <div className={componentsTheme.programsActivities.titleWrapper}>
                          <h4 className={componentsTheme.programsActivities.title}>{displayTitle}</h4>

                          {item.checklist.length > 0 && (
                            <div className={componentsTheme.programsActivities.bulletsGrid}>
                              {item.checklist.map((check) => (
                                <div key={check} className={componentsTheme.programsActivities.bulletRow}>
                                  <span className={componentsTheme.programsActivities.bulletIconWrapper}>
                                    <Check className={componentsTheme.programsActivities.bulletIcon} />
                                  </span>
                                  <span>{check}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <p className={componentsTheme.programsActivities.description}>
                            {item.description || DATA_NOT_ADDED}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
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

