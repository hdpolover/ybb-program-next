import type { ProgramsPageData } from '@/types/programs';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { getEnvBrandDomain, normalizeBrandUrl } from '@/lib/server/envContext';

const BRAND_URL = normalizeBrandUrl(getEnvBrandDomain());

export async function getProgramsPageData(): Promise<ProgramsPageData> {
  return apiGetWithEnvelope<ProgramsPageData>('/v1/landing/programs', {
    query: { url: BRAND_URL },
    headers: {
      'x-brand-domain': BRAND_URL,
    },
  });
}

export type ProgramDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  startDate: string | null;
  endDate: string | null;
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

export async function getProgramDetail(slug: string): Promise<ProgramDetail | null> {
  try {
    return await apiGetWithEnvelope<ProgramDetail>(`/v1/programs/${slug}`, {
      headers: {
        'x-brand-domain': BRAND_URL,
      },
    });
  } catch {
    return null;
  }
}

export type ProgramSpeaker = ProgramDetail['speakers'][number];

/**
 * Fetch speakers from a program by its slug.
 * Returns the speakers array or an empty array on failure.
 */
export async function getProgramSpeakers(programSlug: string): Promise<ProgramSpeaker[]> {
  const detail = await getProgramDetail(programSlug);
  return detail?.speakers ?? [];
}
