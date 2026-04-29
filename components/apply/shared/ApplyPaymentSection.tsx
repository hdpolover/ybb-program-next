import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { getSignupHref } from '@/lib/landing/cta';
import type { ApplyFeeCard } from '@/lib/apply/page-data';

export type ApplyPaymentSectionProps = {
  schemeLabel: string;
  registrationCard: ApplyFeeCard | null;
  programCard: ApplyFeeCard | null;
  registrationWindow: string | null;
};

function renderCard(card: ApplyFeeCard | null) {
  if (!card) {
    return (
      <div className={componentsTheme.applyPayment.card}>
        <h3 className={componentsTheme.applyPayment.cardTitle}>Not configured</h3>
        <p className={componentsTheme.applyPayment.cardSubtitle}>
          Pricing information is managed from the backend and has not been configured yet.
        </p>
      </div>
    );
  }

  return (
    <div className={componentsTheme.applyPayment.card}>
      <h3 className={componentsTheme.applyPayment.cardTitle}>{card.title}</h3>
      <p className={componentsTheme.applyPayment.cardPrice}>{card.priceLabel}</p>
      <p className={componentsTheme.applyPayment.cardSubtitle}>{card.subtitle}</p>

      {card.periods.length > 0 && (
        <div className={componentsTheme.applyPayment.stagesList}>
          {card.periods.map((period, idx) => (
            <div key={`${period.label}-${idx}`} className={componentsTheme.applyPayment.stageItem}>
              <div>
                <p
                  className={
                    idx === 0
                      ? componentsTheme.applyPayment.stageLabel
                      : componentsTheme.applyPayment.stageLabelMuted
                  }
                >
                  {period.label}
                </p>
              </div>
              <div className="text-right">
                <p className={componentsTheme.applyPayment.stagePrice}>{period.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApplyPaymentSection({
  schemeLabel,
  registrationCard,
  programCard,
  registrationWindow,
}: ApplyPaymentSectionProps) {
  return (
    <section className={componentsTheme.applyPayment.sectionWrapper}>
      <div className={componentsTheme.applyPayment.container}>
        <div className={componentsTheme.applyPayment.headerWrapper}>
          <SectionHeader eyebrow="Payment Information" title="Registration & Program Fees" />
          <p className={componentsTheme.applyPayment.headerSubtitle}>
            Review the backend-configured registration and program fees for the {schemeLabel} scheme.
          </p>
        </div>

        <div className={componentsTheme.applyPayment.cardsGrid}>
          {renderCard(registrationCard)}
          {renderCard(programCard)}
        </div>

        <div className={componentsTheme.applyPayment.footerWrapper}>
          <p className={componentsTheme.applyPayment.footerNote}>
            {registrationWindow ? (
              <>
                <span className={componentsTheme.applyPayment.footerNoteEmphasis}>
                  Registration window:
                </span>{' '}
                {registrationWindow}
              </>
            ) : (
              <span className={componentsTheme.applyPayment.footerNoteEmphasis}>
                Registration schedule is managed by the program team.
              </span>
            )}
          </p>
          <a href={getSignupHref()} className={componentsTheme.applyPayment.footerCta}>
            Register Now
          </a>
        </div>
      </div>
    </section>
  );
}
