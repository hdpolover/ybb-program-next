import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

export const dynamic = 'force-dynamic';

type ApiEnvelope = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

function asApiEnvelope(value: unknown): ApiEnvelope {
  return value && typeof value === 'object' ? (value as ApiEnvelope) : {};
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const { id } = await context.params;
    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiUrl = new URL(`/v1/support/tickets/${id}`, getServerApiBaseUrl());

    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });

    const json = asApiEnvelope(await res.json().catch(() => null));
    if (!res.ok) {
      return NextResponse.json(
        { statusCode: json.statusCode ?? res.status, message: json.message ?? 'Failed', data: json.data ?? null },
        { status: res.status },
      );
    }

    return NextResponse.json({ statusCode: 200, message: 'Success', data: json.data ?? json ?? null });
  } catch (error) {
    return NextResponse.json(
      { statusCode: 500, message: error instanceof Error ? error.message : 'Internal Server Error', data: null },
      { status: 500 },
    );
  }
}
