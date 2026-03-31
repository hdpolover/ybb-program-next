import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

const steps = [
  {
    number: '01',
    title: 'Choose Your Partnership',
    description:
      "Select a partnership package that aligns with your organization's goals and values.",
  },
  {
    number: '02',
    title: 'Align & Confirm',
    description:
      'We discuss objectives, scope, and collaboration details to ensure a shared vision.',
  },
  {
    number: '03',
    title: 'Activate the Partnership',
    description:
      'Partnership activities are implemented through YBB programs, events, and campaigns.',
  },
  {
    number: '04',
    title: 'Track Impact & Growth',
    description:
      'Receive regular updates, impact reports, and insights for long-term collaboration.',
  },
];

export default function PartnershipJourneySection() {
  return (
    <section className={componentsTheme.partnersJourney.sectionWrapper}>
      <div className={componentsTheme.partnersJourney.container}>
        <SectionHeader eyebrow="How It Works" title="Start Your Partnership Journey with us!" />

        <div className={componentsTheme.partnersJourney.grid}>
          {steps.map(step => (
            <div key={step.number} className={componentsTheme.partnersJourney.card}>
              <span className={componentsTheme.partnersJourney.number}>{step.number}</span>
              <h3 className={componentsTheme.partnersJourney.title}>{step.title}</h3>
              <p className={componentsTheme.partnersJourney.description}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
