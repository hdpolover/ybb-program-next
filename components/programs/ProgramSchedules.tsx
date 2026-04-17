import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramImportantDatesSection } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

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

  return (
    <section className={componentsTheme.programsSchedules.sectionWrapper}>
      <div className={componentsTheme.programsSchedules.container}>
        <SectionHeader
          eyebrow="Program Schedules"
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
                    Date Range
                  </th>
                  <th scope="col" className={componentsTheme.programsSchedules.headerCell}>
                    Status
                  </th>
                  <th scope="col" className={componentsTheme.programsSchedules.headerCell}>
                    Schedule Name
                  </th>
                  <th scope="col" className={componentsTheme.programsSchedules.headerCell}>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className={componentsTheme.programsSchedules.body}>
                {items.map(item => {
                    const visualStatus = mapStatus(item.status, item.is_active);
                    const descriptionLines = (item.description || DATA_NOT_ADDED).split(/\n+/);
                    return (
                      <tr key={item.name} className={componentsTheme.programsSchedules.row}>
                        <td className={componentsTheme.programsSchedules.cellDate}>
                          {item.date_display || DATA_NOT_ADDED}
                        </td>
                        <td className={componentsTheme.programsSchedules.cellStatus}>
                          <StatusBadge visualStatus={visualStatus} label={item.status} />
                        </td>
                        <td className={componentsTheme.programsSchedules.cellName}>
                          {item.name || DATA_NOT_ADDED}
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
                  })}
              </tbody>
            </table>
          </div>
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
