// app/api/auth/identities/local/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { getCsrfGuardRejection } from '@/lib/server/bffSecurity';
import { isRecord } from '@/lib/api/response';

type LinkLocalIdentityBody = {
  password?: string;
};

// Adds email & password sign-in to the signed-in account. The email is taken
// from the access token server-side, so nothing about the target account is
// client-supplied. This used to post to /api/auth/register.
export async function POST(request: Request) {
  try {
    const csrfRejection = getCsrfGuardRejection(request);
    if (csrfRejection) return csrfRejection;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as LinkLocalIdentityBody;
    if (!body?.password) {
      return NextResponse.json(
        { statusCode: 400, message: 'password is required', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiUrl = new URL('/v1/auth/identities/local', getServerApiBaseUrl());

    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify({ password: body.password }),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));
    const jsonRecord = isRecord(json) ? json : {};

    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: typeof jsonRecord.statusCode === 'number' ? jsonRecord.statusCode : res.status,
          message:
            typeof jsonRecord.message === 'string'
              ? jsonRecord.message
              : 'Failed to add email & password sign-in.',
          data: null,
        },
        { status: res.status },
      );
    }

    return NextResponse.json({ statusCode: 201, message: 'Success', data: jsonRecord.data ?? json });
  } catch {
    return NextResponse.json({ statusCode: 500, message: 'Internal Server Error', data: null }, { status: 500 });
  }
}
