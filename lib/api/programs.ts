import type { ProgramsPageData } from '@/types/programs';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const DEFAULT_BRAND_URL = normalizeBrandUrl(getEnvBrandDomain() ?? '');

function resolveBrand(host: string): string {
  return host && !host.startsWith('localhost') && !host.startsWith('127.0.0.1')
    ? normalizeBrandUrl(host)
    : DEFAULT_BRAND_URL;
}

export async function getProgramsPageData(host: string): Promise<ProgramsPageData> {
  const brandUrl = resolveBrand(host);
  return apiGetWithEnvelope<ProgramsPageData>('/v1/landing/programs', {
    query: { url: brandUrl },
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
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
  announcements: { id: string; title: string; content: string; isActive: boolean }[];
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

export async function getProgramDetail(slug: string, host: string = ''): Promise<ProgramDetail | null> {
  const brandUrl = resolveBrand(host);
  try {
    return await apiGetWithEnvelope<ProgramDetail>(`/v1/programs/${slug}`, {
      headers: {
        'x-brand-domain': brandUrl,
      },
    });
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
  return apiGetWithEnvelope<ProgramPricingTier[]>(`/v1/programs/${programId}/pricing-tiers`, {
    headers: {
      'x-brand-domain': brandUrl,
    },
  });
}
