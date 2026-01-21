import Hero from '@/components/sections/Hero';
import HomeRegistrationStrip from '@/components/sections/HomeRegistrationStrip';
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
import FAQ from '@/components/sections/FAQ';
import GetInTouchSection from '@/components/sections/GetInTouchSection';
import { getHomePageData } from '@/lib/api/home';
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
} from '@/types/home';

export default async function Home() {
  const homeData = await getHomePageData();
  const mainBannerSection = homeData.sections.find(
    (section): section is MainBannerSection => section.type === 'main_banner'
  );
  const registrationOverviewSection = homeData.sections.find(
    (section): section is RegistrationOverviewSection =>
      section.type === 'registration_overview'
  );
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

  const objectivesImageGallery = programObjectivesSection
    ? programObjectivesSection.content.images.map(img => ({
        url: img.url,
        caption: img.caption,
        type: 'objective',
      }))
    : programHighlightsSection?.content.image_gallery;

  const objectivesTitle =
    programObjectivesSection?.content.title ?? programHighlightsSection?.content.content.title;

  const objectivesItems = programObjectivesSection
    ? [...programObjectivesSection.content.items]
        .sort((a, b) => a.order - b.order)
        .map(item => item.description)
    : programHighlightsSection?.content.content.items;

  const furtherGuidebooks = registrationOverviewSection?.content.guidelines.map((g, index) => ({
    href: g.url,
    label: g.title,
    // first guideline styled as primary, others as secondary
    locale: (index === 0 ? 'eng' : 'ind') as 'eng' | 'ind',
  }));

  const galleryTitle = programGallerySection?.content.title;
  const galleryDescription = programGallerySection?.content.description;
  const galleryImages = programGallerySection?.content.images.map(img => ({
    id: img.id,
    src: img.url,
    caption: img.caption,
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
      />
      <HomeRegistrationStrip
        igFeed={registrationOverviewSection?.content.ig_feed}
        registrationTypes={registrationOverviewSection?.content.registration_types}
        guidelines={registrationOverviewSection?.content.guidelines}
      />
      <HomeImportantPayment />
      <AboutProgram
        about={programOverviewSection?.content.about_us}
        vision={programOverviewSection?.content.vision_mission.vision}
        mission={programOverviewSection?.content.vision_mission.mission}
      />
      <ProgramHighlights
        imageGallery={objectivesImageGallery}
        highlightsTitle={objectivesTitle}
        highlightItems={objectivesItems}
      />
      <SupportedBy items={supportedBySection?.data} />
      <VideoSection
        title={programHighlightVideosSection?.content.title}
        subtitle={programHighlightVideosSection?.content.subtitle}
        tabs={programHighlightVideosSection?.content.tabs}
      />
      <MomentsIn60Section />
      <section className="h-20" />
      <GlobalProgramImpact />
      <ParticipantDistribution />
      <FurtherInformationSection guidebooks={furtherGuidebooks} />
      <WhatMakesUsSpecialSection />
      <ProgramBenefitsSection />
      <AlumniStoriesSection
        title={alumniStoriesSection?.content.title}
        subtitle={alumniStoriesSection?.content.subtitle}
        items={alumniStoriesSection?.content.items}
      />
      <Testimonials />
      <PhotoGallery
        mode="home"
        title={galleryTitle}
        description={galleryDescription}
        images={galleryImages}
        ctaLabel={galleryCtaLabel}
        ctaUrl={galleryCtaUrl}
      />
      <RecognitionAwards
        title={programAwardsSection?.content.title}
        subtitle={programAwardsSection?.content.subtitle}
        apiItems={programAwardsSection?.content.items}
      />
      <Recognition />
      <GetInTouchSection />
      {/* <FAQ /> */}
    </main>
  );
}
