import HeroSection from '@/components/ui/HeroSection';
import EarlyBidCTA from '@/components/sections/EarlyBidCTA';
import FullyFundedOverviewSection from '@/components/apply/fully-funded/FullyFundedOverview';
import FullyFundedPaymentSection from '@/components/apply/fully-funded/FullyFundedPayment';
import FullyFundedPaymentMethodsSection from '@/components/apply/fully-funded/FullyFundedPaymentMethods';

export default function FullyFundedPage() {
  return (
    <main className="relative">
      <HeroSection
        title="Fully Funded Registration"
        subtitle="Osaka, Japan 2026 | 11 May - 15 May"
        bgImage="/img/bgprogramoverview.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/apply', label: 'Apply' },
          { href: '/apply/fully-funded', label: 'Fully Funded' },
        ]}
      />
      <FullyFundedOverviewSection />
      <EarlyBidCTA />
      <FullyFundedPaymentSection />
      <FullyFundedPaymentMethodsSection />
    </main>
  );
}
