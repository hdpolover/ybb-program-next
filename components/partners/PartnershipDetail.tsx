import { Check } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';

const PACKAGES: Record<
  string,
  {
    title: string;
    bestFor: string;
    price: string;
    bullets: string[];
  }
> = {
  'community-partner': {
    title: 'Community Partner',
    bestFor: 'Best for: Universities, NGOs, and community organizations.',
    price: 'Flexible',
    bullets: [
      'Website recognition',
      'Social media mentions',
      'Networking opportunities',
      'Partnership certificate',
      'Volunteer opportunities',
    ],
  },
  'silver-partner': {
    title: 'Silver Partner',
    bestFor: 'Best for: Organizations starting strategic collaboration.',
    price: '$10,000+',
    bullets: [
      'Logo placement on website',
      'Newsletter mentions',
      'Event participation opportunities',
      'Impact reports',
      'Certificate of partnership',
    ],
  },
  'gold-partner': {
    title: 'Gold Partner',
    bestFor: 'Best for: Strong brand exposure across main program activities.',
    price: '$25,000+',
    bullets: [
      'Prominent logo placement',
      'Workshop sponsorship opportunities',
      'Alumni network access',
      'Quarterly impact reports',
      'Social media recognition',
    ],
  },
  'affiliate-program': {
    title: 'Affiliate Program',
    bestFor: 'Best for: Individuals promoting YBB programs.',
    price: 'Commission-based',
    bullets: [
      'Fully-funded Affiliate: Earn 20% commission per successful registration',
      'Commission applies to registration fee',
      'Performance-based partnership',
      'Self-funded Affiliate: Earn 5% commission from program fees',
      'No minimum referrals required',
      'Flexible and results-driven',
    ],
  },
  'diamond-partner': {
    title: 'Diamond Partner',
    bestFor: 'Best for: Communities and service-based organizations.',
    price: '$50,000+',
    bullets: [
      'Premier logo placement on all materials',
      'Speaking opportunities at main events',
      'Dedicated networking sessions',
      'Annual partnership report',
      'Direct access to alumni network',
      'Custom partnership activities',
    ],
  },
};

function getPackage(slug: string) {
  return PACKAGES[slug] ?? PACKAGES['community-partner'];
}

export default function PartnershipDetailSection({ slug }: { slug: string }) {
  const pkg = getPackage(slug);

   const gradientVariant =
    slug === 'community-partner'
      ? componentsTheme.partnersDetail.gradientRightCommunity
      : slug === 'silver-partner'
        ? componentsTheme.partnersDetail.gradientRightSilver
        : slug === 'gold-partner'
          ? componentsTheme.partnersDetail.gradientRightGold
          : componentsTheme.partnersDetail.gradientRightDiamond;

  return (
    <section className={componentsTheme.partnersDetail.sectionWrapper}>
      <div className={componentsTheme.partnersDetail.container}>
        <div className={componentsTheme.partnersDetail.card}>
          <div className={componentsTheme.partnersDetail.headerRow}>
            <div>
              <h2 className={componentsTheme.partnersDetail.title}>{pkg.title}</h2>
              <p className={componentsTheme.partnersDetail.bestForLabel}>{pkg.bestFor}</p>
            </div>
            <div className={componentsTheme.partnersDetail.priceText}>{pkg.price}</div>
          </div>

          <div className={componentsTheme.partnersDetail.bodyGrid}>
            {slug === 'affiliate-program' ? (
              <>
                <div className="pb-1 text-sm font-extrabold text-blue-900">Fully-funded Affiliate</div>
                {[
                  'Earn 20% commission per successful registration',
                  'Commission applies to registration fee',
                  'Performance-based partnership',
                ].map(item => (
                  <div key={`fully-${item}`} className={componentsTheme.partnersDetail.bulletRow}>
                    <Check className={componentsTheme.partnersDetail.bulletIcon} />
                    <span className={componentsTheme.partnersDetail.bulletText}>{item}</span>
                  </div>
                ))}

                <div className="pt-3 pb-1 text-sm font-extrabold text-blue-900">
                  Self-Funded Affiliate
                </div>
                {[
                  'Earn 5% commission from program fees',
                  'No minimum referrals required',
                  'Flexible and results-driven',
                ].map(item => (
                  <div key={`self-${item}`} className={componentsTheme.partnersDetail.bulletRow}>
                    <Check className={componentsTheme.partnersDetail.bulletIcon} />
                    <span className={componentsTheme.partnersDetail.bulletText}>{item}</span>
                  </div>
                ))}
              </>
            ) : (
              pkg.bullets.map(item => (
                <div key={item} className={componentsTheme.partnersDetail.bulletRow}>
                  <Check className={componentsTheme.partnersDetail.bulletIcon} />
                  <span className={componentsTheme.partnersDetail.bulletText}>{item}</span>
                </div>
              ))
            )}
          </div>

          <div
            className={`${componentsTheme.partnersDetail.gradientRightBase} ${gradientVariant}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
