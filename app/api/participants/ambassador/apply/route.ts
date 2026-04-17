import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

interface ApplyAmbassadorBody {
  fullName: string;
  programId: string;
  phoneNumber?: string;
  institution?: string;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const body = (await request.json()) as ApplyAmbassadorBody;
    if (!body?.fullName || !body?.programId) {
      return NextResponse.json(
        { statusCode: 400, message: 'fullName and programId are required', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiBase = (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, '');
    const apiUrl = new URL('/v1/participants/ambassador/apply', apiBase);

    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { statusCode: (json as any)?.statusCode ?? res.status, message: (json as any)?.message ?? 'Failed', data: null },
        { status: res.status },
      );
    }

    return NextResponse.json({ statusCode: 201, message: 'Success', data: (json as any)?.data ?? json });
  } catch (error) {
    return NextResponse.json({ statusCode: 500, message: 'Internal Server Error', data: null }, { status: 500 });
  }
}
