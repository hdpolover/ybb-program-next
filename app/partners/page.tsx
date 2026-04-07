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
import type { CtaBecomePartnerSection, PartnersGridSection, SponsorsGridSection } from '@/types/partners';
import { SetPromoCTA } from '@/components/sections/PromoCTAContext';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import Image from 'next/image';

export default async function PartnersSponsorsPage() {
  const partnersPage = await getPartnersPageData();

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
          <section className={jysSectionTheme.promoCta.sectionWrapper}>
            <div className="absolute inset-0 sm:hidden">
              <Image
                src="/img/bgshorts60.jpg"
                alt=""
                fill
                priority
                className="object-cover object-center"
              />
            </div>
            <div className={jysSectionTheme.promoCta.glowLeft} />
            <div className={jysSectionTheme.promoCta.glowRight} />
            <div className={jysSectionTheme.promoCta.glowBottom} />

            <div className={jysSectionTheme.promoCta.container}>
              <div className={jysSectionTheme.promoCta.leftCol}>
                <p className={jysSectionTheme.promoCta.eyebrow}>Ready to Innovate?</p>
                <h2 className={jysSectionTheme.promoCta.title}>
                  {ctaBecomePartnerSection.content.text}
                </h2>
                <div className={jysSectionTheme.promoCta.actionsRow}>
                  <a
                    href={ctaBecomePartnerSection.content.link}
                    className={jysSectionTheme.promoCta.primaryButton}
                  >
                    Apply Now
                  </a>
                </div>
              </div>

              <div className={jysSectionTheme.promoCta.rightCol}>
                <div className={jysSectionTheme.promoCta.videoCard}>
                  <div className={jysSectionTheme.promoCta.videoFrameWrapper}>
                    <iframe
                      src="https://www.youtube.com/embed/tUR55Fi53rM?si=NEHbcyoMTTsFEVV4"
                      title="Japan Youth Summit 2025 Registration Guideline"
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className={jysSectionTheme.promoCta.videoTitle}>
                      Japan Youth Summit 2025 Registration Guideline
                    </h3>
                    <p className={jysSectionTheme.promoCta.videoDescription}>
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
