import { NextResponse } from 'next/server';

const BRAND_DOMAIN = process.env.YBB_BRAND_DOMAIN || 'https://istanyouthsummit.com';

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
      data: { programCategoryId: string } | null;
    };

    const programCategoryId = ctxJson?.data?.programCategoryId;
    if (!programCategoryId) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing programCategoryId', data: null },
        { status: 500 },
      );
    }

    const apiUrl = new URL('/v1/auth/login', 'https://staging-api.ybbhub.com');
    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': BRAND_DOMAIN,
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        programCategoryId,
      }),
    });

    const json = (await res.json()) as LocalLoginResponse;
    if (!res.ok) {
      return NextResponse.json(
        { statusCode: json.statusCode ?? res.status, message: json.message ?? 'Login failed', data: null },
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

    const response = NextResponse.json({ statusCode: 200, message: 'Success', data: { redirectTo } });

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
