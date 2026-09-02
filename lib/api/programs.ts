import { unstable_cache } from 'next/cache';
import type { ProgramsPageData } from '@/types/programs';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';
import { getHomeCacheTag, HOME_CACHE_TAG, PROGRAM_CACHE_TTL } from '@/lib/constants/cache';
import { dedupeInFlight } from '@/lib/server/stampede';

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain() ?? '');

function resolveBrand(host: string): string {
  return host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')
    ? normalizeBrandUrl(host)
    : DEFAULT_BRAND_URL;
}

export async function getProgramsPageData(host: string, edition?: string): Promise<ProgramsPageData> {
  const brandUrl = resolveBrand(host);
  return apiGetWithEnvelope<ProgramsPageData>('/v1/landing/programs', {
    query: edition ? { url: brandUrl, edition } : { url: brandUrl },
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
}

export type ProgramListItem = {
  id: string;
  brandId: string;
  brandName?: string | null;
  name: string;
  slug: string;
  description: string | null;
  shortDescription?: string | null;
  year: number;
  theme?: string | null;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  location: string | null;
  capacity: number | null;
  registrationOpenDate?: string | null;
  registrationCloseDate?: string | null;
  registrationFee?: number | null;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
  usdInIdr?: number | null;
  isPublished: boolean;
  isActive: boolean;
  status: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  thumbnailUrl?: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProgramListResponse = {
  data: ProgramListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getPreviousProgramsArchive(host: string): Promise<ProgramListItem[]> {
  const brandUrl = resolveBrand(host);
  const response = await apiGetWithEnvelope<ProgramListResponse>('/v1/programs', {
    query: {
      url: brandUrl,
      status: 'completed',
      isPublished: true,
      limit: 100,
      page: 1,
    },
    headers: {
      'x-brand-domain': brandUrl,
    },
  });

  return response.data;
}

export type ProgramDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  theme?: string | null;
  year?: number | null;
  programFormat?: 'in_person' | 'hybrid' | 'online' | null;
  startDate: string | null;
  endDate: string | null;
  applicationDeadline?: string | null;
  registrationOpenDate?: string | null;
  registrationCloseDate?: string | null;
  location: string | null;
  thumbnailUrl: string | null;
  bannerUrl: string | null;
  videoUrl: string | null;
  status: string;
  isPublished: boolean;
  isActive: boolean;
  allowRegistration: boolean;
  requirePayment: boolean;
  currency: string;
  requirementsDescription: string | null;
  benefitsDescription: string | null;
  termsAndConditions: string | null;
  brand: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
  };
  faqs: { id: string; question: string; answer: string; category: string }[];
  timeline: { id: string; title: string; description: string | null; date: string; endDate: string | null; order: number }[];
  schedules: { id: string; day: string; activity: string; description: string | null; location: string | null; startTime: string | null; endTime: string | null; order: number }[];
  requirements: { id: string; name: string; description: string | null; type: string; isRequired: boolean }[];
  speakers: { id: string; name: string; title: string | null; organization: string | null; photoUrl: string | null; bio: string | null; email?: string | null; linkedinUrl?: string | null; twitterUrl?: string | null }[];
  formFields: { id: string; section: string; label: string; name: string; type: string; isRequired: boolean; order: number }[];
  participationCategories: { id: string; name: string; description: string | null; benefits: string | null; eligibility: string | null; order: number }[];
  resources: { id: string; title: string; description: string | null; fileUrl: string | null; type: string; isPublic: boolean }[];
  announcements: {
    id: string;
    title: string;
    content: string;
    targetAudience: string;
    isPinned: boolean;
    publishDate: string;
  }[];
};

export type ProgramPricingTier = {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  currency: string;
  benefits?: string[] | null;
  requirements?: string[] | null;
  feeType?: string | null;
  allowedCategories?: string[] | null;
  validityPeriods?: Array<{
    startDate: string | null;
    endDate: string | null;
  }> | null;
};

// Program detail and pricing tiers are near-static but were refetched, uncached,
// on every render by the root layout AND the page below it. Cached per brand with
// the home tags so an admin publish still busts them instantly; the try/catch stays
// outside the cached fetcher so a transient failure is never cached.
const detailFetcherByBrand = new Map<string, (slug: string) => Promise<ProgramDetail>>();

function getDetailFetcher(brandUrl: string): (slug: string) => Promise<ProgramDetail> {
  const cacheKey = brandUrl || 'default';
  const existing = detailFetcherByBrand.get(cacheKey);
  if (existing) return existing;

  const fetcher = unstable_cache(
    async (slug: string): Promise<ProgramDetail> =>
      apiGetWithEnvelope<ProgramDetail>(`/v1/programs/${slug}`, {
        headers: { 'x-brand-domain': brandUrl },
        cache: 'no-store', // unstable_cache owns the TTL
      }),
    ['program-detail', cacheKey],
    { revalidate: PROGRAM_CACHE_TTL, tags: [HOME_CACHE_TAG, getHomeCacheTag(brandUrl)] },
  );

  detailFetcherByBrand.set(cacheKey, fetcher);
  return fetcher;
}

const tiersFetcherByBrand = new Map<string, (programId: string) => Promise<ProgramPricingTier[]>>();

function getTiersFetcher(brandUrl: string): (programId: string) => Promise<ProgramPricingTier[]> {
  const cacheKey = brandUrl || 'default';
  const existing = tiersFetcherByBrand.get(cacheKey);
  if (existing) return existing;

  const fetcher = unstable_cache(
    async (programId: string): Promise<ProgramPricingTier[]> =>
      apiGetWithEnvelope<ProgramPricingTier[]>(`/v1/programs/${programId}/pricing-tiers`, {
        headers: { 'x-brand-domain': brandUrl },
        cache: 'no-store', // unstable_cache owns the TTL
      }),
    ['program-pricing-tiers', cacheKey],
    { revalidate: PROGRAM_CACHE_TTL, tags: [HOME_CACHE_TAG, getHomeCacheTag(brandUrl)] },
  );

  tiersFetcherByBrand.set(cacheKey, fetcher);
  return fetcher;
}

export async function getProgramDetail(slug: string, host: string = ''): Promise<ProgramDetail | null> {
  const brandUrl = resolveBrand(host);
  try {
    return await dedupeInFlight(`program-detail:${brandUrl}:${slug}`, () =>
      getDetailFetcher(brandUrl)(slug),
    );
  } catch {
    return null;
  }
}

export type ProgramSpeaker = ProgramDetail['speakers'][number];

export async function getProgramSpeakers(programSlug: string, host: string = ''): Promise<ProgramSpeaker[]> {
  const detail = await getProgramDetail(programSlug, host);
  return detail?.speakers ?? [];
}

export async function getProgramPricingTiers(
  programId: string,
  host: string = '',
): Promise<ProgramPricingTier[]> {
  const brandUrl = resolveBrand(host);
  return dedupeInFlight(`program-tiers:${brandUrl}:${programId}`, () =>
    getTiersFetcher(brandUrl)(programId),
  );
}
