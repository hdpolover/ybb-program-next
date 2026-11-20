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

const MAX_REASON_LENGTH = 500;

// Forwards only the two optional reason fields. The API validates the category
// against its own list (400 if unknown); anything else in the body is dropped.
async function readReasonBody(request: Request): Promise<{ reasonCategory?: string; reason?: string }> {
  const body: unknown = await request.json().catch(() => ({}));
  if (!isRecord(body)) return {};
  const reasonCategory = typeof body.reasonCategory === 'string' ? body.reasonCategory.trim() : '';
  const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, MAX_REASON_LENGTH) : '';
  return {
    ...(reasonCategory ? { reasonCategory } : {}),
    ...(reason ? { reason } : {}),
  };
}

export async function POST(request: Request) {
  try {
    const csrfRejection = getCsrfGuardRejection(request);
    if (csrfRejection) return csrfRejection;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const reasonBody = await readReasonBody(request);
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
      body: JSON.stringify(reasonBody),
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
