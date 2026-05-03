import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';

type ExchangeBody = {
  token?: string;
};

type ExchangeResult = {
  accessToken?: string;
  refreshToken?: string;
  redirectTo?: string;
};

type Envelope<T> = {
  statusCode?: number;
  message?: string;
  data?: T;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExchangeBody;
    if (!body?.token) {
      return NextResponse.json(
        { statusCode: 400, message: 'token is required', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiBase = getServerApiBaseUrl();

    const backendRes = await fetch(new URL('/v1/admins/support-access/impersonations/exchange', apiBase), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify({ token: body.token }),
      cache: 'no-store',
    });

    const payload = (await backendRes.json().catch(() => ({}))) as Envelope<ExchangeResult> & ExchangeResult;
    if (!backendRes.ok) {
      return NextResponse.json(
        {
          statusCode: payload.statusCode ?? backendRes.status,
          message: payload.message ?? 'Failed to exchange impersonation token',
          data: null,
        },
        { status: backendRes.status },
      );
    }

    const data = payload.data ?? payload;
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;
    const redirectTo = data.redirectTo ?? '/dashboard';

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { statusCode: 500, message: 'Invalid token exchange response', data: null },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      statusCode: 200,
      message: 'Success',
      data: { redirectTo },
    });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { statusCode: 500, message, data: null },
      { status: 500 },
    );
  }
}
