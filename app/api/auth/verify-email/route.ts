import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

type VerifyEmailBody = {
  token: string;
};

type VerifyEmailResponse = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyEmailBody;
    if (!body?.token) {
      return NextResponse.json(
        { statusCode: 400, message: 'token is required', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);

    const apiUrl = new URL('/v1/auth/verify-email', (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, ''));
    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify({
        token: body.token,
      }),
    });

    const json = (await res.json()) as VerifyEmailResponse;
    if (!res.ok) {
      return NextResponse.json(
        { statusCode: json.statusCode ?? res.status, message: json.message ?? 'Verify email failed', data: null },
        { status: res.status },
      );
    }

    return NextResponse.json({ statusCode: 200, message: 'Success', data: null });
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
