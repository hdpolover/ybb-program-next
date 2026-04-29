import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { fetchAuthContext } from '@/lib/api/authContext';

type LocalLoginBody = {
  email: string;
  password: string;
};

type LocalLoginResponse = {
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
  try {
    const envBrandId = process.env.YBB_BRAND_ID || '';
    const brandDomain = resolveBrandDomainFromRequest(request);

    const body = (await request.json()) as LocalLoginBody;
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { statusCode: 400, message: 'email and password are required', data: null },
        { status: 400 },
      );
    }

    let ctxBrandId: string | null = null;
    let ctxProgramId: string | null = null;
    let ctxProgramSlug: string | null = null;
    try {
      const ctx = await fetchAuthContext(brandDomain);
      ctxBrandId = ctx.brandId;
      ctxProgramId = ctx.programId;
      ctxProgramSlug = ctx.programSlug;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown auth-context error';
      console.error('[api/auth/local-login] auth-context fetch failed', { brandDomain, error: errMsg });
      return NextResponse.json(
        { statusCode: 500, message: `auth-context fetch failed: ${errMsg}`, data: null },
        { status: 500 },
      );
    }

    const brandId = envBrandId || ctxBrandId;
    const programId = ctxProgramId || undefined;
    const programSlug = ctxProgramSlug || undefined;
    if (!brandId) {
      return NextResponse.json(
        {
          statusCode: 500,
          message: `Missing brandId — domain "${brandDomain}" did not resolve to a brand`,
          data: null,
        },
        { status: 500 },
      );
    }

    const apiUrl = new URL('/v1/auth/login', (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, ''));
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
        ...(programId ? { programId } : {}),
        ...(programSlug ? { programSlug } : {}),
      }),
    });

    const json = (await res.json().catch(() => ({}))) as LocalLoginResponse;
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: json.statusCode ?? res.status,
          message: json.message ?? `Login failed: ${res.status} ${res.statusText}`,
          data: null,
        },
        { status: res.status },
      );
    }

    const accessToken = json.data?.accessToken ?? json.accessToken;
    const refreshToken = json.data?.refreshToken ?? json.refreshToken;
    const user = json.data?.user ?? json.user;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing accessToken/refreshToken in response', data: null },
        { status: 500 },
      );
    }

    const redirectTo = user?.isOnboardingCompleted ? '/dashboard' : '/onboarding';

    const response = NextResponse.json({
      statusCode: res.status === 201 ? 201 : 200,
      message: 'Success',
      data: { redirectTo },
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
