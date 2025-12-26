import { AlertTriangle, CalendarCheck, Users2, BadgeCheck, RefreshCw } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function HomeImportantPayment() {
  const items = [
    {
      icon: <CalendarCheck className="h-6 w-6" />,
      title: 'Payment Schedule',
      body: 'All participants pay program fees in scheduled batches over time, not as a single upfront payment.',
    },
    {
      icon: <Users2 className="h-6 w-6" />,
      title: 'Selection Quota',
      body: 'Fully funded slots are limited and competitive based on qualifications and available funding.',
    },
    {
      icon: <BadgeCheck className="h-6 w-6" />,
      title: 'Fully Funded Process',
      body: 'You still follow the same payment schedule, then receive a full reimbursement if you are selected.',
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: 'Self Funded Guarantee',
      body: 'If you follow the payment schedule, your participation is guaranteed without competitive selection.',
    },
  ];

  return (
    <section className={jysSectionTheme.homeImportantPayment.sectionWrapper}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          eyebrow="Payment & Selection"
          title="Important information before you apply"
        />
        <p className={jysSectionTheme.homeImportantPayment.introText}>
          Understand how the payment schedule and fully funded selection work so you can choose the
          best registration type for you.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(item => (
            <div key={item.title} className={jysSectionTheme.homeImportantPayment.card}>
              <div className={jysSectionTheme.homeImportantPayment.iconCircle}>{item.icon}</div>
              <h3 className={jysSectionTheme.homeImportantPayment.cardTitle}>{item.title}</h3>
              <p className={jysSectionTheme.homeImportantPayment.cardBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <div className={jysSectionTheme.homeImportantPayment.noteBar}>
          <AlertTriangle className={jysSectionTheme.homeImportantPayment.noteIcon} />
          <p className="text-xs sm:text-sm">
            <span className={jysSectionTheme.homeImportantPayment.noteEmphasis}>Important:</span> If
            you are not selected for fully funded, you will continue as self funded with no refund
            of payments already made.
          </p>
        </div>
      </div>
    </section>
  );
}
