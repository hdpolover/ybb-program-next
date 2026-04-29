import HeroSection from '@/components/ui/HeroSection';
import EarlyBidCTA from '@/components/sections/EarlyBidCTA';
import FullyFundedOverviewSection from '@/components/apply/fully-funded/FullyFundedOverview';
import FullyFundedPaymentSection from '@/components/apply/fully-funded/FullyFundedPayment';
import FullyFundedPaymentMethodsSection from '@/components/apply/fully-funded/FullyFundedPaymentMethods';
import { headers } from 'next/headers';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { getApplyPageData } from '@/lib/apply/page-data';

export default async function FullyFundedPage() {
  const host = (await headers()).get('host') || '';
  const [heroMedia, applyData] = await Promise.all([
    getLandingHeroMedia(host, 'programs', {
      preferredImages: [],
      fallbackImage: '/img/bgprogramoverview.png',
    }),
    getApplyPageData(host, 'fully_funded'),
  ]);

  return (
    <main className="relative">
      <HeroSection
        title="Fully Funded Registration"
        subtitle={applyData.heroSubtitle}
        bgImage={heroMedia.bgImage ?? '/img/bgprogramoverview.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/apply', label: 'Apply' },
          { href: '/apply/fully-funded', label: 'Fully Funded' },
        ]}
      />
      <FullyFundedOverviewSection data={applyData.overview} />
      <EarlyBidCTA deadlineIso={applyData.registrationDeadline} />
      <FullyFundedPaymentSection
        schemeLabel="Fully Funded"
        registrationCard={applyData.payment.registrationCard}
        programCard={applyData.payment.programCard}
        registrationWindow={applyData.payment.registrationWindow}
      />
      <FullyFundedPaymentMethodsSection data={applyData.paymentMethods} />
    </main>
  );
}
