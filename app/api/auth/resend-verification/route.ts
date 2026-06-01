import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { fetchAuthContext } from '@/lib/api/authContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

type ResendVerificationBody = {
  email: string;
};

type ResendVerificationResponse = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResendVerificationBody;
    if (!body?.email) {
      return NextResponse.json(
        { statusCode: 400, message: 'email is required', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);

    let brandId: string | undefined;
    try {
      const ctx = await fetchAuthContext(brandDomain);
      brandId = ctx.brandId ?? undefined;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown auth-context error';
      console.warn('[api/auth/resend-verification] auth-context fetch failed', {
        brandDomain,
        error: errMsg,
      });
    }

    const apiUrl = new URL('/v1/auth/resend-verification', getServerApiBaseUrl());
    const res = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify({
        email: body.email,
        ...(brandId ? { brandId } : {}),
      }),
    });

    const json = (await res.json().catch(() => ({}))) as ResendVerificationResponse;
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: json.statusCode ?? res.status,
          message: json.message ?? 'Failed to resend verification email',
          data: null,
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: json.message ?? 'Verification email sent successfully.',
      data: null,
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
