import Hero from '@/components/sections/Hero';
import HomeRegistrationStrip from '@/components/sections/HomeRegistrationStrip';
import { pickDefaultEditionIndex } from '@/lib/registration/edition';
import { SelectedEditionProvider } from '@/components/sections/SelectedEditionContext';
import AboutProgram from '@/components/sections/AboutProgram';
import HomeImportantPayment from '@/components/sections/HomeImportantPayment';
import ProgramHighlights from '@/components/sections/ProgramHighlights';
import SupportedBy from '@/components/sections/SupportedBy';
import VideoSection from '@/components/sections/VideoSection';
import MomentsIn60Section from '@/components/sections/MomentsIn60Section';
import GlobalProgramImpact from '@/components/sections/GlobalProgramImpact';
import ParticipantDistribution from '@/components/sections/ParticipantDistribution';
import FurtherInformationSection from '@/components/sections/FurtherInformation';
import WhatMakesUsSpecialSection from '@/components/sections/WhatMakesUsSpecial';
import ProgramBenefitsSection from '@/components/sections/ProgramBenefitsSection';
import AlumniStoriesSection from '@/components/sections/AlumniStories';
import PhotoGallery from '@/components/sections/PhotoGallery';
import RecognitionAwards from '@/components/sections/AwardeeDelegate';
import Recognition from '@/components/sections/Recognition';
import Testimonials from '@/components/sections/Testimonials';
import GetInTouchSection from '@/components/sections/GetInTouchSection';
import { getHomePageData } from '@/lib/api/home';
import { resolveBrandDomain } from '@/lib/server/envContext';
import PromoCTA from '@/components/sections/PromoCTA';
import { resolveRegistrationCountdown, type RegistrationCategory } from '@/lib/registration/deadline';
import { getActivityData } from '@/lib/api/activity';
import { ActivityToast } from '@/components/marketing/ActivityToast';
import type {
  MainBannerSection,
  RegistrationOverviewSection,
  ProgramOverviewSection,
  ProgramHighlightsSection,
  ProgramObjectivesSection,
  ProgramGallerySection,
  ProgramHighlightVideosSection,
  AlumniStoriesSection as AlumniStoriesApiSection,
  ProgramAwardsSection,
  SupportedBySection,
  ProgramShortsSection,
  ProgramImpactSection,
  ProgramFeaturesSection,
  ProgramBenefitsSection as ProgramBenefitsSectionType,
  DelegateTestimonialsSection,
  OrganizationCredentialsSection,
  PaymentInfoSection,
  ParticipantDemographicsSection,
  FurtherInformationSection as HomeFurtherInformationSection,
  PromoCTASection,
} from '@/types/home';

// "Korea Youth Summit 4th" + 2026 -> "Korea Youth Summit 4th 2026". The year is
// only appended when the program name doesn't already carry it, so editions
// already named with their year ("KYS 2025") don't read as "KYS 2025 2025".
function galleryEditionLabel(programName: string, year: number | null): string {
  const name = programName.trim();
  if (year === null) return name;
  if (!name) return String(year);
  return name.includes(String(year)) ? name : `${name} ${year}`;
}

