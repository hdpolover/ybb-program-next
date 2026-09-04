// app/api/auth/deletion-request/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { getCsrfGuardRejection } from '@/lib/server/bffSecurity';
import { forwardedForHeader } from '@/lib/server/forwardedFor';
import { isRecord } from '@/lib/api/response';

// Creates the self-service account deletion request (POST /v1/users/me/deletion-request
// on the API — see ybb-platform PR #176). The account is deactivated immediately on
// success, so the caller must sign out right after this resolves — see
// DeleteAccountSection.tsx, which is the only place this is called from.
export async function POST(request: Request) {
  try {
    const csrfRejection = getCsrfGuardRejection(request);
    if (csrfRejection) return csrfRejection;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiUrl = new URL('/v1/users/me/deletion-request', getServerApiBaseUrl());

    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
        ...forwardedForHeader(request),
      },
      // No reason/reasonCategory collected by this UI — both are optional on the DTO.
      body: JSON.stringify({}),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));
    const jsonRecord = isRecord(json) ? json : {};

    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: typeof jsonRecord.statusCode === 'number' ? jsonRecord.statusCode : res.status,
          message: typeof jsonRecord.message === 'string' ? jsonRecord.message : 'Failed to request account deletion.',
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
