import { NextResponse } from 'next/server';
import { apiGet } from '@/lib/api/httpClient';
import { resolveBrandDomain } from '@/lib/server/envContext';
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
    const brand =
      brands.find(b => (b.websiteUrl ?? '').toLowerCase().includes(brandNeedle)) ??
      null;

    const brandId = envBrandId || brand?.id;

    const candidates = programs.filter(p => (p.brandId ?? p.programCategoryId) === brandId && p.isPublished);
    candidates.sort((a, b) => {
      const yearA = a.year ?? -1;
      const yearB = b.year ?? -1;
      if (yearA !== yearB) return yearB - yearA;
      const createdA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const createdB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return createdB - createdA;
    });

    const programId = envProgramId || candidates[0]?.id;
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
