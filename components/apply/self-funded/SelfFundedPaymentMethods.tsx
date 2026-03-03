import Image from 'next/image';
import { CreditCard, Globe2 } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function FullyFundedPaymentMethodsSection() {
  return (
    <section className={jysSectionTheme.applyPaymentMethods.sectionWrapper}>
      <div className={jysSectionTheme.applyPaymentMethods.container}>
        {/* Header */}
        <div className={jysSectionTheme.applyPaymentMethods.headerWrapper}>
          <SectionHeader
            eyebrow="Payment Methods"
            title="Make payment with our supported methods of payment."
          />
          <p className={jysSectionTheme.applyPaymentMethods.headerSubtitle}>
            Choose the most convenient option based on your location. Payment details will also be
            provided in your official registration guideline.
          </p>
        </div>

        <div className={jysSectionTheme.applyPaymentMethods.cardsGrid}>
          {/* Payment for Indonesia Participants */}
          <div className={jysSectionTheme.applyPaymentMethods.bankCard}>
            <div className={jysSectionTheme.applyPaymentMethods.bankHeaderRow}>
              <div className={jysSectionTheme.applyPaymentMethods.bankIconCircle}>
                <CreditCard className={jysSectionTheme.applyPaymentMethods.bankIcon} />
              </div>
              <div>
                <h3 className={jysSectionTheme.applyPaymentMethods.cardTitle}>
                  Payment for Indonesia Participants
                </h3>
                <p className={jysSectionTheme.applyPaymentMethods.cardSubtitle}>
                  Transfer via Indonesian banks.
                </p>
              </div>
            </div>

            {/* Logo/slot bank */}
            <div className={jysSectionTheme.applyPaymentMethods.banksGrid}>
              {[
                { name: 'BCA', src: '/img/bca-logo.png' },
                { name: 'BNI', src: '/img/bni-logo.png' },
                { name: 'BRI', src: '/img/bri-logo.png' },
                { name: 'Mandiri', src: '/img/mandiri-logo.png' },
              ].map(bank => (
                <div key={bank.name} className={jysSectionTheme.applyPaymentMethods.bankLogoCard}>
                  <Image
                    src={bank.src}
                    alt={`${bank.name} logo`}
                    width={140}
                    height={56}
                    className={jysSectionTheme.applyPaymentMethods.bankLogoImage}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment for International Participants Only */}
          <div className={jysSectionTheme.applyPaymentMethods.intlCard}>
            <div className={jysSectionTheme.applyPaymentMethods.intlHeaderRow}>
              <div className={jysSectionTheme.applyPaymentMethods.intlIconCircle}>
                <Globe2 className={jysSectionTheme.applyPaymentMethods.intlIcon} />
              </div>
              <div>
                <h3 className={jysSectionTheme.applyPaymentMethods.cardTitle}>
                  Payment for International Participants Only
                </h3>
                <p className={jysSectionTheme.applyPaymentMethods.cardSubtitle}>
                  Pay securely via PayPal.
                </p>
              </div>
            </div>

            <div className={jysSectionTheme.applyPaymentMethods.paypalBox}>
              <div className={jysSectionTheme.applyPaymentMethods.paypalHeaderRow}>
                <div className="flex items-center gap-3">
                  <div className={jysSectionTheme.applyPaymentMethods.paypalLogoCircle}>
                    <Image
                      src="/img/paypal-logo.png"
                      alt="PayPal logo"
                      width={48}
                      height={48}
                      className={jysSectionTheme.applyPaymentMethods.paypalLogoImage}
                    />
                  </div>
                  <span className={jysSectionTheme.applyPaymentMethods.paypalTitle}>PayPal</span>
                </div>
              </div>

              <div className={jysSectionTheme.applyPaymentMethods.paypalMeta}>
                <div className={jysSectionTheme.applyPaymentMethods.paypalMetaRow}>
                  <span className={jysSectionTheme.applyPaymentMethods.paypalMetaLabel}>
                    PayPal ID
                  </span>
                  <span className={jysSectionTheme.applyPaymentMethods.paypalMetaValue}>
                    @YBBadmn
                  </span>
                </div>
                <div className={jysSectionTheme.applyPaymentMethods.paypalMetaRow}>
                  <span className={jysSectionTheme.applyPaymentMethods.paypalMetaLabel}>
                    PayPal Mail
                  </span>
                  <span className={jysSectionTheme.applyPaymentMethods.paypalMetaValue}>
                    ybb.admn@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes below cards */}
        <div className={jysSectionTheme.applyPaymentMethods.notesGrid}>
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
