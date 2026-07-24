// app/api/participants/referral/clear/route.ts

import { NextResponse } from 'next/server';
import { getCsrfGuardRejection } from '@/lib/server/bffSecurity';

const REFERRAL_COOKIE_NAME = 'ybb_referral_code';

// Lets a participant disown an ambassador attribution they didn't ask for
// ("Not you? Clear" on the onboarding chip) by expiring the httpOnly
// ybb_referral_code cookie set by middleware.ts.
export async function POST(request: Request) {
  try {
    const csrfRejection = getCsrfGuardRejection(request);
    if (csrfRejection) return csrfRejection;

    const response = NextResponse.json({ statusCode: 200, message: 'Success', data: null });

    response.cookies.set(REFERRAL_COOKIE_NAME, '', {
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
