import { CheckCircle2, CreditCard, Mail, Users, CalendarDays, Flag, Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramJourneySection } from '@/types/programs';
import { DATA_NOT_ADDED } from '@/lib/constants/ui';

type ProgramStepsProps = {
  journey?: ProgramJourneySection['content'];
};

type StepIconType =
  | 'registration'
  | 'announcement'
  | 'onboarding'
  | 'payment'
  | 'mentoring'
  | 'funded'
  | 'program';

function StepIcon({ type }: { type: StepIconType }) {
  switch (type) {
    case 'registration':
      return <CreditCard className={componentsTheme.programsSteps.stepIcon} />;
    case 'announcement':
      return <Mail className={componentsTheme.programsSteps.stepIcon} />;
    case 'onboarding':
      return <Users className={componentsTheme.programsSteps.stepIcon} />;
    case 'payment':
      return <CreditCard className={componentsTheme.programsSteps.stepIcon} />;
    case 'mentoring':
      return <Star className={componentsTheme.programsSteps.stepIcon} />;
    case 'funded':
      return <Flag className={componentsTheme.programsSteps.stepIcon} />;
    case 'program':
      return <CalendarDays className={componentsTheme.programsSteps.stepIcon} />;
    default:
      return <CheckCircle2 className={componentsTheme.programsSteps.stepIcon} />;
  }
}

function inferStepIcon(title: string): StepIconType {
  const lower = title.toLowerCase();
  if (lower.includes('registration')) return 'registration';
  if (lower.includes('loa')) return 'announcement';
  if (lower.includes('on boarding') || lower.includes('onboarding')) return 'onboarding';
  if (lower.includes('payment')) return 'payment';
  if (lower.includes('mentoring')) return 'mentoring';
  if (lower.includes('funded')) return 'funded';
  if (lower.includes('summit') || lower.includes('program')) return 'program';
  return 'program';
}

export default function ProgramSteps({ journey }: ProgramStepsProps) {
  if (!journey) return null;

  const title = journey.title || 'What steps will you go through in this program?';
  const subtitle = journey.subtitle || '';
  const items = journey.items ?? [];

  return (
    <section className={componentsTheme.programsSteps.sectionWrapper}>
      <div className={componentsTheme.programsSteps.container}>
        <SectionHeader
          eyebrow="Program Journey"
          title={title}
          subtitle={subtitle}
          align="center"
        />

        {/* wrapper timeline perjalanan program */}
        <div className={componentsTheme.programsSteps.timelineGrid}>
          {/* Garis vertikal di samping step */}
          <div className={componentsTheme.programsSteps.lineCol}>
            <div className={componentsTheme.programsSteps.line} />
          </div>

          <div className={componentsTheme.programsSteps.stepsCol}>
            {items.length > 0 ? (
              items.map((item, index) => {
                const iconType = inferStepIcon(item.title || '');
                const stepNumber = item.step_number || '';
                const descriptionLines = (item.description || DATA_NOT_ADDED).split(
                  /\n+/,
                );
                const dateDisplay = item.date_display || DATA_NOT_ADDED;

                return (
                  <div
                    key={`${item.step_number}-${item.title}`}
                    className={componentsTheme.programsSteps.stepRow}
                  >
                    {/* titik + icon di sisi kiri */}
                    <div className={componentsTheme.programsSteps.stepIconCol}>
                      <div className={componentsTheme.programsSteps.stepIconCircle}>
                        <StepIcon type={iconType} />
                      </div>
                      <span className={componentsTheme.programsSteps.stepLabel}>
                        Step {stepNumber || index + 1}
                      </span>
                    </div>

                    {/* konten kartu step */}
                    <div className={componentsTheme.programsSteps.stepCard}>
                      <h3 className={componentsTheme.programsSteps.stepTitle}>{item.title}</h3>
                      <p className={componentsTheme.programsSteps.stepLabel}>{dateDisplay}</p>
                      <ul className={componentsTheme.programsSteps.stepList}>
                        {descriptionLines.map(line => (
                          <li key={line} className={componentsTheme.programsSteps.stepListItem}>
                            <span className={componentsTheme.programsSteps.stepListBulletIcon}>
                              <CheckCircle2
                                className={componentsTheme.programsSteps.stepListBulletIconInner}
                              />
                            </span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={componentsTheme.programsSteps.stepRow}>
                <div className={componentsTheme.programsSteps.stepIconCol}>
                  <div className={componentsTheme.programsSteps.stepIconCircle}>
                    <CheckCircle2 className={componentsTheme.programsSteps.stepIcon} />
                  </div>
                </div>
                <div className={componentsTheme.programsSteps.stepCard}>
                  <h3 className={componentsTheme.programsSteps.stepTitle}>
                    {DATA_NOT_ADDED}
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
