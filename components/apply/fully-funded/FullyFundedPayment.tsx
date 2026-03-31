import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

export default function FullyFundedPaymentSection() {
  return (
    <section className={componentsTheme.applyPayment.sectionWrapper}>
      <div className={componentsTheme.applyPayment.container}>
        {/* Header */}
        <div className={componentsTheme.applyPayment.headerWrapper}>
          <SectionHeader eyebrow="Payment Information" title="Registration & Program Fees" />
          <p className={componentsTheme.applyPayment.headerSubtitle}>
            Review the registration and program fees for the Fully Funded scheme. Early stage fees
            offer more affordable options for delegates who complete their registration sooner.
          </p>
        </div>

        {/* Fee cards */}
        <div className={componentsTheme.applyPayment.cardsGrid}>
          {/* Registration Fee */}
          <div className={componentsTheme.applyPayment.card}>
            <h3 className={componentsTheme.applyPayment.cardTitle}>Registration Fee</h3>
            <p className={componentsTheme.applyPayment.cardPrice}>25 USD / IDR 415.000</p>
            <p className={componentsTheme.applyPayment.cardSubtitle}>
              Covers the processing of your application and administrative support.
            </p>

            <div className={componentsTheme.applyPayment.stagesList}>
              <div className={componentsTheme.applyPayment.stageItem}>
                <div>
                  <p className={componentsTheme.applyPayment.stageLabel}>Early Stage</p>
                </div>
                <div className="text-right">
                  <p className={componentsTheme.applyPayment.stagePrice}>10 USD</p>
                  <p className={componentsTheme.applyPayment.stagePriceSub}>Rp 167.500</p>
                </div>
              </div>

              <div className={componentsTheme.applyPayment.stageItem}>
                <div>
                  <p className={componentsTheme.applyPayment.stageLabelMuted}>Last Stage</p>
                </div>
                <div className="text-right">
                  <p className={componentsTheme.applyPayment.stagePrice}>15 USD</p>
                  <p className={componentsTheme.applyPayment.stagePriceSub}>Rp 247.500</p>
                </div>
              </div>
            </div>
          </div>

          {/* Program Fee */}
          <div className={componentsTheme.applyPayment.card}>
            <h3 className={componentsTheme.applyPayment.cardTitle}>Program Fee</h3>
            <p className={componentsTheme.applyPayment.cardPrice}>660 USD / IDR 11.500.000</p>
            <p className={componentsTheme.applyPayment.cardSubtitle}>
              Covers participation in the Japan Youth Summit program.
            </p>

            <div className={componentsTheme.applyPayment.stagesList}>
              <div className={componentsTheme.applyPayment.stageItem}>
                <div>
                  <p className={componentsTheme.applyPayment.stageLabel}>Early Stage</p>
                </div>
                <div className="text-right">
                  <p className={componentsTheme.applyPayment.stagePrice}>10 USD</p>
                  <p className={componentsTheme.applyPayment.stagePriceSub}>Rp 167.500</p>
                </div>
              </div>

              <div className={componentsTheme.applyPayment.stageItem}>
                <div>
                  <p className={componentsTheme.applyPayment.stageLabelMuted}>Last Stage</p>
                </div>
                <div className="text-right">
                  <p className={componentsTheme.applyPayment.stagePrice}>15 USD</p>
                  <p className={componentsTheme.applyPayment.stagePriceSub}>Rp 247.500</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note + CTA */}
        <div className={componentsTheme.applyPayment.footerWrapper}>
          <p className={componentsTheme.applyPayment.footerNote}>
            <span className={componentsTheme.applyPayment.footerNoteEmphasis}>
              *All fees are non-refundable.
            </span>
          </p>
          <a href="#apply" className={componentsTheme.applyPayment.footerCta}>
            Register Now
          </a>
        </div>
      </div>
    </section>
  );
}
