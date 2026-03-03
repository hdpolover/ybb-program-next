import HeroSection from '@/components/ui/HeroSection';
import CurrentProgram from '@/components/programs/CurrentProgram';
import RegistrationTypePrograms from '@/components/programs/registrationTypes';
import ProgramActivities from '@/components/programs/ProgramActivities';
import ProgramSteps from '@/components/programs/ProgramSteps';
import ProgramSchedules from '@/components/programs/ProgramSchedules';
import PreviousProgramsGrid from '@/components/programs/PreviousProgramsGrid';
import AdditionalPrograms from '@/components/programs/AdditionalPrograms';
import MissionVision from '@/components/programs/MissionVision';
import Objectives from '@/components/programs/Objectives';
import Benefits from '@/components/programs/Benefits';
import ProgramFAQ from '@/components/programs/ProgramFAQ';
import FAQ from '@/components/sections/FAQ';
import ProgramsFurtherInformationSection from '@/components/programs/ProgramsFurtherInformation';
import { getProgramsPageData } from '@/lib/api/programs';
import { PROGRAMS_FALLBACK_HERO } from '@/data/programs/sections/overview/programsOverview';
import type {
  ProgramActivitiesSection,
  ProgramJourneySection,
  ProgramOverviewSection,
  RegistrationInfoSection,
  ProgramImportantDatesSection,
  PreviousProgramsSection,
  ProgramFaqsSection,
  OtherProgramsSection,
} from '@/types/programs';

export default async function ProgramOverviewPage() {
  const programsPage = await getProgramsPageData();

  const heroSection = programsPage.sections.find(
    section => section.type === 'hero',
  );

  const programOverviewSection = programsPage.sections.find(
    (section): section is ProgramOverviewSection => section.type === 'program_overview',
  );

  const registrationInfoSection = programsPage.sections.find(
    (section): section is RegistrationInfoSection => section.type === 'registration_info',
  );

  const programActivitiesSection = programsPage.sections.find(
    (section): section is ProgramActivitiesSection => section.type === 'program_activities',
  );

  const programJourneySection = programsPage.sections.find(
    (section): section is ProgramJourneySection => section.type === 'program_journey',
  );

  const programImportantDatesSection = programsPage.sections.find(
    (section): section is ProgramImportantDatesSection =>
      section.type === 'program_important_dates',
  );

  const previousProgramsSection = programsPage.sections.find(
    (section): section is PreviousProgramsSection => section.type === 'previous_programs',
  );

  const programFaqsSection = programsPage.sections.find(
    (section): section is ProgramFaqsSection => section.type === 'program_faqs',
  );

  const otherProgramsSection = programsPage.sections.find(
    (section): section is OtherProgramsSection => section.type === 'other_programs',
  );

  const heroTitle =
    heroSection?.type === 'hero' ? heroSection.content.title : PROGRAMS_FALLBACK_HERO.title;
  const heroSubtitle =
    heroSection?.type === 'hero'
      ? heroSection.content.subtitle
      : PROGRAMS_FALLBACK_HERO.subtitle;
  const heroBgImage =
    heroSection?.type === 'hero' && heroSection.content.bg_image
      ? heroSection.content.bg_image
      : '/img/programsbackground.png';

  return (
    <main className="relative">
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={heroBgImage}
        breadcrumb={[
          { href: `/${programsPage.slug}`, label: programsPage.slug },
          { href: `/${programsPage.slug}`, label: programsPage.title },
        ]}
      />
      <CurrentProgram overview={programOverviewSection?.content} />
      <RegistrationTypePrograms
        pricingTiers={registrationInfoSection?.content.pricing_tiers}
        instructions={registrationInfoSection?.content.instructions}
        title={registrationInfoSection?.content.title}
        description={registrationInfoSection?.content.description}
        status={registrationInfoSection?.content.status}
        registrationDates={registrationInfoSection?.content.registration_dates}
      />
      <section className="h-10" />
      <ProgramActivities activities={programActivitiesSection?.content} />
      <ProgramSteps journey={programJourneySection?.content} />
      <ProgramSchedules dates={programImportantDatesSection?.content} />
      <PreviousProgramsGrid previous={previousProgramsSection?.content} />
      {/* <MissionVision />
      <Objectives />
      <Benefits /> */}
      <AdditionalPrograms otherPrograms={otherProgramsSection?.content} />
      <ProgramFAQ fqs={programFaqsSection?.content} />
      <ProgramsFurtherInformationSection />
    </main>
  );
}
