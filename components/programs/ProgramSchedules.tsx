import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

interface ScheduleItem {
  dateRange: string;
  status: 'active' | 'upcoming' | 'closed';
  name: string;
  description: string;
}

const SCHEDULES: ScheduleItem[] = [
  {
    dateRange: 'Aug 01, 2025 – Sep 30, 2025',
    status: 'closed',
    name: 'Participant Registration (Fully Funded)',
    description: 'Registration period for fully funded applicants.',
  },
  {
    dateRange: 'Oct 26, 2025 – Jan 02, 2026',
    status: 'active',
    name: 'Participant Registration (Self Funded)',
    description: 'Self funded registration period for delegates.',
  },
  {
    dateRange: 'Early Jan 2026',
    status: 'upcoming',
    name: 'LoA Announcement',
    description:
      'Letters of Acceptance (LoA) sent to selected participants via email and social media.',
  },
  {
    dateRange: 'Mid Jan 2026',
    status: 'upcoming',
    name: 'Onboarding Session',
    description: 'Online onboarding and briefing session for all confirmed delegates.',
  },
  {
    dateRange: 'Mid Jan 2026',
    status: 'upcoming',
    name: 'First Program Payment',
    description: 'First installment payment window after registration fee is completed.',
  },
  {
    dateRange: 'Late Jan 2026',
    status: 'upcoming',
    name: 'Mentoring Session',
    description: 'Mentoring sessions for participants after the first installment is paid.',
  },
  {
    dateRange: 'Late Jan 2026',
    status: 'upcoming',
    name: 'Second Program Payment',
    description: 'Second installment payment window to complete the total program fee.',
  },
  {
    dateRange: 'Late Jan 2026',
    status: 'upcoming',
    name: 'Fully Funded Candidate Interview Announcement',
    description:
      'Announcement of shortlisted fully funded candidates invited to the interview stage.',
  },
  {
    dateRange: 'Late Jan 2026',
    status: 'upcoming',
    name: 'Interview for Fully Funded Candidates',
    description: 'Interview sessions for shortlisted fully funded applicants.',
  },
  {
    dateRange: 'Late Jan 2026',
    status: 'upcoming',
    name: 'Final Announcement of Fully Funded Candidates',
    description: 'Final results of fully funded candidates published by the organizing committee.',
  },
  {
    dateRange: 'Feb 02, 2026 – Feb 05, 2026',
    status: 'upcoming',
    name: 'Japan Youth Summit 2026 Program Days',
    description: 'On-site program activities in Osaka & Kyoto, Japan.',
  },
];

function StatusBadge({ status }: { status: ScheduleItem['status'] }) {
  if (status === 'active') {
    return (
      <span className={jysSectionTheme.programsSchedules.statusActive}>
        <span className={jysSectionTheme.programsSchedules.statusActiveDot} /> Active
      </span>
    );
  }
  if (status === 'upcoming') {
    return (
      <span className={jysSectionTheme.programsSchedules.statusUpcoming}>
        <span className={jysSectionTheme.programsSchedules.statusUpcomingDot} /> Upcoming
      </span>
    );
  }
  return (
    <span className={jysSectionTheme.programsSchedules.statusClosed}>
      <span className={jysSectionTheme.programsSchedules.statusClosedDot} /> Closed
    </span>
  );
}

export default function ProgramSchedules() {
  return (
    <section className={jysSectionTheme.programsSchedules.sectionWrapper}>
      <div className={jysSectionTheme.programsSchedules.container}>
        <SectionHeader
          eyebrow="Program Schedules"
          title="Key dates and important deadlines"
          align="center"
        />

        <div className={jysSectionTheme.programsSchedules.tableWrapper}>
          <div className={jysSectionTheme.programsSchedules.tableInner}>
            <table className={jysSectionTheme.programsSchedules.table}>
              <thead className={jysSectionTheme.programsSchedules.thead}>
                <tr className={jysSectionTheme.programsSchedules.headerRow}>
                  <th scope="col" className={jysSectionTheme.programsSchedules.headerCell}>
                    Date Range
                  </th>
                  <th scope="col" className={jysSectionTheme.programsSchedules.headerCell}>
                    Status
                  </th>
                  <th scope="col" className={jysSectionTheme.programsSchedules.headerCell}>
                    Schedule Name
                  </th>
                  <th scope="col" className={jysSectionTheme.programsSchedules.headerCell}>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className={jysSectionTheme.programsSchedules.body}>
                {SCHEDULES.map(row => (
                  <tr key={row.name} className={jysSectionTheme.programsSchedules.row}>
                    <td className={jysSectionTheme.programsSchedules.cellDate}>{row.dateRange}</td>
                    <td className={jysSectionTheme.programsSchedules.cellStatus}>
                      <StatusBadge status={row.status} />
                    </td>
                    <td className={jysSectionTheme.programsSchedules.cellName}>{row.name}</td>
                    <td className={jysSectionTheme.programsSchedules.cellDesc}>
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className={jysSectionTheme.programsSchedules.note}>
          <span className={jysSectionTheme.programsSchedules.noteEmphasis}>Important:</span> All
          dates and deadlines are subject to change. Please check this page regularly for the most
          up-to-date information.
        </p>
      </div>
    </section>
  );
}
