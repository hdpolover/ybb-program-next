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
          Choose the partnership path that best matches your role and goals with YBB.
        </p>
        <div className={jysSectionTheme.partnersOpportunities.grid}>
          {/* Ambassador Program */}
          <div className={jysSectionTheme.partnersOpportunities.communityCard}>
            <div className={jysSectionTheme.partnersOpportunities.cardBody}>
              <h3 className={jysSectionTheme.partnersOpportunities.title}>Ambassador Program</h3>
              <p className={jysSectionTheme.partnersOpportunities.description}>
                Best for: Content creators, youth leaders, and influencers.
              </p>
            </div>
            <ul className={jysSectionTheme.partnersOpportunities.benefitsList}>
              {[
                'Selected based on content quality and audience engagement',
                "Aligned with YBB's vision and mission",
                'Represent YBB through authentic content and campaigns',
                'Build impact while growing personal influence',
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
                href="/apply/ambassador-program"
                className={jysSectionTheme.partnersOpportunities.communityCta}
              >
                Choose Plan
              </a>
            </div>
          </div>

          {/* Affiliate Program */}
          <div className={jysSectionTheme.partnersOpportunities.silverCard}>
            <div className={jysSectionTheme.partnersOpportunities.cardBody}>
              <h3 className={jysSectionTheme.partnersOpportunities.title}>Affiliate Program</h3>
              <p className={jysSectionTheme.partnersOpportunities.description}>
                Best for: Individuals promoting YBB programs.
              </p>
            </div>
            <ul className={jysSectionTheme.partnersOpportunities.benefitsList}>
              <li className={jysSectionTheme.partnersOpportunities.affiliateSubheading}>
                Fully-funded Affiliate
              </li>
              {[
                'Earn 20% commission per successful registration',
                'Commission applies to registration fee',
                'Performance-based partnership',
              ].map((label, idx, arr) => (
                <li
                  key={`fully-${idx}`}
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

              <li className={jysSectionTheme.partnersOpportunities.affiliateSubheadingSpaced}>
                Self-Funded Affiliate
              </li>
              {[
                'Earn 5% commission from program fees',
                'No minimum referrals required',
                'Flexible and results-driven',
              ].map((label, idx, arr) => (
                <li
                  key={`self-${idx}`}
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
                href="/partners/affiliate-program"
                className={jysSectionTheme.partnersOpportunities.silverCta}
              >
                Choose Plan
              </a>
            </div>
          </div>

          {/* Community & Institution */}
          <div className={jysSectionTheme.partnersOpportunities.goldCard}>
            <div className={jysSectionTheme.partnersOpportunities.cardBody}>
              <div className="flex items-center gap-2">
                <span className={jysSectionTheme.partnersOpportunities.popularChip}>Popular</span>
              </div>
              <h3 className={`${jysSectionTheme.partnersOpportunities.title} mt-2`}>
                Community & Institution
              </h3>
              <p className={jysSectionTheme.partnersOpportunities.description}>
                Best for: Schools, universities, and communities.
              </p>
            </div>
            <ul className={jysSectionTheme.partnersOpportunities.benefitsList}>
              {[
                'Group participant registration',
                '1 free quota for every 15 registered participants',
                'Free slot ideal for mentors or supervisors',
                'Support participants throughout the program',
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
                href="/apply/community-institution"
                className={jysSectionTheme.partnersOpportunities.goldCta}
              >
                Choose Plan
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
