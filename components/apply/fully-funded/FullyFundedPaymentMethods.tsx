import Image from 'next/image';
import { CreditCard, Globe2 } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

export default function FullyFundedPaymentMethodsSection() {
  return (
    <section className={componentsTheme.applyPaymentMethods.sectionWrapper}>
      <div className={componentsTheme.applyPaymentMethods.container}>
        {/* Header */}
        <div className={componentsTheme.applyPaymentMethods.headerWrapper}>
          <SectionHeader
            eyebrow="Payment Methods"
            title="Make payment with our supported methods of payment."
          />
          <p className={componentsTheme.applyPaymentMethods.headerSubtitle}>
            Choose the most convenient option based on your location. Payment details will also be
            provided in your official registration guideline.
          </p>
        </div>

        <div className={componentsTheme.applyPaymentMethods.cardsGrid}>
          {/* Payment for Indonesia Participants */}
          <div className={componentsTheme.applyPaymentMethods.bankCard}>
            <div className={componentsTheme.applyPaymentMethods.bankHeaderRow}>
              <div className={componentsTheme.applyPaymentMethods.bankIconCircle}>
                <CreditCard className={componentsTheme.applyPaymentMethods.bankIcon} />
              </div>
              <div>
                <h3 className={componentsTheme.applyPaymentMethods.cardTitle}>
                  Payment for Indonesia Participants
                </h3>
                <p className={componentsTheme.applyPaymentMethods.cardSubtitle}>
                  Transfer via Indonesian banks.
                </p>
              </div>
            </div>

            {/* Logo/slot bank */}
            <div className={componentsTheme.applyPaymentMethods.banksGrid}>
              {[
                { name: 'BCA', src: '/img/bca-logo.png' },
                { name: 'BNI', src: '/img/bni-logo.png' },
                { name: 'BRI', src: '/img/bri-logo.png' },
                { name: 'Mandiri', src: '/img/mandiri-logo.png' },
              ].map(bank => (
                <div key={bank.name} className={componentsTheme.applyPaymentMethods.bankLogoCard}>
                  <Image
                    src={bank.src}
                    alt={`${bank.name} logo`}
                    width={140}
                    height={56}
                    className={componentsTheme.applyPaymentMethods.bankLogoImage}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment for International Participants Only */}
          <div className={componentsTheme.applyPaymentMethods.intlCard}>
            <div className={componentsTheme.applyPaymentMethods.intlHeaderRow}>
              <div className={componentsTheme.applyPaymentMethods.intlIconCircle}>
                <Globe2 className={componentsTheme.applyPaymentMethods.intlIcon} />
              </div>
              <div>
                <h3 className={componentsTheme.applyPaymentMethods.cardTitle}>
                  Payment for International Participants Only
                </h3>
                <p className={componentsTheme.applyPaymentMethods.cardSubtitle}>
                  Pay securely via PayPal.
                </p>
              </div>
            </div>

            <div className={componentsTheme.applyPaymentMethods.paypalBox}>
              <div className={componentsTheme.applyPaymentMethods.paypalHeaderRow}>
                <div className="flex items-center gap-3">
                  <div className={componentsTheme.applyPaymentMethods.paypalLogoCircle}>
                    <Image
                      src="/img/paypal-logo.png"
                      alt="PayPal logo"
                      width={48}
                      height={48}
                      className={componentsTheme.applyPaymentMethods.paypalLogoImage}
                    />
                  </div>
                  <span className={componentsTheme.applyPaymentMethods.paypalTitle}>PayPal</span>
                </div>
              </div>

              <div className={componentsTheme.applyPaymentMethods.paypalMeta}>
                <div className={componentsTheme.applyPaymentMethods.paypalMetaRow}>
                  <span className={componentsTheme.applyPaymentMethods.paypalMetaLabel}>
                    PayPal ID
                  </span>
                  <span className={componentsTheme.applyPaymentMethods.paypalMetaValue}>
                    @YBBadmn
                  </span>
                </div>
                <div className={componentsTheme.applyPaymentMethods.paypalMetaRow}>
                  <span className={componentsTheme.applyPaymentMethods.paypalMetaLabel}>
                    PayPal Mail
                  </span>
                  <span className={componentsTheme.applyPaymentMethods.paypalMetaValue}>
                    ybb.admn@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes below cards */}
        <div className={componentsTheme.applyPaymentMethods.notesGrid}>
          <p>
            Please note that your participation in the Japan Youth Summit will be officially
            confirmed after payment of the registration fee. Please ensure you complete this step
            after submitting the registration form.
          </p>
          <p>
            All payment procedures are explained in the "Paying Registration Fees" section of this
            guide.
          </p>
        </div>
      </div>
    </section>
  );
}
