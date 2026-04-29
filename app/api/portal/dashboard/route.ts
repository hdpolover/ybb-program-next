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

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401, headers: noStoreHeaders });
    }

    const brandDomain = resolveBrandDomainFromRequest(request);

    const apiUrl = new URL('/v1/portal/dashboard', getServerApiBaseUrl());
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
        {
          statusCode: json.statusCode ?? res.status,
          message: json.message ?? 'Failed to fetch dashboard summary',
          data: json.data ?? null,
        },
        { status: res.status, headers: noStoreHeaders },
      );
    }

    return NextResponse.json({ statusCode: 200, message: 'Success', data: json.data ?? json ?? null }, { headers: noStoreHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        statusCode: 500,
        message,
        data: null,
      },
      { status: 500, headers: noStoreHeaders },
    );
  }
}
