import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { fetchAuthContext } from '@/lib/api/authContext';

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

    // Resolve referral code: explicit body value takes priority, then fall back to cookie
    const cookieHeader = request.headers.get('cookie') ?? '';
    const cookieReferralCode = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('ybb_referral_code='))
      ?.split('=')[1] ?? null;
    const resolvedReferralCode = body.referralCode || cookieReferralCode || null;

    // Resolve brand+program+localProvider directly from the backend. The previous
    // version called the local /api/auth/context proxy and silently swallowed
    // any failure — leaving "Missing auth context" with no clue why. Now any
    // backend or network error propagates with its real message and step tag.
    let ctxBrandId = '';
    let ctxProgramId = '';
    let ctxProviderId = '';
    let ctxProgramSlug: string | null = null;
    let ctxRequireEmailVerification: boolean | null = null;
    let ctxError: string | null = null;

    try {
      step = 'fetch_auth_context';
      const ctx = await fetchAuthContext(brandDomain);

      ctxBrandId = ctx.brandId ?? '';
      ctxProgramId = ctx.programId ?? '';
      ctxProgramSlug = ctx.programSlug ?? null;
      ctxProviderId = ctx.localProviderId ?? '';
      ctxRequireEmailVerification = ctx.requireEmailVerification;
    } catch (err) {
      ctxError = err instanceof Error ? err.message : 'Unknown auth-context error';
      console.error('[api/auth/register] auth-context fetch failed', {
        brandDomain,
        error: ctxError,
      });
    }

    const brandId = envBrandId || ctxBrandId;
    const programId = envProgramId || ctxProgramId;
    const providerId = envLocalProviderId || ctxProviderId || '';
    const programSlug = ctxProgramSlug;
    const needsEmailVerification = ctxRequireEmailVerification ?? true;

    if (!brandId || !programId || !providerId) {
      const missing = [
        !brandId && 'brandId',
        !programId && 'programId',
        !providerId && 'providerId',
      ].filter(Boolean).join(', ');
      const detail = ctxError
        ? `auth-context fetch failed: ${ctxError}`
        : `domain "${brandDomain}" did not resolve to a brand+program with a local provider`;
      return NextResponse.json(
        {
          statusCode: 500,
          message: `Missing auth context (${missing}) — ${detail}`,
          data: null,
        },
        { status: 500 },
      );
    }

    if (!programSlug) {
      return NextResponse.json(
        {
          statusCode: 500,
          message: `Missing auth context (programSlug) — brand resolved but no published+active program found for "${brandDomain}"`,
          data: null,
        },
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
        ...(resolvedReferralCode ? { referralCode: resolvedReferralCode } : {}),
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
        needsEmailVerification,
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
