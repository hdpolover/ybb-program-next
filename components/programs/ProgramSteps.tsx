import { CheckCircle2, CreditCard, Mail, Users, CalendarDays, Flag, Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

interface Step {
  id: number;
  title: string;
  icon:
    | 'registration'
    | 'announcement'
    | 'onboarding'
    | 'payment'
    | 'mentoring'
    | 'funded'
    | 'program';
  lines: string[];
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Participant Registration',
    icon: 'registration',
    lines: [
      'Register an account and complete the registration form including payment.',
      'Registration Fee:',
      'Initial Stage: 10 USD / Rp167,500',
      'Final Stage: 15 USD / Rp247,500',
      'Program Fee: 660 USD / Rp11,500,000',
      'First Installment: 330 USD / Rp5,000,000',
      'Second Installment: 400 USD / Rp6,500,000',
    ],
  },
  {
    id: 2,
    title: 'LoA Announcement',
    icon: 'announcement',
    lines: ['Check your email and Instagram for more information.'],
  },
  {
    id: 3,
    title: 'Onboarding Session',
    icon: 'onboarding',
    lines: ['The date of the onboarding session will be confirmed via email.'],
  },
  {
    id: 4,
    title: 'First Payment',
    icon: 'payment',
    lines: [
      'Program fees are available when the payment period begins and after you complete the registration fee.',
      'Program Fee: 660 USD / Rp11,500,000',
      'First Installment: 330 USD / Rp5,000,000',
    ],
  },
  {
    id: 5,
    title: 'Mentoring',
    icon: 'mentoring',
    lines: ['Participants will receive mentoring after the first stage of payment.'],
  },
  {
    id: 6,
    title: 'Second Payment',
    icon: 'payment',
    lines: [
      'Participants must complete the second installment after the mentoring session to proceed.',
      'Program Fee: 660 USD / Rp11,500,000',
      'Second Installment: 400 USD / Rp6,500,000',
    ],
  },
  {
    id: 7,
    title: 'Fully Funded Candidate Interview Announcement',
    icon: 'funded',
    lines: ['Selected fully funded candidates are invited to attend the interview stage.'],
  },
  {
    id: 8,
    title: 'Interview Fully Funded Candidates',
    icon: 'funded',
    lines: ['Interview session for shortlisted fully funded candidates.'],
  },
  {
    id: 9,
    title: 'Final Announcement of Fully Funded Candidates',
    icon: 'funded',
    lines: ['Final results for fully funded candidates who have been selected.'],
  },
  {
    id: 10,
    title: 'Japan Youth Summit Program',
    icon: 'program',
    lines: [
      'The Japan Youth Summit program will take place on February 2 - 5, 2026, in Osaka & Kyoto, Japan.',
    ],
  },
];

function StepIcon({ type }: { type: Step['icon'] }) {
  switch (type) {
    case 'registration':
      return <CreditCard className={jysSectionTheme.programsSteps.stepIcon} />;
    case 'announcement':
      return <Mail className={jysSectionTheme.programsSteps.stepIcon} />;
    case 'onboarding':
      return <Users className={jysSectionTheme.programsSteps.stepIcon} />;
    case 'payment':
      return <CreditCard className={jysSectionTheme.programsSteps.stepIcon} />;
    case 'mentoring':
      return <Star className={jysSectionTheme.programsSteps.stepIcon} />;
    case 'funded':
      return <Flag className={jysSectionTheme.programsSteps.stepIcon} />;
    case 'program':
      return <CalendarDays className={jysSectionTheme.programsSteps.stepIcon} />;
    default:
      return <CheckCircle2 className={jysSectionTheme.programsSteps.stepIcon} />;
  }
}

export default function ProgramSteps() {
  return (
    <section className={jysSectionTheme.programsSteps.sectionWrapper}>
      <div className={jysSectionTheme.programsSteps.container}>
        <SectionHeader
          eyebrow="Program Journey"
          title="What steps will you go through in this program?"
          align="center"
        />

        {/* Timeline wrapper */}
        <div className={jysSectionTheme.programsSteps.timelineGrid}>
          {/* Vertical line */}
          <div className={jysSectionTheme.programsSteps.lineCol}>
            <div className={jysSectionTheme.programsSteps.line} />
          </div>

          <div className={jysSectionTheme.programsSteps.stepsCol}>
            {STEPS.map(step => (
              <div key={step.id} className={jysSectionTheme.programsSteps.stepRow}>
                {/* Dot + icon */}
                <div className={jysSectionTheme.programsSteps.stepIconCol}>
                  <div className={jysSectionTheme.programsSteps.stepIconCircle}>
                    <StepIcon type={step.icon} />
                  </div>
                  <span className={jysSectionTheme.programsSteps.stepLabel}>Step {step.id}</span>
                </div>

                {/* Content */}
                <div className={jysSectionTheme.programsSteps.stepCard}>
                  <h3 className={jysSectionTheme.programsSteps.stepTitle}>{step.title}</h3>
                  <ul className={jysSectionTheme.programsSteps.stepList}>
                    {step.lines.map(line => (
                      <li key={line} className={jysSectionTheme.programsSteps.stepListItem}>
                        <span className={jysSectionTheme.programsSteps.stepListBulletIcon}>
                          <CheckCircle2
                            className={jysSectionTheme.programsSteps.stepListBulletIconInner}
                          />
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
