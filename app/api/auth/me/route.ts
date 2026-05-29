import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

type ActiveRole = 'participant' | 'ambassador';

type AuthMeResponse = {
  statusCode?: number;
  message?: string;
  data?: {
    userId: string;
    email: string;
    brandId?: string;
    programCategoryId?: string;
    identities?: Array<{ provider: string; displayName?: string; lastUsedAt?: string }>;
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
    activeRole?: ActiveRole;
  };
};

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const activeRoleCookie = cookieStore.get('activeRole')?.value;
    const activeRole: ActiveRole | undefined =
      activeRoleCookie === 'ambassador' || activeRoleCookie === 'participant'
        ? activeRoleCookie
        : undefined;

    const brandDomain = resolveBrandDomainFromRequest(request);

    if (!accessToken) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Unauthorized',
          data: null,
        },
        { status: 401 },
      );
    }

    const apiUrl = new URL('/v1/auth/me', getServerApiBaseUrl());
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
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
        },
        { status: res.status },
      );
    }

    const data = json.data ? { ...json.data, ...(activeRole ? { activeRole } : {}) } : null;
    return NextResponse.json({ statusCode: 200, message: 'Success', data });
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
