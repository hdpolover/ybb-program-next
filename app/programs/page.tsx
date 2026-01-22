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
import type {
  ProgramActivitiesSection,
  ProgramOverviewSection,
  RegistrationInfoSection,
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

  const heroTitle =
    heroSection?.type === 'hero' ? heroSection.content.title : 'Istanbul Youth Summit Programs';
  const heroSubtitle =
    heroSection?.type === 'hero'
      ? heroSection.content.subtitle
      : 'Discover our international youth programs and summits.';
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
      <ProgramSteps />
      <ProgramSchedules />
      <PreviousProgramsGrid />
      {/* <MissionVision />
      <Objectives />
      <Benefits /> */}
      <AdditionalPrograms />
      <FAQ />
      <ProgramsFurtherInformationSection />
    </main>
  );
}
