import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BRAND_DOMAIN = process.env.YBB_BRAND_DOMAIN || 'https://istanyouthsummit.com';

type LogoutResponse = {
  statusCode?: number;
  message?: string;
  data?: unknown;
};

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (accessToken) {
      const apiUrl = new URL('/v1/auth/logout', 'https://staging-api.ybbhub.com');
      const res = await fetch(apiUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-brand-domain': BRAND_DOMAIN,
        },
      });

      const json = (await res.json().catch(() => ({}))) as LogoutResponse;
      if (!res.ok) {
        return NextResponse.json(
          { statusCode: json.statusCode ?? res.status, message: json.message ?? 'Logout failed', data: null },
          { status: res.status },
        );
      }
    }

    const response = NextResponse.json({ statusCode: 200, message: 'Success', data: null });

    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
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
