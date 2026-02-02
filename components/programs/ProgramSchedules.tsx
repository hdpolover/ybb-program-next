import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
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
  const text = label || 'Data not added';
  if (visualStatus === 'active') {
    return (
      <span className={jysSectionTheme.programsSchedules.statusActive}>
        <span className={jysSectionTheme.programsSchedules.statusActiveDot} /> {text}
      </span>
    );
  }
  if (visualStatus === 'upcoming') {
    return (
      <span className={jysSectionTheme.programsSchedules.statusUpcoming}>
        <span className={jysSectionTheme.programsSchedules.statusUpcomingDot} /> {text}
      </span>
    );
  }
  return (
    <span className={jysSectionTheme.programsSchedules.statusClosed}>
      <span className={jysSectionTheme.programsSchedules.statusClosedDot} /> {text}
    </span>
  );
}

export default function ProgramSchedules({ dates }: ProgramSchedulesProps) {
  const title = dates?.title || PROGRAMS_SCHEDULES_COPY.headerTitle;
  const subtitle = dates?.subtitle || PROGRAMS_SCHEDULES_COPY.headerSubtitleFallback;
  const items = dates?.items ?? [];

  return (
    <section className={jysSectionTheme.programsSchedules.sectionWrapper}>
      <div className={jysSectionTheme.programsSchedules.container}>
        <SectionHeader
          eyebrow={PROGRAMS_SCHEDULES_COPY.headerEyebrow}
          title={title}
          subtitle={subtitle}
          align="center"
        />

        <div className={jysSectionTheme.programsSchedules.tableWrapper}>
          <div className={jysSectionTheme.programsSchedules.tableInner}>
            <table className={jysSectionTheme.programsSchedules.table}>
              <thead className={jysSectionTheme.programsSchedules.thead}>
                <tr className={jysSectionTheme.programsSchedules.headerRow}>
                  <th scope="col" className={jysSectionTheme.programsSchedules.headerCell}>
                    {PROGRAMS_SCHEDULES_COPY.columnDateRange}
                  </th>
                  <th scope="col" className={jysSectionTheme.programsSchedules.headerCell}>
                    {PROGRAMS_SCHEDULES_COPY.columnStatus}
                  </th>
                  <th scope="col" className={jysSectionTheme.programsSchedules.headerCell}>
                    {PROGRAMS_SCHEDULES_COPY.columnName}
                  </th>
                  <th scope="col" className={jysSectionTheme.programsSchedules.headerCell}>
                    {PROGRAMS_SCHEDULES_COPY.columnDescription}
                  </th>
                </tr>
              </thead>
              <tbody className={jysSectionTheme.programsSchedules.body}>
                {items.length > 0 ? (
                  items.map(item => {
                    const visualStatus = mapStatus(item.status, item.is_active);
                    const descriptionLines = (item.description || PROGRAMS_SCHEDULES_COPY.dataNotAdded).split(/\n+/);
                    return (
                      <tr key={item.name} className={jysSectionTheme.programsSchedules.row}>
                        <td className={jysSectionTheme.programsSchedules.cellDate}>
                          {item.date_display || PROGRAMS_SCHEDULES_COPY.dataNotAdded}
                        </td>
                        <td className={jysSectionTheme.programsSchedules.cellStatus}>
                          <StatusBadge visualStatus={visualStatus} label={item.status} />
                        </td>
                        <td className={jysSectionTheme.programsSchedules.cellName}>
                          {item.name || PROGRAMS_SCHEDULES_COPY.dataNotAdded}
                        </td>
                        <td className={jysSectionTheme.programsSchedules.cellDesc}>
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
                  <tr className={jysSectionTheme.programsSchedules.row}>
                    <td
                      className={jysSectionTheme.programsSchedules.cellDesc}
                      colSpan={4}
                    >
                      Data not added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className={jysSectionTheme.programsSchedules.note}>
          <span className={jysSectionTheme.programsSchedules.noteEmphasis}>
            {PROGRAMS_SCHEDULES_COPY.notePrefix}
          </span>{' '}
          {PROGRAMS_SCHEDULES_COPY.noteBody}
        </p>
      </div>
    </section>
  );
}
