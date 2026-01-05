import { Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

// Section: Partnership Opportunities — gaya Program Highlights
export default function PartnershipOpportunitiesSection() {
  return (
    <section className={jysSectionTheme.partnersOpportunities.sectionWrapper}>
      <div className={jysSectionTheme.partnersOpportunities.container}>
        <SectionHeader eyebrow="Opportunities" title="Partnership Opportunities" />
        <p className={jysSectionTheme.partnersOpportunities.subtitle}>
          Join us in creating lasting impact through strategic partnerships.
        </p>
        <div className={jysSectionTheme.partnersOpportunities.grid}>
          {/* Partner Community — termurah, di kiri */}
          <div className={jysSectionTheme.partnersOpportunities.communityCard}>
            <div className={jysSectionTheme.partnersOpportunities.cardBody}>
              <h3 className={jysSectionTheme.partnersOpportunities.title}>Community Partner</h3>
              <p className={jysSectionTheme.partnersOpportunities.description}>
                Ideal for universities, NGOs, and communities contributing services or in-kind
                support.
              </p>
              <p className={jysSectionTheme.partnersOpportunities.priceLabel}>Start From:</p>
              <p className={jysSectionTheme.partnersOpportunities.priceValue}>
                Flexible (in-kind & services)
              </p>
            </div>
            <ul className={jysSectionTheme.partnersOpportunities.benefitsList}>
              {[
                'Website recognition',
                'Social media mentions',
                'Networking opportunities',
                'Partnership certificate',
                'Volunteer opportunities',
              ].map((label, idx, arr) => (
                <li
                  key={idx}
                  className={`${jysSectionTheme.partnersOpportunities.benefitItemBase} ${
                    idx !== arr.length - 1
                      ? jysSectionTheme.partnersOpportunities.benefitItemBordered
                      : ''
                  }`}
                >
                  <span className={jysSectionTheme.partnersOpportunities.checkCircle}>
                    <Check className={jysSectionTheme.partnersOpportunities.checkIcon} />
                  </span>
                  <span className={jysSectionTheme.partnersOpportunities.benefitLabel}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className={jysSectionTheme.partnersOpportunities.cardFooter}>
              <a
                href="/partners/community-partner"
                className={jysSectionTheme.partnersOpportunities.communityCta}
              >
                Become a Community Partner
              </a>
            </div>
          </div>

          {/* Partner Silver */}
          <div className={jysSectionTheme.partnersOpportunities.silverCard}>
            <div className={jysSectionTheme.partnersOpportunities.cardBody}>
              <h3 className={jysSectionTheme.partnersOpportunities.title}>Silver Partner</h3>
              <p className={jysSectionTheme.partnersOpportunities.description}>
                Solid visibility and engagement for organizations starting strategic collaboration.
              </p>
              <p className={jysSectionTheme.partnersOpportunities.priceLabel}>Start From:</p>
              <p className={jysSectionTheme.partnersOpportunities.priceValue}>$10,000 - $24,999</p>
            </div>
            <ul className={jysSectionTheme.partnersOpportunities.benefitsList}>
              {[
                'Logo placement on website',
                'Newsletter mentions',
                'Event participation opportunities',
                'Impact reports',
                'Certificate of partnership',
              ].map((label, idx, arr) => (
                <li
                  key={idx}
                  className={`${jysSectionTheme.partnersOpportunities.benefitItemBase} ${
                    idx !== arr.length - 1
                      ? jysSectionTheme.partnersOpportunities.benefitItemBordered
                      : ''
                  }`}
                >
                  <span className={jysSectionTheme.partnersOpportunities.checkCircle}>
                    <Check className={jysSectionTheme.partnersOpportunities.checkIcon} />
                  </span>
                  <span className={jysSectionTheme.partnersOpportunities.benefitLabel}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className={jysSectionTheme.partnersOpportunities.cardFooter}>
              <a
                href="/partners/silver-partner"
                className={jysSectionTheme.partnersOpportunities.silverCta}
              >
                Become a Silver Partner
              </a>
            </div>
          </div>

          {/* Partner Gold */}
          <div className={jysSectionTheme.partnersOpportunities.goldCard}>
            <div className={jysSectionTheme.partnersOpportunities.cardBody}>
              <h3 className={jysSectionTheme.partnersOpportunities.title}>Gold Partner</h3>
              <p className={jysSectionTheme.partnersOpportunities.description}>
                Strong brand exposure and collaboration across main program activities.
              </p>
              <p className={jysSectionTheme.partnersOpportunities.priceLabel}>Start From:</p>
              <p className={jysSectionTheme.partnersOpportunities.priceValue}>$25,000 - $49,999</p>
            </div>
            <ul className={jysSectionTheme.partnersOpportunities.benefitsList}>
              {[
                'Prominent logo placement',
                'Workshop sponsorship opportunities',
                'Alumni network access',
                'Quarterly impact reports',
                'Social media recognition',
              ].map((label, idx, arr) => (
                <li
                  key={idx}
                  className={`${jysSectionTheme.partnersOpportunities.benefitItemBase} ${
                    idx !== arr.length - 1
                      ? jysSectionTheme.partnersOpportunities.benefitItemBordered
                      : ''
                  }`}
                >
                  <span className={jysSectionTheme.partnersOpportunities.checkCircle}>
                    <Check className={jysSectionTheme.partnersOpportunities.checkIcon} />
                  </span>
                  <span className={jysSectionTheme.partnersOpportunities.benefitLabel}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className={jysSectionTheme.partnersOpportunities.cardFooter}>
              <a
                href="/partners/gold-partner"
                className={jysSectionTheme.partnersOpportunities.goldCta}
              >
                Become a Gold Partner
              </a>
            </div>
          </div>

          {/* Partner Diamond — paling premium, di kanan */}
          <div className={jysSectionTheme.partnersOpportunities.diamondCard}>
            <div className={jysSectionTheme.partnersOpportunities.cardBody}>
              <h3 className={jysSectionTheme.partnersOpportunities.title}>Diamond Partner</h3>
              <p className={jysSectionTheme.partnersOpportunities.description}>
                Maximum exposure, custom activations, and deep, long-term collaboration.
              </p>
              <p className={jysSectionTheme.partnersOpportunities.priceLabel}>Start From:</p>
              <p className={jysSectionTheme.partnersOpportunities.priceValue}>$50,000+</p>
            </div>
            <ul className={jysSectionTheme.partnersOpportunities.benefitsList}>
              {[
                'Premier logo placement on all materials',
                'Speaking opportunities at main events',
                'Dedicated networking sessions',
                'Annual partnership report',
                'Direct access to alumni network',
                'Custom partnership activities',
              ].map((label, idx) => (
                <li
                  key={idx}
                  className={`${jysSectionTheme.partnersOpportunities.benefitItemBase} ${
                    idx !== 5 ? jysSectionTheme.partnersOpportunities.benefitItemBordered : ''
                  }`}
                >
                  <span className={jysSectionTheme.partnersOpportunities.checkCircle}>
                    <Check className={jysSectionTheme.partnersOpportunities.checkIcon} />
                  </span>
                  <span className={jysSectionTheme.partnersOpportunities.benefitLabel}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className={jysSectionTheme.partnersOpportunities.cardFooter}>
              <a
                href="/partners/diamond-partner"
                className={jysSectionTheme.partnersOpportunities.diamondCta}
              >
                Become a Diamond Partner
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
