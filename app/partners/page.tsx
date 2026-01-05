import HeroSection from '@/components/ui/HeroSection';
import WhyPartnerSection from '@/components/partners/WhyPartner';
import SponsorTiersSection from '@/components/partners/SponsorTiers';
import ProvenResultsSection from '@/components/partners/ProvenResults';
import CommunityPartnersSection from '@/components/partners/CommunityPartners';
import PartnershipOpportunitiesSection from '@/components/partners/PartnershipOpportunities';
import RequireNowSection from '@/components/partners/RequireNow';
// import PartnershipImpactSection from '@/components/partners/PartnershipImpact';
import PartnershipJourneySection from '@/components/partners/PartnershipJourney';
import PartnerFAQSection from '@/components/partners/PartnerFAQ';

export default function PartnersSponsorsPage() {
  return (
    <main className="relative">
      {/* Hero — pakai komponen reusable */}
      <HeroSection
        title="Partners & Sponsors"
        subtitle="Collaborating to empower youth leadership worldwide."
        bgImage="/img/sponsorpartnershipbg.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/partners', label: 'Partners & Sponsors' },
        ]}
      />

      <WhyPartnerSection />
      <PartnershipOpportunitiesSection />
      <CommunityPartnersSection />
      <SponsorTiersSection />
      <ProvenResultsSection />
      <PartnershipJourneySection />
      <RequireNowSection />
      <PartnerFAQSection />
      {/* <PartnershipImpactSection /> */}
    </main>
  );
}
