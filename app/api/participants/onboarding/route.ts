import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { getCsrfGuardRejection } from '@/lib/server/bffSecurity';
import { isRecord } from '@/lib/api/response';

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

    const apiUrl = new URL('/v1/participants/onboarding', getServerApiBaseUrl());
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
    const jsonRecord = isRecord(json) ? json : {};
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { statusCode: 200, message: 'Data not Added', data: null },
          { status: 200 },
        );
      }
      return NextResponse.json(
        {
          statusCode: typeof jsonRecord.statusCode === 'number' ? jsonRecord.statusCode : res.status,
          message: typeof jsonRecord.message === 'string' ? jsonRecord.message : 'Failed to fetch onboarding',
          data: null,
        },
        { status: res.status },
      );
    }

    const data = jsonRecord.data ?? json ?? null;
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
    const csrfRejection = getCsrfGuardRejection(request);
    if (csrfRejection) return csrfRejection;

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

    // Resolve referral code: explicit body value takes priority, then fall back to cookie.
    // Covers users who clicked a share link AFTER registering and only now complete onboarding.
    if (typeof body.referralCode !== 'string' || body.referralCode.length === 0) {
      const cookieHeader = request.headers.get('cookie') ?? '';
      const cookieReferralCode = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('ybb_referral_code='))
        ?.split('=')[1] ?? null;
      if (cookieReferralCode) {
        body.referralCode = cookieReferralCode;
      } else {
        // No code anywhere — omit the key entirely so the backend DTO sees
        // undefined instead of "", matching register/firebase-login proxies.
        delete body.referralCode;
      }
    }

    const apiUrl = new URL('/v1/participants/onboarding', getServerApiBaseUrl());
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
    const postJsonRecord = isRecord(json) ? json : {};
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: typeof postJsonRecord.statusCode === 'number' ? postJsonRecord.statusCode : res.status,
          message: typeof postJsonRecord.message === 'string' ? postJsonRecord.message : 'Failed to submit onboarding',
          data: postJsonRecord.data ?? null,
        },
        { status: res.status },
      );
    }

    const data = postJsonRecord.data ?? json ?? null;
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