export default async function Home() {
  const host = await resolveBrandDomain();

  const [activityItems, homeData] = await Promise.all([
    getActivityData(host),
    getHomePageData(host).catch((e) => {
      console.error('Failed to fetch home page data', e);
      return {
        title: 'Youth Summit',
        slug: null,
        sections: [],
      } as unknown as Awaited<ReturnType<typeof getHomePageData>>;
    }),
  ]);


  const mainBannerSection = homeData.sections.find(
    (section): section is MainBannerSection => section.type === 'main_banner'
  );
  const registrationOverviewSection = homeData.sections.find(
    (section): section is RegistrationOverviewSection =>
      section.type === 'registration_overview'
  );

  // The signup link's applicationCategory: the category of the registration
  // window that is actually running, read off the home payload we already
  // have. This used to be three sequential backend calls (settings, program
  // detail, pricing tiers) feeding a scanner that compared raw end dates and
  // ignored whether a window had started, so it could preselect a category
  // that does not open until October. Same rule, same windows as the layout
  // countdown and the fee card badges now.
  const runningWindow = resolveRegistrationCountdown(
    registrationOverviewSection?.content.programs,
    new Date(),
  );
  const activeCategory: RegistrationCategory | null = runningWindow?.category ?? null;
  const registerUrl = activeCategory
    ? `/login?mode=signup&applicationCategory=${activeCategory}`
    : '/login?mode=signup';

  const programOverviewSection = homeData.sections.find(
    (section): section is ProgramOverviewSection => section.type === 'program_overview'
  );
  const programHighlightsSection = homeData.sections.find(
    (section): section is ProgramHighlightsSection => section.type === 'program_highlights'
  );
  const programObjectivesSection = homeData.sections.find(
    (section): section is ProgramObjectivesSection => section.type === 'program_objectives'
  );
  const programGallerySection = homeData.sections.find(
    (section): section is ProgramGallerySection => section.type === 'program_gallery'
  );
  const programHighlightVideosSection = homeData.sections.find(
    (section): section is ProgramHighlightVideosSection =>
      section.type === 'program_highlight_videos'
  );
  const alumniStoriesSection = homeData.sections.find(
    (section): section is AlumniStoriesApiSection => section.type === 'alumni_stories'
  );
  const programAwardsSection = homeData.sections.find(
    (section): section is ProgramAwardsSection => section.type === 'program_awards'
  );
  const supportedBySection = homeData.sections.find(
    (section): section is SupportedBySection => section.type === 'supported_by'
  );
  const programShortsSection = homeData.sections.find(
    (section): section is ProgramShortsSection => section.type === 'program_shorts'
  );
  const programImpactSection = homeData.sections.find(
    (section): section is ProgramImpactSection => section.type === 'program_impact'
  );

  const programFeaturesSection = homeData.sections.find(
    (section): section is ProgramFeaturesSection => section.type === 'program_features'
  );
  const programBenefitsSection = homeData.sections.find(
    (section): section is ProgramBenefitsSectionType => section.type === 'program_benefits'
  );
  const delegateTestimonialsSection = homeData.sections.find(
    (section): section is DelegateTestimonialsSection => section.type === 'delegate_testimonials'
  );
  const organizationCredentialsSection = homeData.sections.find(
    (section): section is OrganizationCredentialsSection => section.type === 'organization_credentials'
  );
  const paymentInfoSection = homeData.sections.find(
    (section): section is PaymentInfoSection => section.type === 'payment_info'
  );
  const participantDemographicsSection = homeData.sections.find(
    (section): section is ParticipantDemographicsSection => section.type === 'participant_demographics'
  );
  const promoCTASection = homeData.sections.find(
    (section): section is PromoCTASection => section.type === 'promo_cta'
  );
  const furtherInformationSection = homeData.sections.find(
    (section): section is HomeFurtherInformationSection => section.type === 'further_information'
  );

  const objectivesImageGallery = programObjectivesSection
    ? (programObjectivesSection.content.gallery ?? programObjectivesSection.content.images ?? []).map(img => ({
        url: img.url,
        caption: img.caption,
        type: 'objective',
      }))
    : (programHighlightsSection?.content.gallery ?? programHighlightsSection?.content.image_gallery);

  const objectivesTitle =
    programObjectivesSection?.content.title ?? programHighlightsSection?.content.content.title;
  const objectivesEyebrow = programObjectivesSection?.content.eyebrow;
  const objectivesIntro = programObjectivesSection?.content.intro;

  const objectivesItems = programObjectivesSection
    ? [...programObjectivesSection.content.items]
        .sort((a, b) => a.order - b.order)
        .map(item => item.description)
    : programHighlightsSection?.content.content.items;

  const furtherGuidebooks = registrationOverviewSection?.content.guidelines
    .slice(0, 2)
    .map((g, index) => ({
      href: g.url,
      label: g.title,
      // guideline pertama dibikin gaya primary, sisanya tampil sebagai secondary
      locale: (index === 0 ? 'eng' : 'ind') as 'eng' | 'ind',
    }));

  // Per-edition guidebooks, same order as HomeRegistrationStrip's tabs, so
  // the Further Information band follows whichever edition the visitor has
  // selected instead of always showing the section-level (newest) fallback.
  const programEditions = registrationOverviewSection?.content.programs ?? [];
  const guidebookEditions = programEditions.map((edition) =>
    (edition.guidelines ?? []).slice(0, 2).map((g, index) => ({
      href: g.url,
      label: g.title,
      locale: (index === 0 ? 'eng' : 'ind') as 'eng' | 'ind',
    }))
  );
  const defaultEditionIndex = pickDefaultEditionIndex(programEditions);

  const galleryTitle = programGallerySection?.content.title;
  const galleryDescription = programGallerySection?.content.description;
  const galleryImages = (programGallerySection?.content.gallery ?? programGallerySection?.content.images ?? []).map(img => ({
    id: img.id,
    src: img.url,
    caption: img.caption,
  }));
  // Per-edition tabs for the homepage gallery, mirroring the video section's
  // `tabs`. Absent on a payload cached before the tabs shipped, in which case
  // PhotoGallery falls back to the flat `gallery`/`images` list above.
  const galleryEditions = (programGallerySection?.content.tabs ?? []).map(tab => ({
    id: tab.program_id,
    label: galleryEditionLabel(tab.program_name, tab.year),
    isActive: tab.is_active,
    images: tab.gallery.map(img => ({
      id: img.id,
      src: img.url,
      caption: img.caption,
    })),
  }));
  const galleryCtaLabel = programGallerySection?.content.cta.label;
  const galleryCtaUrl = programGallerySection?.content.cta.url;

  return (
    <main>
      <Hero
        imageUrl={mainBannerSection?.content.imageUrl}
        title={mainBannerSection?.content.title}
        subtitle={mainBannerSection?.content.subtitle}
        link={mainBannerSection?.content.link}
        registerUrl={registerUrl}
      />
      <SelectedEditionProvider defaultIndex={defaultEditionIndex}>
      <HomeRegistrationStrip
        igFeed={registrationOverviewSection?.content.ig_feed}
        registrationTypes={registrationOverviewSection?.content.registration_types}
        programs={registrationOverviewSection?.content.programs}
        guidelines={registrationOverviewSection?.content.guidelines}
        registerUrl={registerUrl}
      />
      <HomeImportantPayment section={paymentInfoSection} />
      <AboutProgram
        about={programOverviewSection?.content.about_us}
        vision={programOverviewSection?.content.vision_mission.vision}
        mission={programOverviewSection?.content.vision_mission.mission}
        images={(programHighlightsSection?.content.gallery ?? programHighlightsSection?.content.image_gallery)?.slice(0, 3).map(img => ({ url: img.url, caption: img.caption }))}
        backgroundImageUrl={programOverviewSection?.content.background_image_url}
        registerUrl={registerUrl}
      />
      <ProgramHighlights
        imageGallery={objectivesImageGallery}
        highlightsEyebrow={objectivesEyebrow}
        highlightsTitle={objectivesTitle}
        highlightsIntro={objectivesIntro}
        highlightItems={objectivesItems}
      />
      <SupportedBy items={supportedBySection?.data} />
      <VideoSection
        title={programHighlightVideosSection?.content.title}
        subtitle={programHighlightVideosSection?.content.subtitle}
        tabs={programHighlightVideosSection?.content.tabs?.map(tab => ({
          ...tab,
          videos: tab.videos.map(video => ({
            ...video,
            video_url: 'https://youtu.be/wg30gPtb9eY?si=ikHepE3A6vhXTBeG',
            thumbnail: '', // Empty thumbnail to use automatic YouTube thumbnail
          }))
        }))}
      />
      <MomentsIn60Section section={programShortsSection} />
      <section className="h-20" />
      <GlobalProgramImpact section={programImpactSection} />
      <ParticipantDistribution
        eyebrow={participantDemographicsSection?.content.eyebrow}
        title={participantDemographicsSection?.content.title}
        countryLevels={participantDemographicsSection?.content.country_levels}
        countryParticipants={participantDemographicsSection?.content.country_participants}
        legend={participantDemographicsSection?.content.legend}
      />
      <FurtherInformationSection
        eyebrow={furtherInformationSection?.content.eyebrow}
        title={furtherInformationSection?.content.title}
        subtitle={furtherInformationSection?.content.subtitle}
        desktopBackgroundImageUrl={furtherInformationSection?.content.background_image_url ?? undefined}
        mobileBackgroundImageUrl={furtherInformationSection?.content.background_image_mobile_url ?? undefined}
        mockupImageUrl={furtherInformationSection?.content.mockup_image_url ?? undefined}
        guidebooks={furtherGuidebooks}
        guidebookEditions={guidebookEditions}
        textColorScheme={furtherInformationSection?.content.text_color_scheme ?? 'dark'}
      />
      </SelectedEditionProvider>
      <WhatMakesUsSpecialSection section={programFeaturesSection} />
      <ProgramBenefitsSection section={programBenefitsSection} />
      <AlumniStoriesSection
        title={alumniStoriesSection?.content.title}
        subtitle={alumniStoriesSection?.content.subtitle}
        items={alumniStoriesSection?.content.items}
      />
      <Testimonials section={delegateTestimonialsSection} />
      <PhotoGallery
        mode="home"
        title={galleryTitle}
        description={galleryDescription}
        images={galleryImages}
        editions={galleryEditions}
        ctaLabel={galleryCtaLabel}
        ctaUrl={galleryCtaUrl}
      />
      <RecognitionAwards
        title={programAwardsSection?.content.title}
        subtitle={programAwardsSection?.content.subtitle}
        apiItems={programAwardsSection?.content.items}
      />
      <Recognition section={organizationCredentialsSection} />
      {promoCTASection && (
        <PromoCTA
          eyebrow={promoCTASection.content.eyebrow}
          title={promoCTASection.content.title}
          subtitle={promoCTASection.content.subtitle}
          primaryCtaLabel={promoCTASection.content.primary_cta_label}
          primaryCtaHref={promoCTASection.content.primary_cta_href}
          registerUrl={registerUrl}
          backgroundImageUrl={promoCTASection.content.background_image_url ?? undefined}
          backgroundImageMobileUrl={promoCTASection.content.background_image_mobile_url ?? undefined}
          videoUrl={promoCTASection.content.video_url ?? undefined}
          videoTitle={promoCTASection.content.video_title ?? undefined}
          videoDescription={promoCTASection.content.video_description ?? undefined}
          textColorScheme={promoCTASection.content.text_color_scheme ?? 'dark'}
        />
      )}
      <GetInTouchSection />
      {/* <FAQ /> */}
      <ActivityToast items={activityItems} />
    </main>
  );
}
