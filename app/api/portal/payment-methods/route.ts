import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { PAYMENT_METHODS_CACHE_TTL, getPaymentMethodsCacheKey } from '@/lib/constants/cache';
import { dedupeInFlight } from '@/lib/server/stampede';

type PaymentMethodsCacheEntry = {
  expiresAt: number;
  methods: unknown[];
};

class PaymentMethodsUpstreamError extends Error {
  constructor(
    readonly status: number,
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'PaymentMethodsUpstreamError';
  }
}

const paymentMethodsCache = new Map<string, PaymentMethodsCacheEntry>();

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const cacheKey = getPaymentMethodsCacheKey(brandDomain);
    const cached = paymentMethodsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json({ statusCode: 200, message: 'Success', data: cached.methods });
    }

    const apiBase = (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, '');
    const apiUrl = new URL('/v1/portal/payment-methods', apiBase);

    const methods = await dedupeInFlight(cacheKey, async () => {
      const res = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-brand-domain': brandDomain,
        },
        cache: 'no-store',
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new PaymentMethodsUpstreamError(
          res.status,
          (json as any)?.statusCode ?? res.status,
          (json as any)?.message ?? 'Failed to fetch payment methods',
        );
      }

      const payload = (json as any)?.data ?? json;
      const resolvedMethods = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as any)?.data)
          ? (payload as any).data
          : Array.isArray((payload as any)?.methods)
            ? (payload as any).methods
            : [];

      paymentMethodsCache.set(cacheKey, {
        methods: resolvedMethods,
        expiresAt: Date.now() + PAYMENT_METHODS_CACHE_TTL * 1000,
      });
      return resolvedMethods;
    });

    return NextResponse.json({ statusCode: 200, message: 'Success', data: methods });
  } catch (error) {
    if (error instanceof PaymentMethodsUpstreamError) {
      return NextResponse.json(
        { statusCode: error.statusCode, message: error.message, data: null },
        { status: error.status },
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ statusCode: 500, message, data: null }, { status: 500 });
  }
}
