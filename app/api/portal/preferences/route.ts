// app/api/portal/preferences/route.ts
//
// BFF for the participant's email preferences (API: /v1/users/me/preferences).
// Only the marketing-email flag is exposed; the browser cannot write any other
// preference through here.
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { getCsrfGuardRejection } from '@/lib/server/bffSecurity';
import { forwardedForHeader } from '@/lib/server/forwardedFor';
import { getEnvelopeData, getMessage, isRecord } from '@/lib/api/response';

async function callPreferences(request: Request, method: 'GET' | 'POST', body?: unknown) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
  }

  try {
    const res = await fetch(new URL('/v1/users/me/preferences', getServerApiBaseUrl()).toString(), {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': resolveBrandDomainFromRequest(request),
        // The API stores these on the consent audit row; without them it would record this server.
        'user-agent': request.headers.get('user-agent') ?? 'unknown',
        ...forwardedForHeader(request),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
    });

    const json: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: isRecord(json) && typeof json.statusCode === 'number' ? json.statusCode : res.status,
          message: getMessage(json) ?? 'Failed to update email preferences.',
          data: null,
        },
        { status: res.status },
      );
    }

    // Explicit projection: the transform interceptor envelope and the other
    // preference fields stay server-side.
    const data = getEnvelopeData(json);
    const marketingEmails = isRecord(data) && data.marketingEmails === true;
    return NextResponse.json({ statusCode: 200, message: 'Success', data: { marketingEmails } });
  } catch {
    return NextResponse.json({ statusCode: 500, message: 'Internal Server Error', data: null }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return callPreferences(request, 'GET');
}

export async function POST(request: Request) {
  const csrfRejection = getCsrfGuardRejection(request);
  if (csrfRejection) return csrfRejection;

  const body: unknown = await request.json().catch(() => null);
  if (!isRecord(body) || typeof body.marketingEmails !== 'boolean') {
    return NextResponse.json({ statusCode: 400, message: 'marketingEmails must be a boolean', data: null }, { status: 400 });
  }
  return callPreferences(request, 'POST', { marketingEmails: body.marketingEmails });
}
