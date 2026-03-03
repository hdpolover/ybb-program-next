import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function FullyFundedPaymentSection() {
  return (
    <section className={jysSectionTheme.applyPayment.sectionWrapper}>
      <div className={jysSectionTheme.applyPayment.container}>
        {/* Header */}
        <div className={jysSectionTheme.applyPayment.headerWrapper}>
          <SectionHeader eyebrow="Payment Information" title="Registration & Program Fees" />
          <p className={jysSectionTheme.applyPayment.headerSubtitle}>
            Review the registration and program fees for the Fully Funded scheme. Early stage fees
            offer more affordable options for delegates who complete their registration sooner.
          </p>
        </div>

        {/* Fee cards */}
        <div className={jysSectionTheme.applyPayment.cardsGrid}>
          {/* Registration Fee */}
          <div className={jysSectionTheme.applyPayment.card}>
            <h3 className={jysSectionTheme.applyPayment.cardTitle}>Registration Fee</h3>
            <p className={jysSectionTheme.applyPayment.cardPrice}>25 USD / IDR 415.000</p>
            <p className={jysSectionTheme.applyPayment.cardSubtitle}>
              Covers the processing of your application and administrative support.
            </p>

            <div className={jysSectionTheme.applyPayment.stagesList}>
              <div className={jysSectionTheme.applyPayment.stageItem}>
                <div>
                  <p className={jysSectionTheme.applyPayment.stageLabel}>Early Stage</p>
                </div>
                <div className="text-right">
                  <p className={jysSectionTheme.applyPayment.stagePrice}>10 USD</p>
                  <p className={jysSectionTheme.applyPayment.stagePriceSub}>Rp 167.500</p>
                </div>
              </div>

              <div className={jysSectionTheme.applyPayment.stageItem}>
                <div>
                  <p className={jysSectionTheme.applyPayment.stageLabelMuted}>Last Stage</p>
                </div>
                <div className="text-right">
                  <p className={jysSectionTheme.applyPayment.stagePrice}>15 USD</p>
                  <p className={jysSectionTheme.applyPayment.stagePriceSub}>Rp 247.500</p>
                </div>
              </div>
            </div>
          </div>

          {/* Program Fee */}
          <div className={jysSectionTheme.applyPayment.card}>
            <h3 className={jysSectionTheme.applyPayment.cardTitle}>Program Fee</h3>
            <p className={jysSectionTheme.applyPayment.cardPrice}>660 USD / IDR 11.500.000</p>
            <p className={jysSectionTheme.applyPayment.cardSubtitle}>
              Covers participation in the Japan Youth Summit program.
            </p>

            <div className={jysSectionTheme.applyPayment.stagesList}>
              <div className={jysSectionTheme.applyPayment.stageItem}>
                <div>
                  <p className={jysSectionTheme.applyPayment.stageLabel}>Early Stage</p>
                </div>
                <div className="text-right">
                  <p className={jysSectionTheme.applyPayment.stagePrice}>10 USD</p>
                  <p className={jysSectionTheme.applyPayment.stagePriceSub}>Rp 167.500</p>
                </div>
              </div>

              <div className={jysSectionTheme.applyPayment.stageItem}>
                <div>
                  <p className={jysSectionTheme.applyPayment.stageLabelMuted}>Last Stage</p>
                </div>
                <div className="text-right">
                  <p className={jysSectionTheme.applyPayment.stagePrice}>15 USD</p>
                  <p className={jysSectionTheme.applyPayment.stagePriceSub}>Rp 247.500</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Note + CTA */}
        <div className={jysSectionTheme.applyPayment.footerWrapper}>
          <p className={jysSectionTheme.applyPayment.footerNote}>
            <span className={jysSectionTheme.applyPayment.footerNoteEmphasis}>
              *All fees are non-refundable.
            </span>
          </p>
          <a href="#apply" className={jysSectionTheme.applyPayment.footerCta}>
            Register Now
          </a>
        </div>
      </div>
    </section>
  );
}
