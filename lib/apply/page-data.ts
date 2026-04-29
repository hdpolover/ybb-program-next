import { getHomePageData } from '@/lib/api/home';
import {
  getProgramDetail,
  getProgramPricingTiers,
  getProgramsPageData,
  type ProgramDetail,
  type ProgramPricingTier,
} from '@/lib/api/programs';
import type { PaymentInfoSection } from '@/types/home';
import type {
  ProgramOverviewSection,
  RegistrationInfoPricingTier,
  RegistrationInfoSection,
} from '@/types/programs';

export type ApplyCategory = 'self_funded' | 'fully_funded';

export type ApplyFeeCard = {
  title: string;
  subtitle: string;
  priceLabel: string;
  periods: Array<{ label: string; value: string }>;
};

export type ApplyOverviewData = {
  description: string;
  requirements: string[];
  benefits: string[];
  location: string;
  duration: string;
  programFormat: string;
  eventDates: string;
  guidebooks: Array<{ label: string; url: string }>;
};

export type ApplyPaymentMethodsData = {
  items: Array<{ title: string; body: string }>;
  note: string;
};

export type ApplyPageData = {
  programName: string;
  heroSubtitle: string;
  registrationDeadline: string | null;
  overview: ApplyOverviewData;
  payment: {
    registrationCard: ApplyFeeCard | null;
    programCard: ApplyFeeCard | null;
    registrationWindow: string | null;
  };
  paymentMethods: ApplyPaymentMethodsData;
};

type TierLike = {
  name: string;
  description?: string | null;
  price: number | string;
  currency: string;
  feeType?: string | null;
  allowedCategories?: string[] | null;
  benefits?: string[] | null;
  requirements?: string[] | null;
  validityPeriods?: Array<{ startDate: string | null; endDate: string | null }> | null;
};

const FORMAT_LABELS: Record<'in_person' | 'hybrid' | 'online', string> = {
  in_person: 'In-person',
  hybrid: 'Hybrid',
  online: 'Online',
};

function safeText(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  return '';
}

function formatDate(value?: string | null): string {
  if (!value) return 'Not configured';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not configured';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDateRange(start?: string | null, end?: string | null): string {
  if (!start && !end) return 'Not configured';
  const startLabel = formatDate(start);
  const endLabel = formatDate(end);
  if (start && end && startLabel !== 'Not configured' && endLabel !== 'Not configured') {
    return `${startLabel} - ${endLabel}`;
  }
  return startLabel !== 'Not configured' ? startLabel : endLabel;
}

