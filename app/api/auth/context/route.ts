import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api/httpClient';

const BRAND_DOMAIN = process.env.YBB_BRAND_DOMAIN || 'https://istanyouthsummit.com';
const FALLBACK_BRAND_DOMAIN = 'https://istanbulyouthsummit.com';
const FALLBACK_PROGRAM_CATEGORY_ID = 'e694b5d1-f0fe-4c26-80ff-9d0bed4793a4';
const FALLBACK_PROGRAM_ID = '65fe1804-7c99-4566-8880-48b65c5116bb';

type ProvidersResponse = {
  statusCode: number;
  message: string;
  data: Array<{ id: string; name: string; displayName: string; isOAuth: boolean }>;
};

type BrandsResponse = {
  statusCode: number;
  message: string;
  data: Array<{ id: string; slug: string; websiteUrl?: string | null }>;
};

type ProgramsResponse = {
  statusCode: number;
  message: string;
  data: Array<{ id: string; programCategoryId: string; isPublished: boolean; year?: number | null; createdAt?: string }>;
};

export async function GET() {
  try {
    const envProgramCategoryId = process.env.YBB_PROGRAM_CATEGORY_ID || '';
    const envProgramId = process.env.YBB_PROGRAM_ID || '';
    const envLocalProviderId = process.env.YBB_LOCAL_PROVIDER_ID || '';

    const [providersJson, brandsJson, programsJson] = await Promise.all([
      apiGet<ProvidersResponse>('/v1/auth/providers'),
      apiGet<BrandsResponse>('/v1/brands'),
      apiGet<ProgramsResponse>('/v1/programs'),
    ]);

    const providers = Array.isArray(providersJson.data) ? providersJson.data : [];
    const brands = Array.isArray(brandsJson.data) ? brandsJson.data : [];
    const programs = Array.isArray(programsJson.data) ? programsJson.data : [];

    const localProvider = providers.find(p => p.name === 'local') ?? null;

    const brandNeedle = BRAND_DOMAIN.replace(/^https?:\/\//, '').toLowerCase();
    const fallbackNeedle = FALLBACK_BRAND_DOMAIN.replace(/^https?:\/\//, '').toLowerCase();
    const brand =
      brands.find(b => (b.websiteUrl ?? '').toLowerCase().includes(brandNeedle)) ??
      brands.find(b => (b.websiteUrl ?? '').toLowerCase().includes(fallbackNeedle)) ??
      null;

    const programCategoryId = envProgramCategoryId || brand?.id || FALLBACK_PROGRAM_CATEGORY_ID;

    const candidates = programs.filter(p => p.programCategoryId === programCategoryId && p.isPublished);
    candidates.sort((a, b) => {
      const yearA = a.year ?? -1;
      const yearB = b.year ?? -1;
      if (yearA !== yearB) return yearB - yearA;
      const createdA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const createdB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return createdB - createdA;
    });

    const programId = envProgramId || candidates[0]?.id || FALLBACK_PROGRAM_ID;

    const localProviderId = envLocalProviderId || localProvider?.id || '';

    return NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data: {
        brandDomain: BRAND_DOMAIN,
        programCategoryId,
        programId,
        providers,
        localProviderId: localProviderId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        statusCode: 500,
        message,
        data: null,
      },
      { status: 500 },
    );
  }
}
