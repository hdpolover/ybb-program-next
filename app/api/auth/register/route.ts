import { NextResponse } from 'next/server';

function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.replace(/^https?:\/\//, '');
}

const DEFAULT_BRAND_URL =
  normalizeBrandUrl(process.env.YBB_BRAND_DOMAIN || process.env.NEXT_PUBLIC_BRAND_DOMAIN || '') ||
  'istanbulyouthsummit.com';
const FALLBACK_BRAND_ID = 'e694b5d1-f0fe-4c26-80ff-9d0bed4793a4';
const FALLBACK_PROGRAM_ID = '65fe1804-7c99-4566-8880-48b65c5116bb';

function resolveBrandDomainFromRequest(request: Request): string {
  const hostnameRaw = request.headers.get('x-hostname') || request.headers.get('host') || '';
  const hostname = hostnameRaw.split(':')[0];

  if (!hostname) return DEFAULT_BRAND_URL;
  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) return DEFAULT_BRAND_URL;
  return normalizeBrandUrl(hostname);
}

type RegisterBody = {
  email: string;
  password: string;
  referralCode?: string;
  applicationCategory?: string;
};

type RegisterResponse = {
  statusCode?: number;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: { isOnboardingCompleted?: boolean };
  };
  accessToken?: string;
  refreshToken?: string;
  user?: { isOnboardingCompleted?: boolean };
};

export async function POST(request: Request) {
  let step: string = 'init';
  try {
    step = 'read_env';
    const envBrandId = process.env.YBB_BRAND_ID || '';
    const envProgramId = process.env.YBB_PROGRAM_ID || '';
    const envLocalProviderId = process.env.YBB_LOCAL_PROVIDER_ID || '';

    const brandDomain = resolveBrandDomainFromRequest(request);

    step = 'parse_body';
    const body = (await request.json()) as RegisterBody;
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { statusCode: 400, message: 'email and password are required', data: null },
        { status: 400 },
      );
    }

    let ctxBrandId = '';
    let ctxProgramId = '';
    let ctxProviderId = '';
    let ctxProgramSlug: string | null = null;

    try {
      step = 'fetch_auth_context';
      const ctxRes = await fetch(new URL('/api/auth/context', request.url).toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      step = 'parse_auth_context';
      const ctxJson = (await ctxRes.json()) as {
        statusCode: number;
        message: string;
        data:
          | {
              brandId: string;
              programId: string;
              programSlug?: string | null;
              localProviderId: string;
            }
          | null;
      };

      if (ctxRes.ok && ctxJson?.statusCode === 200 && ctxJson?.data) {
        ctxBrandId = ctxJson.data.brandId || '';
        ctxProgramId = ctxJson.data.programId || '';
        ctxProgramSlug = ctxJson.data.programSlug ?? null;
        ctxProviderId = ctxJson.data.localProviderId || '';
      }
    } catch {
      // ignore
    }

    const brandId = envBrandId || ctxBrandId || FALLBACK_BRAND_ID;
    const programId = envProgramId || ctxProgramId || FALLBACK_PROGRAM_ID;
    const providerId = envLocalProviderId || ctxProviderId || '';
    const programSlug = ctxProgramSlug;

    if (!brandId || !programId || !providerId) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing auth context (brandId/programId/providerId)', data: null },
        { status: 500 },
      );
    }

    if (!programSlug) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing auth context (programSlug)', data: null },
        { status: 500 },
      );
    }

    step = 'fetch_backend_register';
    const apiUrl = new URL('/v1/auth/register', (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, ''));
    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        brandId,
        providerId,
        providerUserId: body.email,
        programId,
        programSlug,
        ...(body.referralCode ? { referralCode: body.referralCode } : {}),
        ...(body.applicationCategory ? { applicationCategory: body.applicationCategory } : {}),
      }),
    });

    step = 'parse_backend_register_response';
    const json = (await res.json().catch(() => ({}))) as RegisterResponse;
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: json.statusCode ?? res.status,
          message: json.message ?? `Register failed: ${res.status} ${res.statusText}`,
          data: null,
        },
        { status: res.status },
      );
    }

    step = 'extract_tokens';
    const accessToken = json.data?.accessToken ?? json.accessToken;
    const refreshToken = json.data?.refreshToken ?? json.refreshToken;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing accessToken/refreshToken in response', data: null },
        { status: 500 },
      );
    }

    step = 'set_cookies_and_return';
    const response = NextResponse.json({
      statusCode: 201,
      message: 'Success',
      data: {
        needsEmailVerification: true,
      },
    });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    console.error('[api/auth/register] error', { step, message, stack });
    return NextResponse.json(
      {
        statusCode: 500,
        message,
        data: null,
        ...(process.env.NODE_ENV !== 'production'
          ? {
              debug: {
                step,
                stack,
              },
            }
          : {}),
      },
      { status: 500 },
    );
  }
}
