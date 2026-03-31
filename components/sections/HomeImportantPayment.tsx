import { AlertTriangle, CalendarCheck, Users2, BadgeCheck, RefreshCw } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { PaymentInfoSection } from '@/types/home';

function renderIcon(iconKey: string) {
  switch (iconKey) {
    case 'payment_schedule':
      return <CalendarCheck className="h-6 w-6" />;
    case 'selection_quota':
      return <Users2 className="h-6 w-6" />;
    case 'fully_funded_process':
      return <BadgeCheck className="h-6 w-6" />;
    case 'self_funded_guarantee':
      return <RefreshCw className="h-6 w-6" />;
    default:
      return <CalendarCheck className="h-6 w-6" />;
  }
}

interface Props {
  section?: PaymentInfoSection;
}

export default function HomeImportantPayment({ section }: Props) {
  if (!section) return null;

  const content = section.content;

  return (
    <section className={componentsTheme.homeImportantPayment.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
        />
        <p className={componentsTheme.homeImportantPayment.introText}>{content.introText}</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map(item => (
            <div key={item.id} className={componentsTheme.homeImportantPayment.card}>
              <div className={componentsTheme.homeImportantPayment.iconCircle}>
                {renderIcon(item.icon)}
              </div>
              <h3 className={componentsTheme.homeImportantPayment.cardTitle}>{item.title}</h3>
              <p className={componentsTheme.homeImportantPayment.cardBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <div className={componentsTheme.homeImportantPayment.noteBar}>
          <AlertTriangle className={componentsTheme.homeImportantPayment.noteIcon} />
          <p className="text-xs sm:text-sm">
            {content.note}
          </p>
        </div>
      </div>
    </section>
  );
}
