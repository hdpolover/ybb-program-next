import { NextResponse } from 'next/server';

function normalizeBrandUrl(input: string): string {
  const trimmed = (input || '').trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.replace(/^https?:\/\//, '');
}

const DEFAULT_BRAND_URL =
  normalizeBrandUrl(process.env.YBB_BRAND_DOMAIN || process.env.NEXT_PUBLIC_BRAND_DOMAIN || '') ||
  'istanbulyouthsummit.com';

function resolveBrandDomainFromRequest(request: Request): string {
  const hostnameRaw = request.headers.get('x-hostname') || request.headers.get('host') || '';
  const hostname = hostnameRaw.split(':')[0];
  if (!hostname) return DEFAULT_BRAND_URL;
  if (hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1')) return DEFAULT_BRAND_URL;
  return normalizeBrandUrl(hostname);
}

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

    const apiUrl = new URL('/v1/auth/verify-email', 'https://staging-api.ybbhub.com');
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
