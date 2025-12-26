import HeroSection from '@/components/ui/HeroSection';
import EarlyBidCTA from '@/components/sections/EarlyBidCTA';
import SelfFundedOverviewSection from '@/components/apply/self-funded/SelfFundedOverview';
import SelfFundedPaymentSection from '@/components/apply/self-funded/SelfFundedPayment';
import SelfFundedPaymentMethodsSection from '@/components/apply/self-funded/SelfFundedPaymentMethods';

export default function SelfFundedPage() {
  return (
    <main className="relative">
      <HeroSection
        title="Self Funded Registration"
        subtitle="Osaka, Japan 2026 | 11 May - 15 May"
        bgImage="/img/bgprogramoverview.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/apply', label: 'Apply' },
          { href: '/apply/self-funded', label: 'Self Funded' },
        ]}
      />
      <SelfFundedOverviewSection />
      <EarlyBidCTA />
      <SelfFundedPaymentSection />
      <SelfFundedPaymentMethodsSection />
    </main>
  );
}
