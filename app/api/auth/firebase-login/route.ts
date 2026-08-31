import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { fetchAuthContext } from '@/lib/api/authContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';


type FirebaseLoginBody = {
  idToken: string;
  providerId?: string;
  referralCode?: string;
  /** The edition the person picked on the signup form, when the brand has more than one. */
  programSlug?: string;
};

type ProgramRegistrationClosed = {
  status: 'closed';
  programId: string;
  programName: string;
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
    programRegistration?: ProgramRegistrationClosed;
  };
  user?: { isOnboardingCompleted?: boolean; onboarding?: boolean };
  programRegistration?: ProgramRegistrationClosed;
};


export async function POST(request: Request) {
  try {
    const brandDomain = resolveBrandDomainFromRequest(request);

    const body = (await request.json()) as FirebaseLoginBody;

    if (!body?.idToken) {
      return NextResponse.json(
        { statusCode: 400, message: 'idToken is required', data: null },
        { status: 400 },
      );
    }

    const url = new URL('/v1/auth/firebase-login', getServerApiBaseUrl());

    let brandId: string | undefined;
    let programId: string | undefined;
    let programSlug: string | undefined;
    try {
      const ctx = await fetchAuthContext(brandDomain);
      brandId = ctx.brandId ?? undefined;
      programId = ctx.programId ?? undefined;
      programSlug = ctx.programSlug ?? undefined;

      // An explicit choice from the signup form wins over the server's pick.
      // programId must be cleared with it: resolveAuthTargetProgram checks
      // programId FIRST, so leaving the context's id would silently override
      // the chosen slug and reintroduce the bug this fixes.
      const chosenSlug = typeof body.programSlug === 'string' ? body.programSlug.trim() : '';
      if (chosenSlug && chosenSlug !== programSlug) {
        programSlug = chosenSlug;
        programId = undefined;
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown auth-context error';
      console.error('[firebase-login] auth-context fetch failed', { brandDomain, error: errMsg });
      return NextResponse.json(
        { statusCode: 500, message: `auth-context fetch failed: ${errMsg}`, data: null },
        { status: 500 },
      );
    }

    // Resolve referral code: explicit body value takes priority, then fall back to cookie
    const cookieHeader = request.headers.get('cookie') ?? '';
    const cookieReferralCode = cookieHeader
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('ybb_referral_code='))
      ?.split('=')[1] ?? null;
    const resolvedReferralCode = body.referralCode || cookieReferralCode || null;

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

    const isNewUser = json.statusCode === 201 || res.status === 201;

    const isOnboardingCompleted =
      json.data?.user?.isOnboardingCompleted ??
      json.user?.isOnboardingCompleted ??
      (typeof json.data?.user?.onboarding === 'boolean' ? !json.data.user.onboarding : undefined) ??
      (typeof json.user?.onboarding === 'boolean' ? !json.user.onboarding : undefined);

    const accessToken = json.data?.accessToken ?? json.accessToken;
    const refreshToken = json.data?.refreshToken ?? json.refreshToken;
    const programRegistration = json.data?.programRegistration ?? json.programRegistration;

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
        ...(programRegistration ? { programRegistration } : {}),
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

    response.cookies.set('activeRole', 'participant', {
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
