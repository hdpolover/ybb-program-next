import { NextResponse } from 'next/server';
import { apiGetWithEnvelope } from '@/lib/api/httpClient';
import { resolveBrandDomain } from '@/lib/server/envContext';

type AuthProvider = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isOAuth: boolean;
  icon: string;
  buttonColor: string;
};

type BackendAuthContext = {
  brandDomain: string;
  brandId: string | null;
  requireEmailVerification: boolean;
  programId: string | null;
  programSlug: string | null;
  localProviderId: string | null;
  providers: AuthProvider[];
};

export async function GET() {
  try {
    const envBrandId = process.env.YBB_BRAND_ID || '';
    const envProgramId = process.env.YBB_PROGRAM_ID || '';
    const envProgramSlug = process.env.YBB_PROGRAM_SLUG || '';
    const envLocalProviderId = process.env.YBB_LOCAL_PROVIDER_ID || '';

    const brandDomain = await resolveBrandDomain();

    // Single backend call resolves brand + active program + local provider in one
    // query — replaces the previous client-side fan-out (/v1/brands + /v1/programs
    // + /v1/auth/providers) which broke once the global program list paginated past 10.
    const ctx = await apiGetWithEnvelope<BackendAuthContext>('/v1/auth/context', {
      headers: { 'x-brand-domain': brandDomain },
      cache: 'no-store',
    });

    return NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data: {
        brandDomain,
        brandId: envBrandId || ctx.brandId,
        requireEmailVerification: ctx.requireEmailVerification,
        programId: envProgramId || ctx.programId,
        programSlug: envProgramSlug || ctx.programSlug,
        providers: ctx.providers,
        localProviderId: envLocalProviderId || ctx.localProviderId || '',
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
