import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramImportantDatesSection } from '@/types/programs';
import { PROGRAMS_SCHEDULES_COPY } from '@/data/programs/sections/schedules-info/programsSchedulesInfo';

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

function StatusBadge({ visualStatus, label }: { visualStatus: VisualStatus; label?: string }) {
  const text = label || PROGRAMS_SCHEDULES_COPY.dataNotAdded;
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
  const title = dates?.title || PROGRAMS_SCHEDULES_COPY.headerTitle;
  const subtitle = dates?.subtitle || PROGRAMS_SCHEDULES_COPY.headerSubtitleFallback;
  const items = dates?.items ?? [];

  return (
    <section className={componentsTheme.programsSchedules.sectionWrapper}>
      <div className={componentsTheme.programsSchedules.container}>
        <SectionHeader
          eyebrow={PROGRAMS_SCHEDULES_COPY.headerEyebrow}
          title={title}
          subtitle={subtitle}
          align="center"
        />

        <div className={componentsTheme.programsSchedules.tableWrapper}>
          <div className={componentsTheme.programsSchedules.tableInner}>
            <table className={componentsTheme.programsSchedules.table}>
              <thead className={componentsTheme.programsSchedules.thead}>
                <tr className={componentsTheme.programsSchedules.headerRow}>
                  <th scope="col" className={componentsTheme.programsSchedules.headerCell}>
                    {PROGRAMS_SCHEDULES_COPY.columnDateRange}
                  </th>
                  <th scope="col" className={componentsTheme.programsSchedules.headerCell}>
                    {PROGRAMS_SCHEDULES_COPY.columnStatus}
                  </th>
                  <th scope="col" className={componentsTheme.programsSchedules.headerCell}>
                    {PROGRAMS_SCHEDULES_COPY.columnName}
                  </th>
                  <th scope="col" className={componentsTheme.programsSchedules.headerCell}>
                    {PROGRAMS_SCHEDULES_COPY.columnDescription}
                  </th>
                </tr>
              </thead>
              <tbody className={componentsTheme.programsSchedules.body}>
                {items.length > 0 ? (
                  items.map(item => {
                    const visualStatus = mapStatus(item.status, item.is_active);
                    const descriptionLines = (item.description || PROGRAMS_SCHEDULES_COPY.dataNotAdded).split(/\n+/);
                    return (
                      <tr key={item.name} className={componentsTheme.programsSchedules.row}>
                        <td className={componentsTheme.programsSchedules.cellDate}>
                          {item.date_display || PROGRAMS_SCHEDULES_COPY.dataNotAdded}
                        </td>
                        <td className={componentsTheme.programsSchedules.cellStatus}>
                          <StatusBadge visualStatus={visualStatus} label={item.status} />
                        </td>
                        <td className={componentsTheme.programsSchedules.cellName}>
                          {item.name || PROGRAMS_SCHEDULES_COPY.dataNotAdded}
                        </td>
                        <td className={componentsTheme.programsSchedules.cellDesc}>
                          {descriptionLines.map(line => (
                            <span key={line} className="block">
                              {line}
                            </span>
                          ))}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className={componentsTheme.programsSchedules.row}>
                    <td
                      className={componentsTheme.programsSchedules.cellDesc}
                      colSpan={4}
                    >
                      {PROGRAMS_SCHEDULES_COPY.dataNotAdded}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className={componentsTheme.programsSchedules.note}>
          <span className={componentsTheme.programsSchedules.noteEmphasis}>
            {PROGRAMS_SCHEDULES_COPY.notePrefix}
          </span>{' '}
          {PROGRAMS_SCHEDULES_COPY.noteBody}
        </p>
      </div>
    </section>
  );
}
