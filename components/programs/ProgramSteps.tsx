import { CheckCircle2, CreditCard, Mail, Users, CalendarDays, Flag, Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import type { ProgramJourneySection } from '@/types/programs';
import { PROGRAMS_STEPS_COPY } from '@/data/programs/sections/steps/programsSteps';

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
  const title = journey?.title || PROGRAMS_STEPS_COPY.title;
  const subtitle = journey?.subtitle || PROGRAMS_STEPS_COPY.subtitleFallback;
  const items = journey?.items ?? [];

  return (
    <section className={jysSectionTheme.programsSteps.sectionWrapper}>
      <div className={jysSectionTheme.programsSteps.container}>
        <SectionHeader
          eyebrow={PROGRAMS_STEPS_COPY.eyebrow}
          title={title}
          subtitle={subtitle}
          align="center"
        />

        {/* wrapper timeline perjalanan program */}
        <div className={jysSectionTheme.programsSteps.timelineGrid}>
          {/* Garis vertikal di samping step */}
          <div className={jysSectionTheme.programsSteps.lineCol}>
            <div className={jysSectionTheme.programsSteps.line} />
          </div>

          <div className={jysSectionTheme.programsSteps.stepsCol}>
            {items.length > 0 ? (
              items.map((item, index) => {
                const iconType = inferStepIcon(item.title || '');
                const stepNumber = item.step_number || '';
                const descriptionLines = (item.description || PROGRAMS_STEPS_COPY.dataNotAdded).split(
                  /\n+/,
                );
                const dateDisplay = item.date_display || PROGRAMS_STEPS_COPY.dataNotAdded;

                return (
                  <div
                    key={`${item.step_number}-${item.title}`}
                    className={jysSectionTheme.programsSteps.stepRow}
                  >
                    {/* titik + icon di sisi kiri */}
                    <div className={jysSectionTheme.programsSteps.stepIconCol}>
                      <div className={jysSectionTheme.programsSteps.stepIconCircle}>
                        <StepIcon type={iconType} />
                      </div>
                      <span className={jysSectionTheme.programsSteps.stepLabel}>
                        Step {stepNumber || index + 1}
                      </span>
                    </div>

                    {/* konten kartu step */}
                    <div className={jysSectionTheme.programsSteps.stepCard}>
                      <h3 className={jysSectionTheme.programsSteps.stepTitle}>{item.title}</h3>
                      <p className={jysSectionTheme.programsSteps.stepLabel}>{dateDisplay}</p>
                      <ul className={jysSectionTheme.programsSteps.stepList}>
                        {descriptionLines.map(line => (
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
                );
              })
            ) : (
              <div className={jysSectionTheme.programsSteps.stepRow}>
                <div className={jysSectionTheme.programsSteps.stepIconCol}>
                  <div className={jysSectionTheme.programsSteps.stepIconCircle}>
                    <CheckCircle2 className={jysSectionTheme.programsSteps.stepIcon} />
                  </div>
                </div>
                <div className={jysSectionTheme.programsSteps.stepCard}>
                  <h3 className={jysSectionTheme.programsSteps.stepTitle}>
                    {PROGRAMS_STEPS_COPY.dataNotAdded}
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
