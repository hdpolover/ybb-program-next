import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

type ResetPasswordBody = {
  token: string;
  password: string;
};

type ResetPasswordResponse = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResetPasswordBody;
    if (!body?.token || !body?.password) {
      return NextResponse.json(
        { statusCode: 400, message: 'token and password are required', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiUrl = new URL(
      '/v1/auth/reset-password',
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
        token: body.token,
        password: body.password,
      }),
    });

    const json = (await res.json().catch(() => ({}))) as ResetPasswordResponse;
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: json.statusCode ?? res.status,
          message: json.message ?? 'Failed to reset password',
          data: null,
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      statusCode: res.status === 201 ? 201 : 200,
      message: json.message ?? 'Password reset successful.',
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
