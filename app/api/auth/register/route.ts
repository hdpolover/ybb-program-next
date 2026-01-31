import { NextResponse } from 'next/server';

const BRAND_DOMAIN = process.env.YBB_BRAND_DOMAIN || 'https://istanyouthsummit.com';
const FALLBACK_PROGRAM_CATEGORY_ID = 'e694b5d1-f0fe-4c26-80ff-9d0bed4793a4';
const FALLBACK_PROGRAM_ID = '65fe1804-7c99-4566-8880-48b65c5116bb';

type RegisterBody = {
  email: string;
  password: string;
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
  try {
    const envProgramCategoryId = process.env.YBB_PROGRAM_CATEGORY_ID || '';
    const envProgramId = process.env.YBB_PROGRAM_ID || '';
    const envLocalProviderId = process.env.YBB_LOCAL_PROVIDER_ID || '';

    const body = (await request.json()) as RegisterBody;
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { statusCode: 400, message: 'email and password are required', data: null },
        { status: 400 },
      );
    }

    let ctxProgramCategoryId = '';
    let ctxProgramId = '';
    let ctxProviderId = '';

    try {
      const ctxRes = await fetch(new URL('/api/auth/context', request.url).toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const ctxJson = (await ctxRes.json()) as {
        statusCode: number;
        message: string;
        data: { programCategoryId: string; programId: string; localProviderId: string } | null;
      };

      if (ctxRes.ok && ctxJson?.statusCode === 200 && ctxJson?.data) {
        ctxProgramCategoryId = ctxJson.data.programCategoryId || '';
        ctxProgramId = ctxJson.data.programId || '';
        ctxProviderId = ctxJson.data.localProviderId || '';
      }
    } catch {
      // ignore
    }

    const programCategoryId = envProgramCategoryId || ctxProgramCategoryId || FALLBACK_PROGRAM_CATEGORY_ID;
    const programId = envProgramId || ctxProgramId || FALLBACK_PROGRAM_ID;
    const providerId = envLocalProviderId || ctxProviderId || '';

    if (!programCategoryId || !programId || !providerId) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing auth context (programCategoryId/programId/providerId)', data: null },
        { status: 500 },
      );
    }

    const apiUrl = new URL('/v1/auth/register', 'https://staging-api.ybbhub.com');
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
        providerId,
        programId,
      }),
    });

    const json = (await res.json()) as RegisterResponse;
    if (!res.ok) {
      return NextResponse.json(
        { statusCode: json.statusCode ?? res.status, message: json.message ?? 'Register failed', data: null },
        { status: res.status },
      );
    }

    const accessToken = json.data?.accessToken ?? json.accessToken;
    const refreshToken = json.data?.refreshToken ?? json.refreshToken;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing accessToken/refreshToken in response', data: null },
        { status: 500 },
      );
    }

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
