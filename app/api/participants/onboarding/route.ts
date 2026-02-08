import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const DEFAULT_BRAND_URL =
  process.env.YBB_BRAND_DOMAIN || process.env.NEXT_PUBLIC_BRAND_DOMAIN || 'https://istanbulyouthsummit.com';

function resolveBrandDomainFromRequest(request: Request): string {
  const hostname = request.headers.get('x-hostname') || request.headers.get('host') || '';
  if (!hostname) return DEFAULT_BRAND_URL;
  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) return DEFAULT_BRAND_URL;
  return `https://${hostname}`;
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

    const apiUrl = new URL('/v1/participants/me', 'https://staging-api.ybbhub.com');
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
      return NextResponse.json(
        {
          statusCode: (json as any)?.statusCode ?? res.status,
          message: (json as any)?.message ?? 'Failed to fetch onboarding',
          data: null,
        },
        { status: res.status },
      );
    }

    return NextResponse.json({ statusCode: 200, message: 'Success', data: (json as any)?.data ?? json ?? null });
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

    const apiUrl = new URL('/v1/participants/onboarding', 'https://staging-api.ybbhub.com');
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

    return NextResponse.json({ statusCode: 200, message: 'Success', data: (json as any)?.data ?? json ?? null });
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
