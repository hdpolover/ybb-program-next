import HeroSection from '@/components/ui/HeroSection';
import PartnershipDetailSection from '@/components/partners/PartnershipDetail';
import RequireNowSection from '@/components/partners/RequireNow';
import { getPartnersPageData } from '@/lib/api/partners';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { headers } from 'next/headers';
import type { CtaBecomePartnerSection } from '@/types/partners';

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const host = (await headers()).get('host') || '';
  const [partnersPage, heroMedia] = await Promise.all([
    getPartnersPageData(host).catch(() => null),
    getLandingHeroMedia(host, `partners-detail-${slug}`, {
      fallbackImage: '/img/sponsorpartnershipbg.png',
    }),
  ]);

  const ctaSection = partnersPage?.sections.find(
    (s): s is CtaBecomePartnerSection => s.type === 'cta_become_partner',
  );

  return (
    <main className="relative">
      <HeroSection
        title="Partnerships Enquiry Form"
        subtitle="Review your selected partnership package and submit your enquiry to our team."
        bgImage={heroMedia.bgImage ?? '/img/sponsorpartnershipbg.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/partners', label: 'Partners & Sponsors' },
          { label: 'Partnerships Enquiry Form' },
        ]}
        heightClass="min-h-[260px] md:min-h-[300px]"
        decorVariant="compact"
      />
      <PartnershipDetailSection
        slug={slug}
        sponsorshipTiers={ctaSection?.content.sponsorship_tiers}
        affiliateCommission={ctaSection?.content.affiliate_commission}
      />
      <RequireNowSection slug={slug} />
    </main>
  );
}
