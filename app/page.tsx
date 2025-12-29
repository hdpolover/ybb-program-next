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
import AlumniStoriesSection from '@/components/sections/AlumniStories';
import PhotoGallery from '@/components/sections/PhotoGallery';
import RecognitionAwards from '@/components/sections/AwardeeDelegate';
import Recognition from '@/components/sections/Recognition';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import GetInTouchSection from '@/components/sections/GetInTouchSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <HomeRegistrationStrip />
      <HomeImportantPayment />
      <AboutProgram />
      <ProgramHighlights />
      <SupportedBy />
      <VideoSection />
      <MomentsIn60Section />
      <section className="h-20" />
      <GlobalProgramImpact />
      <ParticipantDistribution />
      <FurtherInformationSection />
      <AlumniStoriesSection />
      <Testimonials />
      <PhotoGallery mode="home" />
      <RecognitionAwards />
      <Recognition />
      <GetInTouchSection />
      {/* <FAQ /> */}
    </main>
  );
}
