import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { isRecord } from '@/lib/api/response';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const requestUrl = new URL(request.url);
    const programId = requestUrl.searchParams.get('programId');
    const apiUrl = new URL('/v1/portal/submissions/submit', getServerApiBaseUrl());

    if (programId) {
      apiUrl.searchParams.set('programId', programId);
    }

    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
    });

    const json: unknown = await res.json().catch(() => ({}));
    if (!res.ok) {
      const j = isRecord(json) ? json : {};
      return NextResponse.json(
        {
          statusCode: typeof j.statusCode === 'number' ? j.statusCode : res.status,
          message: typeof j.message === 'string' ? j.message : 'Failed to submit application',
          data: 'data' in j ? j.data ?? null : null,
        },
        { status: res.status },
      );
    }

    const j = isRecord(json) ? json : {};
    return NextResponse.json({ statusCode: 200, message: 'Success', data: 'data' in j ? j.data ?? null : json ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ statusCode: 500, message, data: null }, { status: 500 });
  }
}
