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
import { getHomePageData } from '@/lib/api/home';
import type { RegistrationOverviewSection } from '@/types/home';

export default async function ProgramOverviewPage() {
  const [programsPage, homeData] = await Promise.all([
    getProgramsPageData(),
    getHomePageData(),
  ]);

  const registrationOverviewSection = homeData.sections.find(
    (section): section is RegistrationOverviewSection => section.type === 'registration_overview',
  );

  const heroSection = programsPage.sections.find(
    section => section.type === 'hero',
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
      <CurrentProgram />
      <RegistrationTypePrograms
        registrationTypes={registrationOverviewSection?.content.registration_types}
      />
      <section className="h-10" />
      <ProgramActivities />
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
