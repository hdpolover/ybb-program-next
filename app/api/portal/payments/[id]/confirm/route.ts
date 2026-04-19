import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const { id } = await params;
    const brandDomain = resolveBrandDomainFromRequest(request);
    const body = await request.json().catch(() => ({}));

    const apiUrl = new URL(
      `/v1/portal/payments/${id}/confirm`,
      (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, ''),
    );

    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: (json as any)?.statusCode ?? res.status,
          message: (json as any)?.message ?? 'Failed to confirm payment',
          data: (json as any)?.data ?? null,
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data: (json as any)?.data ?? json ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ statusCode: 500, message, data: null }, { status: 500 });
  }
}
