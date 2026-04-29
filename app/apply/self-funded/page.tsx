import HeroSection from '@/components/ui/HeroSection';
import EarlyBidCTA from '@/components/sections/EarlyBidCTA';
import SelfFundedOverviewSection from '@/components/apply/self-funded/SelfFundedOverview';
import SelfFundedPaymentSection from '@/components/apply/self-funded/SelfFundedPayment';
import SelfFundedPaymentMethodsSection from '@/components/apply/self-funded/SelfFundedPaymentMethods';
import { headers } from 'next/headers';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { getApplyPageData } from '@/lib/apply/page-data';

export default async function SelfFundedPage() {
  const host = (await headers()).get('host') || '';
  const [heroMedia, applyData] = await Promise.all([
    getLandingHeroMedia(host, 'programs', {
      preferredImages: [],
      fallbackImage: '/img/bgprogramoverview.png',
    }),
    getApplyPageData(host, 'self_funded'),
  ]);

  return (
    <main className="relative">
      <HeroSection
        title="Self Funded Registration"
        subtitle={applyData.heroSubtitle}
        bgImage={heroMedia.bgImage ?? '/img/bgprogramoverview.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/apply', label: 'Apply' },
          { href: '/apply/self-funded', label: 'Self Funded' },
        ]}
      />
      <SelfFundedOverviewSection data={applyData.overview} />
      <EarlyBidCTA deadlineIso={applyData.registrationDeadline} />
      <SelfFundedPaymentSection
        schemeLabel="Self Funded"
        registrationCard={applyData.payment.registrationCard}
        programCard={applyData.payment.programCard}
        registrationWindow={applyData.payment.registrationWindow}
      />
      <SelfFundedPaymentMethodsSection data={applyData.paymentMethods} />
    </main>
  );
}
