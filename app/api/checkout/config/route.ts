// app/api/checkout/config/route.ts
import { NextResponse } from 'next/server';
import { proxyCheckout } from '@/lib/server/checkoutProxy';
import { validateCartLine } from '@/lib/checkout/cart';

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const programSlug = params.get('programSlug') ?? '';
  const tierId = params.get('tierId') ?? '';
  // Shape-check only: the API authorises the tier. Category is irrelevant to config.
  if (!validateCartLine({ programSlug, tierId, category: 'self_funded' })) {
    return NextResponse.json(
      { statusCode: 400, message: 'programSlug and tierId are required', data: null },
      { status: 400 },
    );
  }
  return proxyCheckout(request, { method: 'GET', path: '/config', query: { programSlug, tierId } });
}
