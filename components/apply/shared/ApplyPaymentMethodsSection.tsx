import { CreditCard, Globe2 } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { ApplyPaymentMethodsData } from '@/lib/apply/page-data';

export type ApplyPaymentMethodsSectionProps = {
  data: ApplyPaymentMethodsData;
};

export default function ApplyPaymentMethodsSection({ data }: ApplyPaymentMethodsSectionProps) {
  return (
    <section className={componentsTheme.applyPaymentMethods.sectionWrapper}>
      <div className={componentsTheme.applyPaymentMethods.container}>
        <div className={componentsTheme.applyPaymentMethods.headerWrapper}>
          <SectionHeader
            eyebrow="Payment Methods"
            title="Available payment methods are managed from backend configuration."
          />
          <p className={componentsTheme.applyPaymentMethods.headerSubtitle}>
            The details below are loaded from the latest program settings.
          </p>
        </div>

        <div className={componentsTheme.applyPaymentMethods.cardsGrid}>
          {data.items.length > 0 ? (
            data.items.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className={
                  idx % 2 === 0
                    ? componentsTheme.applyPaymentMethods.bankCard
                    : componentsTheme.applyPaymentMethods.intlCard
                }
              >
                <div
                  className={
                    idx % 2 === 0
                      ? componentsTheme.applyPaymentMethods.bankHeaderRow
                      : componentsTheme.applyPaymentMethods.intlHeaderRow
                  }
                >
                  <div
                    className={
                      idx % 2 === 0
                        ? componentsTheme.applyPaymentMethods.bankIconCircle
                        : componentsTheme.applyPaymentMethods.intlIconCircle
                    }
                  >
                    {idx % 2 === 0 ? (
                      <CreditCard className={componentsTheme.applyPaymentMethods.bankIcon} />
                    ) : (
                      <Globe2 className={componentsTheme.applyPaymentMethods.intlIcon} />
                    )}
                  </div>
                  <div>
                    <h3 className={componentsTheme.applyPaymentMethods.cardTitle}>{item.title}</h3>
                    <p className={componentsTheme.applyPaymentMethods.cardSubtitle}>{item.body}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={componentsTheme.applyPaymentMethods.bankCard}>
              <h3 className={componentsTheme.applyPaymentMethods.cardTitle}>Not configured</h3>
              <p className={componentsTheme.applyPaymentMethods.cardSubtitle}>
                Payment method details have not been configured in the backend yet.
              </p>
            </div>
          )}
        </div>

        <div className={componentsTheme.applyPaymentMethods.notesGrid}>
          <p>{data.note}</p>
        </div>
      </div>
    </section>
  );
}
