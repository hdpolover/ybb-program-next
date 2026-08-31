import HeroSection from '@/components/ui/HeroSection';
import CurrentProgram from '@/components/programs/CurrentProgram';
import RegistrationTypePrograms from '@/components/programs/registrationTypes';
import ProgramActivities from '@/components/programs/ProgramActivities';
import ProgramSteps from '@/components/programs/ProgramSteps';
import ProgramSchedules from '@/components/programs/ProgramSchedules';
import PreviousProgramsGrid from '@/components/programs/PreviousProgramsGrid';
import AdditionalPrograms from '@/components/programs/AdditionalPrograms';
import ProgramsFurtherInformationSection from '@/components/programs/ProgramsFurtherInformation';
import { getProgramDetail, getProgramsPageData, getProgramPricingTiers } from '@/lib/api/programs';
import { getSettingsForBrandDomain } from '@/lib/api/settings';
import { getFaqsPageData } from '@/lib/api/faqs';
import { getHomePageData } from '@/lib/api/home';
import { getLandingHeroMedia } from '@/lib/landing/hero';
import MainFAQSection from '@/components/faq/MainFAQSection';
import { headers } from 'next/headers';
import type {
  ProgramActivitiesSection,
  ProgramJourneySection,
  ProgramOverviewSection,
  RegistrationInfoSection,
  RegistrationInfoPricingTier,
  ProgramImportantDatesSection,
  PreviousProgramsSection,
  ProgramFaqsSection,
  OtherProgramsSection,
} from '@/types/programs';
import type { FaqListSection } from '@/types/faqs';
import type { ProgramImpactSection, RegistrationOverviewSection } from '@/types/home';

type ProgramOverviewPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>> | Record<string, string | string[] | undefined>;
};

export default async function ProgramOverviewPage({ searchParams }: ProgramOverviewPageProps = {}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const editionParam = resolvedSearchParams.edition;
  const edition = Array.isArray(editionParam) ? editionParam[0] : editionParam;

  const host = (await headers()).get('host') || '';
  const [programsPage, heroMedia, faqsPage, homePage] = await Promise.all([
    getProgramsPageData(host, edition),
    getLandingHeroMedia(host, 'programs', {
      preferredImages: [],
      fallbackImage: '/img/programsbackground.png',
    }),
    getFaqsPageData(host).catch(() => null),
    getHomePageData(host).catch(() => null),
  ]);

  // Fetch pricing tiers with validity periods from the active program
  let pricingTiersWithValidity: RegistrationInfoPricingTier[] | null = null;
  try {
    const settingsData = await getSettingsForBrandDomain(host);
    const programSlug = settingsData?.active_program?.slug || process.env.YBB_PROGRAM_SLUG?.trim();
    if (programSlug) {
      const program = await getProgramDetail(programSlug, host);
      if (program?.id) {
        const pricingTiers = await getProgramPricingTiers(program.id, host);
        // Map ProgramPricingTier to RegistrationInfoPricingTier format
        pricingTiersWithValidity = pricingTiers.map(tier => ({
          id: tier.id,
          name: tier.name,
          description: tier.description || '',
          price: String(tier.price),
          currency: tier.currency,
          benefits: tier.benefits || [],
          requirements: tier.requirements || [],
          fee_type: tier.feeType || 'registration_fee',
          target: tier.allowedCategories?.[0] as any,
          allowed_categories: tier.allowedCategories as any,
          validity_periods: tier.validityPeriods?.map(p => ({
            start_date: p.startDate || '',
            end_date: p.endDate || '',
          })) || undefined,
        }));
      }
    }
  } catch (error) {
    console.error('[Programs Page] Failed to fetch pricing tiers with validity:', error);
  }

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

  const faqListSection = faqsPage?.sections.find(
    (section): section is FaqListSection => section.type === 'faq_list',
  );

  const otherProgramsSection = programsPage.sections.find(
    (section): section is OtherProgramsSection => section.type === 'other_programs',
  );

  const programImpactSection = homePage?.sections.find(
    (section): section is ProgramImpactSection => section.type === 'program_impact',
  );
  const participantsStat = programImpactSection?.content.stats.find((stat) => stat.icon === 'participants');
  const totalParticipants = participantsStat?.value || null;

  const registrationOverviewSection = homePage?.sections.find(
    (section): section is RegistrationOverviewSection => section.type === 'registration_overview',
  );
  const igFeed = registrationOverviewSection?.content.ig_feed;

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
  const programSlug = programOverviewSection?.content.program_slug ?? null;
  const programDetail = programSlug ? await getProgramDetail(programSlug, host).catch(() => null) : null;
  const guidelineLinks = (programDetail?.resources ?? [])
    .filter((resource) => resource.isPublic && !!resource.fileUrl)
    .filter((resource) => {
      const normalizedType = (resource.type ?? '').toLowerCase();
      const normalizedTitle = (resource.title ?? '').toLowerCase();
      return normalizedType.includes('guide') || normalizedTitle.includes('guide');
    })
    .map((resource) => ({
      label: resource.title || 'Guideline',
      url: resource.fileUrl as string,
    }));
  const hasProgramSchedules =
    Boolean(programImportantDatesSection) &&
    (programImportantDatesSection?.content.items?.length ?? 0) > 0;
  const hasProgramJourney =
    Boolean(programJourneySection) &&
    (programJourneySection?.content.items?.length ?? 0) > 0;
  const shouldShowJourney = hasProgramJourney && !hasProgramSchedules;

  return (
    <main className="relative">
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        bgImage={heroMedia.bgImage ?? heroBgImage}
        galleryImages={heroMedia.galleryImages}
        location={programDetail?.location || null}
        startDate={programDetail?.startDate || null}
        endDate={programDetail?.endDate || null}
        totalParticipants={totalParticipants}
        showBadges={true}
      />
      <CurrentProgram
        overview={programOverviewSection?.content}
        guidebooks={guidelineLinks}
        igFeed={igFeed}
      />
      <RegistrationTypePrograms
        pricingTiers={pricingTiersWithValidity || registrationInfoSection?.content.pricing_tiers}
        instructions={registrationInfoSection?.content.instructions}
        title={registrationInfoSection?.content.title}
        description={registrationInfoSection?.content.description}
        status={registrationInfoSection?.content.status}
        registrationDates={registrationInfoSection?.content.registration_dates}
        programs={registrationInfoSection?.content.programs}
        selectedEditionSlug={programSlug}
      />
      <section className="h-10" />
      <ProgramActivities activities={programActivitiesSection?.content} />
      {shouldShowJourney ? <ProgramSteps journey={programJourneySection?.content} /> : null}
      <ProgramSchedules dates={programImportantDatesSection?.content} />
      {previousProgramsSection && previousProgramsSection.content.items.length > 0 && (
        <PreviousProgramsGrid previous={previousProgramsSection.content} />
      )}
      <AdditionalPrograms otherPrograms={otherProgramsSection?.content} />
      <MainFAQSection
        items={
          faqListSection?.content.items ??
          programFaqsSection?.content.items
            ?.map((item, index) => ({
              id: `program-faq-${index}`,
              question: item.question,
              answer: item.answer,
              category: item.category ?? null,
            }))
            .filter(
              (item) =>
                item.question.trim().length > 0 &&
                item.answer.trim().length > 0 &&
                item.question.trim() !== '...',
            )
        }
      />
      <ProgramsFurtherInformationSection />
    </main>
  );
}
