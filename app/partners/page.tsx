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
import { headers } from 'next/headers';
import type { CtaBecomePartnerSection, PartnersGridSection, SponsorsGridSection } from '@/types/partners';
import { SetPromoCTA } from '@/components/sections/PromoCTAContext';
import { componentsTheme } from '@/lib/theme/components';

export default async function PartnersSponsorsPage() {
  const host = (await headers()).get('host') || '';
  const partnersPage = await getPartnersPageData(host);

  const heroSection = partnersPage.sections.find(section => section.type === 'hero');
  const sponsorsGridSection = partnersPage.sections.find(
    (section): section is SponsorsGridSection => section.type === 'sponsors_grid',
  );

  const partnersGridSection = partnersPage.sections.find(
    (section): section is PartnersGridSection => section.type === 'partners_grid',
  );

  const ctaBecomePartnerSection = partnersPage.sections.find(
    (section): section is CtaBecomePartnerSection => section.type === 'cta_become_partner',
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

      {ctaBecomePartnerSection?.content.text && ctaBecomePartnerSection?.content.link ? (
        <SetPromoCTA>
          <section className={componentsTheme.promoCta.sectionWrapper}>
            <div className={componentsTheme.promoCta.glowLeft} />
            <div className={componentsTheme.promoCta.glowRight} />
            <div className={componentsTheme.promoCta.glowBottom} />

            <div className={componentsTheme.promoCta.container}>
              <div className={componentsTheme.promoCta.leftCol}>
                <p className={componentsTheme.promoCta.eyebrow}>Ready to Innovate?</p>
                <h2 className={componentsTheme.promoCta.title}>
                  {ctaBecomePartnerSection.content.text}
                </h2>
                <div className={componentsTheme.promoCta.actionsRow}>
                  <a
                    href={ctaBecomePartnerSection.content.link}
                    className={componentsTheme.promoCta.primaryButton}
                  >
                    Apply Now
                  </a>
                </div>
              </div>

              <div className={componentsTheme.promoCta.rightCol}>
                <div className={componentsTheme.promoCta.videoCard}>
                  <div className={componentsTheme.promoCta.videoFrameWrapper}>
                    <iframe
                      src="https://www.youtube.com/embed/tUR55Fi53rM?si=NEHbcyoMTTsFEVV4"
                      title="Japan Youth Summit 2025 Registration Guideline"
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className={componentsTheme.promoCta.videoTitle}>
                      Japan Youth Summit 2025 Registration Guideline
                    </h3>
                    <p className={componentsTheme.promoCta.videoDescription}>
                      Watch this short walkthrough to understand the step-by-step registration flow,
                      required documents, and key deadlines before you submit your application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </SetPromoCTA>
      ) : null}

      <WhyPartnerSection />
      <PartnershipOpportunitiesSection />
      <CommunityPartnersSection partners={partnersGridSection?.data} />
      <SponsorTiersSection sponsors={sponsorsGridSection?.data} />
      <ProvenResultsSection />
      <PartnershipJourneySection />
      <RequireNowSection />
      <PartnerFAQSection />
      {/* <PartnershipImpactSection /> */}
    </main>
  );
}
