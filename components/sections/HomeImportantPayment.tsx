import { AlertTriangle, CalendarCheck, Users2, BadgeCheck, RefreshCw } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { HOME_IMPORTANT_PAYMENT_CONTENT } from '@/data/home/sections/important-payment/homeImportantPayment';

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

export default function HomeImportantPayment() {
  const content = HOME_IMPORTANT_PAYMENT_CONTENT;

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
