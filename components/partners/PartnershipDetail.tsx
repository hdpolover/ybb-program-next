import { Check } from 'lucide-react';
import { jysSectionTheme } from '@/lib/theme/jys-components';

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
      ? jysSectionTheme.partnersDetail.gradientRightCommunity
      : slug === 'silver-partner'
        ? jysSectionTheme.partnersDetail.gradientRightSilver
        : slug === 'gold-partner'
          ? jysSectionTheme.partnersDetail.gradientRightGold
          : jysSectionTheme.partnersDetail.gradientRightDiamond;

  return (
    <section className={jysSectionTheme.partnersDetail.sectionWrapper}>
      <div className={jysSectionTheme.partnersDetail.container}>
        <div className={jysSectionTheme.partnersDetail.card}>
          <div className={jysSectionTheme.partnersDetail.headerRow}>
            <div>
              <h2 className={jysSectionTheme.partnersDetail.title}>{pkg.title}</h2>
              <p className={jysSectionTheme.partnersDetail.bestForLabel}>{pkg.bestFor}</p>
            </div>
            <div className={jysSectionTheme.partnersDetail.priceText}>{pkg.price}</div>
          </div>

          <div className={jysSectionTheme.partnersDetail.bodyGrid}>
            {pkg.bullets.map(item => (
              <div key={item} className={jysSectionTheme.partnersDetail.bulletRow}>
                <Check className={jysSectionTheme.partnersDetail.bulletIcon} />
                <span className={jysSectionTheme.partnersDetail.bulletText}>{item}</span>
              </div>
            ))}
          </div>

          <div
            className={`${jysSectionTheme.partnersDetail.gradientRightBase} ${gradientVariant}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
