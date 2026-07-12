import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { isRecord } from '@/lib/api/response';

class PaymentMethodsUpstreamError extends Error {
  constructor(
    readonly status: number,
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'PaymentMethodsUpstreamError';
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const requestUrl = new URL(request.url);
    const programId = requestUrl.searchParams.get('programId');

    const apiUrl = new URL('/v1/portal/payment-methods', getServerApiBaseUrl());
    if (programId) {
      apiUrl.searchParams.set('programId', programId);
    }

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
      throw new PaymentMethodsUpstreamError(
        res.status,
        typeof jsonRecord.statusCode === 'number' ? jsonRecord.statusCode : res.status,
        typeof jsonRecord.message === 'string' ? jsonRecord.message : 'Failed to fetch payment methods',
      );
    }

    const payload: unknown = jsonRecord.data ?? json;
    const payloadRecord = isRecord(payload) ? payload : {};
    const resolvedMethods = Array.isArray(payload)
      ? payload
      : Array.isArray(payloadRecord.data)
        ? payloadRecord.data
        : Array.isArray(payloadRecord.methods)
          ? payloadRecord.methods
          : [];

    return NextResponse.json({ statusCode: 200, message: 'Success', data: resolvedMethods });
  } catch (error) {
    if (error instanceof PaymentMethodsUpstreamError) {
      return NextResponse.json(
        { statusCode: error.statusCode, message: error.message, data: null },
        { status: error.status },
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ statusCode: 500, message, data: null }, { status: 500 });
  }
}
