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
import { getPartnersPageData } from '@/lib/api/partners';
import type { SponsorsGridSection } from '@/types/partners';

export default async function PartnersSponsorsPage() {
  const partnersPage = await getPartnersPageData();

  const heroSection = partnersPage.sections.find(section => section.type === 'hero');
  const sponsorsGridSection = partnersPage.sections.find(
    (section): section is SponsorsGridSection => section.type === 'sponsors_grid',
  );

  const heroHeadline = heroSection?.type === 'hero' ? heroSection.content.headline : 'Partners & Sponsors';
  const heroSubheadline =
    heroSection?.type === 'hero'
      ? heroSection.content.subheadline
      : 'Collaborating to empower youth leadership worldwide.';

  return (
    <main className="relative">
      {/* Hero — pakai komponen reusable */}
      <HeroSection
        title={heroHeadline}
        subtitle={heroSubheadline}
        bgImage="/img/sponsorpartnershipbg.png"
        breadcrumb={[
          { href: `/${partnersPage.slug}`, label: partnersPage.slug },
          { href: `/${partnersPage.slug}`, label: partnersPage.title },
        ]}
      />

      <WhyPartnerSection />
      <PartnershipOpportunitiesSection />
      <CommunityPartnersSection />
      <SponsorTiersSection sponsors={sponsorsGridSection?.data} />
      <ProvenResultsSection />
      <PartnershipJourneySection />
      <RequireNowSection />
      <PartnerFAQSection />
      {/* <PartnershipImpactSection /> */}
    </main>
  );
}
