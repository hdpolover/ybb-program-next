import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BRAND_DOMAIN = process.env.YBB_BRAND_DOMAIN || 'https://istanyouthsummit.com';

type AuthMeResponse = {
  statusCode?: number;
  message?: string;
  data?: {
    userId: string;
    email: string;
    programCategoryId: string;
    identities?: Array<{ provider: string; lastUsedAt?: string }>;
    participantId?: string;
    registeredPrograms?: Array<{
      programId: string;
      programName: string;
      programSlug: string;
      year?: number;
      applicationId?: string;
      applicationStatus?: string;
    }>;
    isProfileCompleted?: boolean;
  };
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cookieNames = cookieStore.getAll().map(c => c.name);
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Unauthorized',
          data: null,
          debug: {
            hasAccessTokenCookie: false,
            brandDomain: BRAND_DOMAIN,
            cookieNames,
          },
        },
        { status: 401 },
      );
    }

    const apiUrl = new URL('/v1/auth/me', 'https://staging-api.ybbhub.com');
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': BRAND_DOMAIN,
      },
      cache: 'no-store',
    });

    const json = (await res.json().catch(() => ({}))) as AuthMeResponse;
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: json.statusCode ?? res.status,
          message: json.message ?? 'Failed to fetch profile',
          data: null,
          debug: {
            hasAccessTokenCookie: true,
            brandDomain: BRAND_DOMAIN,
            backendStatus: res.status,
            cookieNames,
          },
        },
        { status: res.status },
      );
    }

    return NextResponse.json({ statusCode: 200, message: 'Success', data: json.data ?? null });
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
