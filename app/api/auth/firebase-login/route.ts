import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { fetchAuthContext } from '@/lib/api/authContext';


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
    user?: { isOnboardingCompleted?: boolean; onboarding?: boolean };
  };
  user?: { isOnboardingCompleted?: boolean; onboarding?: boolean };
};

type ProvidersResponse = {
  statusCode: number;
  message: string;
  data: Array<{ id: string; name: string; isOAuth: boolean }>;
};

export async function POST(request: Request) {
  try {
    console.log('[firebase-login] Starting...');
    const brandDomain = resolveBrandDomainFromRequest(request);
    console.log('[firebase-login] brandDomain:', brandDomain);
    
    const body = (await request.json()) as FirebaseLoginBody;
    console.log('[firebase-login] Has idToken:', !!body?.idToken, 'Has providerId:', !!body?.providerId);

    if (!body?.idToken) {
      return NextResponse.json(
        { statusCode: 400, message: 'idToken is required', data: null },
        { status: 400 },
      );
    }

    const baseCandidate = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com';
    const apiBaseUrl = baseCandidate.replace(/\/v1\/?$/, '');
    const url = new URL('/v1/auth/firebase-login', apiBaseUrl);
    console.log('[firebase-login] API URL:', url.toString());

    let brandId: string | undefined;
    let programId: string | undefined;
    let programSlug: string | undefined;
    try {
      const ctx = await fetchAuthContext(brandDomain);
      brandId = ctx.brandId ?? undefined;
      programId = ctx.programId ?? undefined;
      programSlug = ctx.programSlug ?? undefined;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown auth-context error';
      console.error('[firebase-login] auth-context fetch failed', { brandDomain, error: errMsg });
      return NextResponse.json(
        { statusCode: 500, message: `auth-context fetch failed: ${errMsg}`, data: null },
        { status: 500 },
      );
    }
    console.log('[firebase-login] Auth context resolved:', { brandId, programId, programSlug });

    // Resolve referral code: explicit body value takes priority, then fall back to cookie
    const cookieHeader = request.headers.get('cookie') ?? '';
    const cookieReferralCode = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('ybb_referral_code='))
      ?.split('=')[1] ?? null;
    const resolvedReferralCode = body.referralCode || cookieReferralCode || null;

    console.log('[firebase-login] Calling backend with brandId:', brandId, 'programId:', programId);
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify({
        idToken: body.idToken,
        providerId: body.providerId, // Now optional
        ...(brandId ? { brandId } : {}),
        ...(programId ? { programId } : {}),
        ...(programSlug ? { programSlug } : {}),
        ...(resolvedReferralCode ? { referralCode: resolvedReferralCode } : {}),
      }),
    });

    console.log('[firebase-login] Backend status:', res.status);
    const json = (await res.json()) as FirebaseLoginResponse;
    console.log('[firebase-login] Backend response:', json);

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

    const isNewUser = json.statusCode === 201 || res.status === 201;

    const isOnboardingCompleted =
      json.data?.user?.isOnboardingCompleted ??
      json.user?.isOnboardingCompleted ??
      (typeof json.data?.user?.onboarding === 'boolean' ? !json.data.user.onboarding : undefined) ??
      (typeof json.user?.onboarding === 'boolean' ? !json.user.onboarding : undefined);

    const accessToken = json.data?.accessToken ?? json.accessToken;
    const refreshToken = json.data?.refreshToken ?? json.refreshToken;

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { statusCode: 500, message: 'Missing accessToken/refreshToken in response', data: null },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      statusCode: isNewUser ? 201 : 200,
      message: 'Success',
      data: {
        isNewUser,
        ...(typeof isOnboardingCompleted === 'boolean' ? { isOnboardingCompleted } : {}),
        ...(process.env.NODE_ENV !== 'production' ? { providerIdUsed: body.providerId } : {}),
      },
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
    console.error('[firebase-login] Error:', message, error);
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
