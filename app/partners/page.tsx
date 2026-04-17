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

              {ctaBecomePartnerSection.content.video_url ? (
              <div className={componentsTheme.promoCta.rightCol}>
                <div className={componentsTheme.promoCta.videoCard}>
                  <div className={componentsTheme.promoCta.videoFrameWrapper}>
                    <iframe
                      src={ctaBecomePartnerSection.content.video_url}
                      title={ctaBecomePartnerSection.content.video_title ?? 'Program Video'}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  {(ctaBecomePartnerSection.content.video_title || ctaBecomePartnerSection.content.video_description) && (
                  <div className="mt-3">
                    {ctaBecomePartnerSection.content.video_title && (
                      <h3 className={componentsTheme.promoCta.videoTitle}>
                        {ctaBecomePartnerSection.content.video_title}
                      </h3>
                    )}
                    {ctaBecomePartnerSection.content.video_description && (
                      <p className={componentsTheme.promoCta.videoDescription}>
                        {ctaBecomePartnerSection.content.video_description}
                      </p>
                    )}
                  </div>
                  )}
                </div>
              </div>
              ) : null}
            </div>
          </section>
        </SetPromoCTA>
      ) : null}

      <WhyPartnerSection />
      <PartnershipOpportunitiesSection
        affiliateCommission={
          ctaBecomePartnerSection?.content.affiliate_commission
            ? {
                fullyFundedPct: ctaBecomePartnerSection.content.affiliate_commission.fully_funded_pct,
                selfFundedPct: ctaBecomePartnerSection.content.affiliate_commission.self_funded_pct,
              }
            : undefined
        }
      />
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