function splitTextLines(text?: string | null): string[] {
  if (!text) return [];
  return text
    .replace(/<[^>]*>/g, '\n')
    .split(/\r?\n|•|;/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function normalizeTierFromLanding(tier: RegistrationInfoPricingTier): TierLike {
  return {
    name: tier.name,
    description: tier.description,
    price: tier.price,
    currency: tier.currency,
    feeType: tier.fee_type,
    allowedCategories: tier.allowed_categories ?? null,
    benefits: tier.benefits ?? null,
    requirements: tier.requirements ?? null,
    validityPeriods: null,
  };
}

function normalizeFeeType(value?: string | null): string {
  return safeText(value).toLowerCase().replace(/-/g, '_');
}

function supportsCategory(tier: TierLike, category: ApplyCategory): boolean {
  const categories = Array.isArray(tier.allowedCategories)
    ? tier.allowedCategories.map((item) => safeText(item).toLowerCase())
    : [];
  if (categories.length === 0) return true;
  return categories.includes(category);
}

function formatPriceLabel(tier: TierLike): string {
  const currency = safeText(tier.currency) || 'USD';
  const rawPrice =
    typeof tier.price === 'number'
      ? tier.price.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : safeText(tier.price);
  return rawPrice ? `${currency} ${rawPrice}` : 'Not configured';
}

function buildPeriods(tier: TierLike): Array<{ label: string; value: string }> {
  const periods = Array.isArray(tier.validityPeriods) ? tier.validityPeriods : [];
  if (periods.length === 0) return [];
  return periods.map((period, idx) => ({
    label: `Stage ${idx + 1}`,
    value: formatDateRange(period.startDate, period.endDate),
  }));
}

function buildCard(title: string, fallbackSubtitle: string, tier?: TierLike | null): ApplyFeeCard | null {
  if (!tier) return null;
  return {
    title,
    subtitle: safeText(tier.description) || fallbackSubtitle,
    priceLabel: formatPriceLabel(tier),
    periods: buildPeriods(tier),
  };
}

function pickTierByFeeType(tiers: TierLike[], feeType: string): TierLike | null {
  const normalizedTarget = normalizeFeeType(feeType);
  const exact = tiers.find((tier) => normalizeFeeType(tier.feeType) === normalizedTarget);
  if (exact) return exact;
  if (normalizedTarget === 'full_fee') {
    return tiers.find((tier) => normalizeFeeType(tier.feeType).includes('full')) ?? null;
  }
  if (normalizedTarget === 'registration_fee') {
    return tiers.find((tier) => normalizeFeeType(tier.feeType).includes('registration')) ?? null;
  }
  return null;
}

function deriveProgramFormat(program: ProgramDetail | null): string {
  const key = program?.programFormat;
  if (!key) return 'Not configured';
  return FORMAT_LABELS[key] ?? key;
}

function buildHeroSubtitle(program: ProgramDetail | null): string {
  const location = safeText(program?.location);
  const dateRange = formatDateRange(program?.startDate, program?.endDate);
  if (location && dateRange !== 'Not configured') return `${location} | ${dateRange}`;
  if (dateRange !== 'Not configured') return dateRange;
  return location || 'Program schedule and location will be announced soon.';
}

function computeDuration(program: ProgramDetail | null, overview: ProgramOverviewSection | null): string {
  const fromOverview = safeText(overview?.content.duration);
  if (fromOverview) return fromOverview;
  if (!program?.startDate || !program.endDate) return 'Not configured';
  const start = new Date(program.startDate);
  const end = new Date(program.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Not configured';
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return days > 0 ? `${days} Days` : 'Not configured';
}

function derivePaymentMethods(
  paymentInfo: PaymentInfoSection | null,
  registrationInfo: RegistrationInfoSection | null,
): ApplyPaymentMethodsData {
  const fromPaymentInfo = paymentInfo?.content.items?.map((item) => ({
    title: safeText(item.title),
    body: safeText(item.body),
  })) ?? [];

  const fromRegistrationInfo = registrationInfo?.content.instructions?.map((item) => ({
    title: safeText(item.title),
    body: safeText(item.text),
  })) ?? [];

  const items = [...fromPaymentInfo, ...fromRegistrationInfo].filter(
    (item) => item.title.length > 0 || item.body.length > 0,
  );

  return {
    items,
    note:
      safeText(paymentInfo?.content.note) ||
      'Payment method details are configured by the program team and may change per cohort.',
  };
}

export async function getApplyPageData(host: string, category: ApplyCategory): Promise<ApplyPageData> {
  const [programsPage, homePage] = await Promise.all([
    getProgramsPageData(host).catch(() => null),
    getHomePageData(host).catch(() => null),
  ]);

  const overviewSection = programsPage?.sections.find(
    (section): section is ProgramOverviewSection => section.type === 'program_overview',
  ) ?? null;

  const registrationInfo = programsPage?.sections.find(
    (section): section is RegistrationInfoSection => section.type === 'registration_info',
  ) ?? null;

  const paymentInfo = homePage?.sections.find(
    (section): section is PaymentInfoSection => section.type === 'payment_info',
  ) ?? null;

  const programSlug =
    process.env.YBB_PROGRAM_SLUG ||
    safeText(overviewSection?.content.program_slug) ||
    null;

  const program = programSlug ? await getProgramDetail(programSlug, host).catch(() => null) : null;
  const pricingTiersFromApi =
    program?.id ? await getProgramPricingTiers(program.id, host).catch(() => []) : [];
  const pricingTiersFromLanding =
    registrationInfo?.content.pricing_tiers?.map(normalizeTierFromLanding) ?? [];

  const mergedTiers: TierLike[] =
    pricingTiersFromApi.length > 0 ? pricingTiersFromApi : pricingTiersFromLanding;
  const categoryTiers = mergedTiers.filter((tier) => supportsCategory(tier, category));
  const registrationTier = pickTierByFeeType(categoryTiers, 'registration_fee');
  const programTier = pickTierByFeeType(categoryTiers, 'full_fee');

  const fallbackRequirements =
    category === 'self_funded'
      ? splitTextLines(program?.requirementsDescription)
      : splitTextLines(program?.requirementsDescription);
  const fallbackBenefits = splitTextLines(program?.benefitsDescription);

  const guidebooksFromOverview = overviewSection?.content.guidebooks ?? [];
  const guidebooksFromProgram =
    program?.resources
      ?.filter((resource) => !!resource.fileUrl)
      .map((resource) => ({
        label: `Read Guidebook (${resource.title})`,
        url: resource.fileUrl as string,
      })) ?? [];

  const guidebooks = (guidebooksFromOverview.length > 0
    ? guidebooksFromOverview
    : guidebooksFromProgram
  ).filter((item) => safeText(item.url).length > 0);

  const registrationWindow = registrationInfo
    ? formatDateRange(
        registrationInfo.content.registration_dates?.open ?? null,
        registrationInfo.content.registration_dates?.close ?? null,
      )
    : formatDateRange(program?.registrationOpenDate, program?.registrationCloseDate);

  return {
    programName: safeText(program?.name) || safeText(overviewSection?.content.program_name) || 'Program',
    heroSubtitle: buildHeroSubtitle(program),
    registrationDeadline: program?.registrationCloseDate ?? registrationInfo?.content.registration_dates?.close ?? null,
    overview: {
      description:
        safeText(program?.description) || safeText(overviewSection?.content.description) || 'Program details are not available yet.',
      requirements:
        (registrationTier?.requirements?.filter(Boolean) as string[] | undefined) ??
        (program?.requirements?.map((item) => item.name).filter(Boolean) ?? fallbackRequirements),
      benefits:
        (registrationTier?.benefits?.filter(Boolean) as string[] | undefined) ??
        fallbackBenefits,
      location: safeText(program?.location) || safeText(overviewSection?.content.location) || 'Not configured',
      duration: computeDuration(program, overviewSection),
      programFormat: deriveProgramFormat(program),
      eventDates: formatDateRange(program?.startDate, program?.endDate),
      guidebooks,
    },
    payment: {
      registrationCard: buildCard(
        'Registration Fee',
        'Registration fee details are managed from the program pricing configuration.',
        registrationTier,
      ),
      programCard: buildCard(
        'Program Fee',
        'Program fee details are managed from the program pricing configuration.',
        programTier,
      ),
      registrationWindow: registrationWindow === 'Not configured' ? null : registrationWindow,
    },
    paymentMethods: derivePaymentMethods(paymentInfo, registrationInfo),
  };
}
