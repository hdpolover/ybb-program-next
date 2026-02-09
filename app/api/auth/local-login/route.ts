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

function resolveBrandDomainFromRequest(request: Request): string {
  const hostnameRaw = request.headers.get('x-hostname') || request.headers.get('host') || '';
  const hostname = hostnameRaw.split(':')[0];

  if (!hostname) return DEFAULT_BRAND_URL;
  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) return DEFAULT_BRAND_URL;
  return normalizeBrandUrl(hostname);
}

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

    const ctxRes = await fetch(new URL('/api/auth/context', request.url).toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const ctxJson = (await ctxRes.json()) as {
      statusCode: number;
      message: string;
      data: { brandId: string } | null;
    };

    const brandId = envBrandId || ctxJson?.data?.brandId || FALLBACK_BRAND_ID;
    if (!brandId) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing brandId', data: null },
        { status: 500 },
      );
    }

    const apiUrl = new URL('/v1/auth/login', 'https://staging-api.ybbhub.com');
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
