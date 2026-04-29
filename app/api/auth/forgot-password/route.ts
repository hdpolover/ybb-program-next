import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { fetchAuthContext } from '@/lib/api/authContext';

type ForgotPasswordBody = {
  email: string;
};

type ForgotPasswordResponse = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ForgotPasswordBody;
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
      // Forgot-password tolerates missing brand — backend can still send the
      // generic email when given just an address. Log so we know if the auth
      // context call is consistently failing in production.
      const errMsg = err instanceof Error ? err.message : 'Unknown auth-context error';
      console.warn('[api/auth/forgot-password] auth-context fetch failed', { brandDomain, error: errMsg });
    }

    const apiUrl = new URL(
      '/v1/auth/forgot-password',
      (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(
        /\/v1\/?$/,
        '',
      ),
    );

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

    const json = (await res.json().catch(() => ({}))) as ForgotPasswordResponse;
    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          {
            statusCode: 200,
            message: 'If an account with that email exists, a reset link has been sent.',
            data: null,
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          statusCode: json.statusCode ?? res.status,
          message: json.message ?? 'Failed to request password reset',
          data: null,
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      statusCode: res.status === 201 ? 201 : 200,
      message: 'If an account with that email exists, a reset link has been sent.',
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