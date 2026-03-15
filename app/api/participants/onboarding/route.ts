import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

function isEmptyData(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0;
  return false;
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { statusCode: 401, message: 'Unauthorized', data: null },
        { status: 401 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);

    const apiUrl = new URL('/v1/participants/onboarding', (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, ''));
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { statusCode: 200, message: 'Data not Added', data: null },
          { status: 200 },
        );
      }
      return NextResponse.json(
        {
          statusCode: (json as any)?.statusCode ?? res.status,
          message: (json as any)?.message ?? 'Failed to fetch onboarding',
          data: null,
        },
        { status: res.status },
      );
    }

    const data = (json as any)?.data ?? json ?? null;
    return NextResponse.json({
      statusCode: 200,
      message: isEmptyData(data) ? 'Data not Added' : 'Success',
      data: isEmptyData(data) ? null : data,
    });
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

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { statusCode: 401, message: 'Unauthorized', data: null },
        { status: 401 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);

    const body = await request.json().catch(() => ({}));

    // Pad user-provided birth year to match backend date requirements smoothly
    if (typeof body.birthDate === 'string' && body.birthDate.length === 4) {
      body.birthDate = `${body.birthDate}-01-01`;
    }

    const apiUrl = new URL('/v1/participants/onboarding', (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, ''));
    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: (json as any)?.statusCode ?? res.status,
          message: (json as any)?.message ?? 'Failed to submit onboarding',
          data: (json as any)?.data ?? null,
        },
        { status: res.status },
      );
    }

    const data = (json as any)?.data ?? json ?? null;
    return NextResponse.json({
      statusCode: 200,
      message: isEmptyData(data) ? 'Data not Added' : 'Success',
      data: isEmptyData(data) ? null : data,
    });
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
