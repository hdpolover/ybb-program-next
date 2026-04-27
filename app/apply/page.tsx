import HeroSection from '@/components/ui/HeroSection';
import RegistrationTypePrograms from '@/components/programs/registrationTypes';
import ProgramsFurtherInformationSection from '@/components/programs/ProgramsFurtherInformation';
import { getProgramsPageData } from '@/lib/api/programs';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import { headers } from 'next/headers';
import type { RegistrationInfoSection } from '@/types/programs';

export default async function ApplyPage() {
  const host = (await headers()).get('host') || '';
  const [programsPage, heroMedia] = await Promise.all([
    getProgramsPageData(host),
    getLandingHeroMedia(host, 'programs', {
      preferredImages: [],
      fallbackImage: '/img/programsbackground.png',
    }),
  ]);

  const registrationInfoSection = programsPage.sections.find(
    (section): section is RegistrationInfoSection => section.type === 'registration_info',
  );

  return (
    <main className="relative">
      <HeroSection
        title="Apply Now"
        subtitle="Choose your registration type and continue with the right application path."
        bgImage={heroMedia.bgImage ?? '/img/programsbackground.png'}
        galleryImages={heroMedia.galleryImages}
        breadcrumb={[
          { href: '/', label: 'Home' },
          { href: '/apply', label: 'Apply' },
        ]}
      />
      <RegistrationTypePrograms
        pricingTiers={registrationInfoSection?.content.pricing_tiers}
        instructions={registrationInfoSection?.content.instructions}
        title={registrationInfoSection?.content.title}
        description={registrationInfoSection?.content.description}
        status={registrationInfoSection?.content.status}
        registrationDates={registrationInfoSection?.content.registration_dates}
      />
      <ProgramsFurtherInformationSection />
    </main>
  );
}
