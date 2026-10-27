// app/api/checkout/route.ts
//
// Inline-signup checkout: the API creates the account + invoice and returns the
// login token pair plus the Xendit redirect. We set the same session cookies the
// local-login BFF route sets, and never hand the tokens to the browser JS.
import { NextResponse } from 'next/server';
import { getCsrfGuardRejection } from '@/lib/server/bffSecurity';
import { callCheckoutApi } from '@/lib/server/checkoutProxy';
import { isCartCategory, validateCartLine } from '@/lib/checkout/cart';
import { isRecord } from '@/lib/api/response';

type CheckoutBody = {
  programSlug?: string;
  tierId?: string;
  category?: string;
  email?: string;
  password?: string;
  fullName?: string;
  consent?: boolean;
  acceptTerms?: boolean;
  turnstileToken?: string;
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function POST(request: Request) {
  const csrfRejection = getCsrfGuardRejection(request);
  if (csrfRejection) return csrfRejection;

  const body = (await request.json().catch(() => null)) as CheckoutBody | null;
  const line = validateCartLine(body);
  if (
    !body ||
    !line ||
    !isCartCategory(body.category) ||
    typeof body.email !== 'string' ||
    typeof body.password !== 'string' ||
    typeof body.fullName !== 'string' ||
    body.consent !== true ||
    body.acceptTerms !== true
  ) {
    return NextResponse.json({ statusCode: 400, message: 'Invalid checkout request', data: null }, { status: 400 });
  }

  // Explicit allow-list: nothing else the browser sent reaches the API.
  const result = await callCheckoutApi(request, {
    method: 'POST',
    path: '',
    body: {
      ...line,
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      consent: true,
      acceptTerms: true,
      turnstileToken: typeof body.turnstileToken === 'string' ? body.turnstileToken : '',
    },
  });
  if (!result.ok) return result.response;

  const data = isRecord(result.data) ? result.data : {};
  const accessToken = typeof data.accessToken === 'string' ? data.accessToken : '';
  const refreshToken = typeof data.refreshToken === 'string' ? data.refreshToken : '';
  const redirectUrl = typeof data.redirectUrl === 'string' ? data.redirectUrl : '';
  if (!accessToken || !refreshToken || !redirectUrl) {
    console.error('[api/checkout] malformed checkout response', {
      hasAccess: !!accessToken,
      hasRefresh: !!refreshToken,
      hasRedirect: !!redirectUrl,
    });
    return NextResponse.json(
      { statusCode: 500, message: 'Checkout returned an incomplete response', data: null },
      { status: 500 },
    );
  }

  const response = NextResponse.json({
    statusCode: 201,
    message: 'Success',
    data: { redirectUrl, invoiceId: typeof data.invoiceId === 'string' ? data.invoiceId : null },
  });
  response.cookies.set('accessToken', accessToken, cookieOptions);
  response.cookies.set('refreshToken', refreshToken, cookieOptions);
  response.cookies.set('activeRole', 'participant', cookieOptions);
  return response;
}
