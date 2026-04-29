import { Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { Button } from '@/components/ui';

type AffiliateCommission = {
  fullyFundedPct?: number;
  selfFundedPct?: number;
};

// Section: Partnership Opportunities — gaya Program Highlights
export default function PartnershipOpportunitiesSection({
  affiliateCommission,
}: {
  affiliateCommission?: AffiliateCommission;
}) {
  const fullyFundedPct = affiliateCommission?.fullyFundedPct ?? 5;
  const selfFundedPct = affiliateCommission?.selfFundedPct ?? 20;
  return (
    <section className={componentsTheme.partnersOpportunities.sectionWrapper}>
      <div className={componentsTheme.partnersOpportunities.container}>
        <SectionHeader eyebrow="Opportunities" title="Partnership Opportunities" />
        <p className={componentsTheme.partnersOpportunities.subtitle}>
          Choose the partnership path that best matches your role and goals with YBB.
        </p>
        <div className={componentsTheme.partnersOpportunities.grid}>
          {/* Ambassador Program */}
          <div className={componentsTheme.partnersOpportunities.communityCard}>
            <div className={componentsTheme.partnersOpportunities.cardBody}>
              <h3 className={componentsTheme.partnersOpportunities.title}>Ambassador Program</h3>
              <p className={componentsTheme.partnersOpportunities.description}>
                Best for: Content creators, youth leaders, and influencers.
              </p>
            </div>
            <ul className={componentsTheme.partnersOpportunities.benefitsList}>
              {[
                'Selected based on content quality and audience engagement',
                "Aligned with YBB's vision and mission",
                'Represent YBB through authentic content and campaigns',
                'Build impact while growing personal influence',
              ].map((label, idx, arr) => (
                <li
                  key={idx}
                  className={`${componentsTheme.partnersOpportunities.benefitItemBase} ${
                    idx !== arr.length - 1
                      ? componentsTheme.partnersOpportunities.benefitItemBordered
                      : ''
                  }`}
                >
                  <span className={componentsTheme.partnersOpportunities.checkCircle}>
                    <Check className={componentsTheme.partnersOpportunities.checkIcon} />
                  </span>
                  <span className={componentsTheme.partnersOpportunities.benefitLabel}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className={componentsTheme.partnersOpportunities.cardFooter}>
              <Button
                href="/apply/ambassador-program"
                className="w-full"
                variant="primary"
              >
                Choose Plan
              </Button>
            </div>
          </div>

          {/* Affiliate Program */}
          <div className={componentsTheme.partnersOpportunities.silverCard}>
            <div className={componentsTheme.partnersOpportunities.cardBody}>
              <h3 className={componentsTheme.partnersOpportunities.title}>Affiliate Program</h3>
              <p className={componentsTheme.partnersOpportunities.description}>
                Best for: Individuals promoting YBB programs.
              </p>
            </div>
            <ul className={componentsTheme.partnersOpportunities.benefitsList}>
              <li className={componentsTheme.partnersOpportunities.affiliateSubheading}>
                Fully-funded Affiliate
              </li>
              {[
                `Earn ${fullyFundedPct}% commission per successful registration`,
                'Commission applies to registration fee',
                'Performance-based partnership',
              ].map((label, idx, arr) => (
                <li
                  key={`fully-${idx}`}
                  className={`${componentsTheme.partnersOpportunities.benefitItemBase} ${
                    idx !== arr.length - 1
                      ? componentsTheme.partnersOpportunities.benefitItemBordered
                      : ''
                  }`}
                >
                  <span className={componentsTheme.partnersOpportunities.checkCircle}>
                    <Check className={componentsTheme.partnersOpportunities.checkIcon} />
                  </span>
                  <span className={componentsTheme.partnersOpportunities.benefitLabel}>
                    {label}
                  </span>
                </li>
              ))}

              <li className={componentsTheme.partnersOpportunities.affiliateSubheadingSpaced}>
                Self-Funded Affiliate
              </li>
              {[
                `Earn ${selfFundedPct}% commission from program fees`,
                'No minimum referrals required',
                'Flexible and results-driven',
              ].map((label, idx, arr) => (
                <li
                  key={`self-${idx}`}
                  className={`${componentsTheme.partnersOpportunities.benefitItemBase} ${
                    idx !== arr.length - 1
                      ? componentsTheme.partnersOpportunities.benefitItemBordered
                      : ''
                  }`}
                >
                  <span className={componentsTheme.partnersOpportunities.checkCircle}>
                    <Check className={componentsTheme.partnersOpportunities.checkIcon} />
                  </span>
                  <span className={componentsTheme.partnersOpportunities.benefitLabel}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className={componentsTheme.partnersOpportunities.cardFooter}>
              <Button
                href="/partners/affiliate-program"
                className="w-full"
                variant="primary"
              >
                Choose Plan
              </Button>
            </div>
          </div>

          {/* Community & Institution */}
          <div className={componentsTheme.partnersOpportunities.goldCard}>
            <div className={componentsTheme.partnersOpportunities.cardBody}>
              <div className="flex items-center gap-2">
                <span className={componentsTheme.partnersOpportunities.popularChip}>Popular</span>
              </div>
              <h3 className={`${componentsTheme.partnersOpportunities.title} mt-2`}>
                Community & Institution
              </h3>
              <p className={componentsTheme.partnersOpportunities.description}>
                Best for: Schools, universities, and communities.
              </p>
            </div>
            <ul className={componentsTheme.partnersOpportunities.benefitsList}>
              {[
                'Group participant registration',
                '1 free quota for every 15 registered participants',
                'Free slot ideal for mentors or supervisors',
                'Support participants throughout the program',
              ].map((label, idx, arr) => (
                <li
                  key={idx}
                  className={`${componentsTheme.partnersOpportunities.benefitItemBase} ${
                    idx !== arr.length - 1
                      ? componentsTheme.partnersOpportunities.benefitItemBordered
                      : ''
                  }`}
                >
                  <span className={componentsTheme.partnersOpportunities.checkCircle}>
                    <Check className={componentsTheme.partnersOpportunities.checkIcon} />
                  </span>
                  <span className={componentsTheme.partnersOpportunities.benefitLabel}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <div className={componentsTheme.partnersOpportunities.cardFooter}>
              <Button
                href="/apply/community-institution"
                className="w-full"
                variant="primary"
              >
                Choose Plan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
