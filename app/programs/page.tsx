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

export default function ProgramOverviewPage() {
  return (
    <main className="relative">
      <HeroSection
        title="Japan Youth Summit 2026"
        subtitle="Explore the full details of our latest program edition – dates, activities, requirements, and everything you need to join Japan Youth Summit 2026."
        bgImage="/img/programsbackground.png"
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/programs', label: 'Japan Youth Summit 2026' },
        ]}
      />
      <CurrentProgram />
      <RegistrationTypePrograms />
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
