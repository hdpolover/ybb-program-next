import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { apiGet } from '@/lib/api/httpClient';

const DEFAULT_BRAND_URL =
  process.env.YBB_BRAND_DOMAIN || process.env.NEXT_PUBLIC_BRAND_DOMAIN || 'https://istanbulyouthsummit.com';
const FALLBACK_BRAND_DOMAIN = 'https://istanbulyouthsummit.com';
const FALLBACK_BRAND_ID = 'e694b5d1-f0fe-4c26-80ff-9d0bed4793a4';
const FALLBACK_PROGRAM_ID = '65fe1804-7c99-4566-8880-48b65c5116bb';

async function resolveBrandDomain(): Promise<string> {
  const h = await headers();
  const hostname = h.get('x-hostname') || h.get('host') || '';

  if (!hostname) return DEFAULT_BRAND_URL;

  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) {
    return DEFAULT_BRAND_URL;
  }

  return `https://${hostname}`;
}

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
  data: Array<{
    id: string;
    brandId?: string | null;
    slug?: string | null;
    programSlug?: string | null;
    programCategoryId?: string | null;
    isPublished: boolean;
    year?: number | null;
    createdAt?: string;
  }>;
};

export async function GET() {
  try {
    const envBrandId = process.env.YBB_BRAND_ID || '';
    const envProgramId = process.env.YBB_PROGRAM_ID || '';
    const envProgramSlug = process.env.YBB_PROGRAM_SLUG || '';
    const envLocalProviderId = process.env.YBB_LOCAL_PROVIDER_ID || '';

    const brandDomain = await resolveBrandDomain();

    const [providersJson, brandsJson, programsJson] = await Promise.all([
      apiGet<ProvidersResponse>('/v1/auth/providers'),
      apiGet<BrandsResponse>('/v1/brands'),
      apiGet<ProgramsResponse>('/v1/programs'),
    ]);

    const providers = Array.isArray(providersJson.data) ? providersJson.data : [];
    const brands = Array.isArray(brandsJson.data) ? brandsJson.data : [];
    const programs = Array.isArray(programsJson.data) ? programsJson.data : [];

    const localProvider = providers.find(p => p.name === 'local') ?? null;

    const brandNeedle = brandDomain.replace(/^https?:\/\//, '').toLowerCase();
    const fallbackNeedle = FALLBACK_BRAND_DOMAIN.replace(/^https?:\/\//, '').toLowerCase();
    const brand =
      brands.find(b => (b.websiteUrl ?? '').toLowerCase().includes(brandNeedle)) ??
      brands.find(b => (b.websiteUrl ?? '').toLowerCase().includes(fallbackNeedle)) ??
      null;

    const brandId = envBrandId || brand?.id || FALLBACK_BRAND_ID;

    const candidates = programs.filter(p => (p.brandId ?? p.programCategoryId) === brandId && p.isPublished);
    candidates.sort((a, b) => {
      const yearA = a.year ?? -1;
      const yearB = b.year ?? -1;
      if (yearA !== yearB) return yearB - yearA;
      const createdA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const createdB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return createdB - createdA;
    });

    const programId = envProgramId || candidates[0]?.id || FALLBACK_PROGRAM_ID;
    const programFromId = programs.find(p => p.id === programId) ?? null;
    const programSlug =
      envProgramSlug ||
      programFromId?.slug ||
      programFromId?.programSlug ||
      candidates[0]?.slug ||
      candidates[0]?.programSlug ||
      null;

    const localProviderId = envLocalProviderId || localProvider?.id || '';

    const debugPayload =
      process.env.NODE_ENV !== 'production'
        ? {
            programSlugResolved: Boolean(programSlug),
            sampleProgramKeys: programs[0] ? Object.keys(programs[0] as Record<string, unknown>) : [],
            sampleCandidateKeys: candidates[0]
              ? Object.keys(candidates[0] as Record<string, unknown>)
              : [],
            programFromIdExists: Boolean(programFromId),
          }
        : undefined;

    return NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data: {
        brandDomain,
        brandId,
        programId,
        programSlug,
        providers,
        localProviderId: localProviderId,
        ...(debugPayload ? { debug: debugPayload } : {}),
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
