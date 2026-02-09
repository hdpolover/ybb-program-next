import { NextResponse } from 'next/server';

const DEFAULT_PROVIDER_ID = '8b4646ec-1e17-4815-bcca-703418b9db9f';
function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.replace(/^https?:\/\//, '');
}

const DEFAULT_BRAND_DOMAIN =
  normalizeBrandUrl(process.env.YBB_BRAND_DOMAIN || process.env.NEXT_PUBLIC_BRAND_DOMAIN || '') ||
  'istanbulyouthsummit.com';

function resolveBrandDomainFromRequest(request: Request): string {
  const hostnameRaw = request.headers.get('x-hostname') || request.headers.get('host') || '';
  const hostname = hostnameRaw.split(':')[0];
  if (!hostname) return DEFAULT_BRAND_DOMAIN;
  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) return DEFAULT_BRAND_DOMAIN;
  return normalizeBrandUrl(hostname);
}

type FirebaseLoginBody = {
  idToken: string;
  providerId?: string;
  referralCode?: string;
};

type FirebaseLoginResponse = {
  statusCode: number;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

export async function POST(request: Request) {
  try {
    const fallbackProviderId = process.env.YBB_FIREBASE_GOOGLE_PROVIDER_ID || DEFAULT_PROVIDER_ID;
    const brandDomain = resolveBrandDomainFromRequest(request);

    const body = (await request.json()) as FirebaseLoginBody;

    if (!body?.idToken) {
      return NextResponse.json(
        { statusCode: 400, message: 'idToken is required', data: null },
        { status: 400 },
      );
    }

    const url = new URL('/v1/auth/firebase-login', 'https://staging-api.ybbhub.com');

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify({
        idToken: body.idToken,
        providerId: body.providerId || fallbackProviderId,
        ...(body.referralCode ? { referralCode: body.referralCode } : {}),
      }),
    });

    const json = (await res.json()) as FirebaseLoginResponse;

    if (!res.ok || (json.statusCode !== 200 && json.statusCode !== 201)) {
      return NextResponse.json(
        {
          statusCode: json.statusCode ?? res.status,
          message: json.message || 'Login failed',
          data: null,
        },
        { status: res.status },
      );
    }

    const accessToken = json.data?.accessToken ?? json.accessToken;
    const refreshToken = json.data?.refreshToken ?? json.refreshToken;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing accessToken/refreshToken in response', data: null },
        { status: 500 },
      );
    }

    const response = NextResponse.json({ statusCode: 200, message: 'Success', data: null });

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
      {
        statusCode: 500,
        message,
        data: null,
      },
      { status: 500 },
    );
  }
}
