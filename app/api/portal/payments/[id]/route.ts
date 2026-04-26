import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}

function getEnvelopeData(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  return 'data' in payload ? payload.data ?? null : payload;
}

function toIsoString(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function buildFallbackPaymentDetail(payload: unknown, id: string) {
  const apiData = getEnvelopeData(payload);
  if (!isRecord(apiData)) return null;

  const historyRows = Array.isArray(apiData.history) ? apiData.history : [];
  const outstandingRows = Array.isArray(apiData.outstanding) ? apiData.outstanding : [];
  const invoiceRow =
    [...historyRows, ...outstandingRows].find(
      (row) => isRecord(row) && typeof row.id === 'string' && row.id === id,
    ) ?? null;

  if (!isRecord(invoiceRow)) return null;

  const currency =
    typeof invoiceRow.currency === 'string' && invoiceRow.currency.trim().length > 0
      ? invoiceRow.currency.toUpperCase()
      : 'USD';
  const amount =
    typeof invoiceRow.amount === 'number' && Number.isFinite(invoiceRow.amount)
      ? invoiceRow.amount
      : Number(invoiceRow.amount ?? 0) || 0;
  const rawStatus = String(invoiceRow.status ?? 'unpaid').toLowerCase();
  const status =
    rawStatus === 'paid'
      ? 'paid'
      : rawStatus === 'processing' || rawStatus === 'pending'
        ? 'processing'
        : rawStatus === 'failed' || rawStatus === 'cancelled'
          ? 'failed'
          : 'unpaid';
  const paidAtIso = toIsoString(invoiceRow.paidAt);
  const updatedAtIso = toIsoString(invoiceRow.updatedAt) ?? paidAtIso;
  const history =
    status === 'paid' || status === 'processing' || status === 'failed'
      ? [
          {
            id:
              typeof invoiceRow.externalTransactionId === 'string' && invoiceRow.externalTransactionId.trim().length > 0
                ? invoiceRow.externalTransactionId
                : id,
            method:
              typeof invoiceRow.paymentMethod === 'string' && invoiceRow.paymentMethod.trim().length > 0
                ? invoiceRow.paymentMethod
                : status === 'paid'
                  ? 'payment'
                  : 'manual',
            amount,
            date: (paidAtIso ?? updatedAtIso ?? '').split('T')[0] || '-',
            time: (paidAtIso ?? updatedAtIso ?? '').split('T')[1]?.slice(0, 5) || '-',
            status,
            note:
              status === 'paid'
                ? 'Payment confirmed'
                : status === 'processing'
                  ? 'Payment submitted, awaiting verification'
                  : 'Payment failed',
            code:
              typeof invoiceRow.externalTransactionId === 'string' && invoiceRow.externalTransactionId.trim().length > 0
                ? invoiceRow.externalTransactionId
                : undefined,
            paymentMethod:
              typeof invoiceRow.paymentMethod === 'string' && invoiceRow.paymentMethod.trim().length > 0
                ? invoiceRow.paymentMethod
                : undefined,
            dateTime: paidAtIso ?? updatedAtIso,
            amountLabel: `${currency} ${amount.toFixed(currency === 'IDR' ? 0 : 2)}`,
          },
        ]
      : [];

  return {
    invoice: {
      id,
      label: typeof invoiceRow.title === 'string' && invoiceRow.title.trim().length > 0 ? invoiceRow.title : 'Payment',
      category: typeof invoiceRow.type === 'string' && invoiceRow.type.trim().length > 0 ? invoiceRow.type : 'payment',
      amount,
      dueDate: typeof invoiceRow.dueDate === 'string' ? invoiceRow.dueDate : undefined,
      status,
      currency,
    },
    history,
  };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const { id } = await params;
    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiBase = (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, '');

    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'x-brand-domain': brandDomain,
    };

    const apiUrl = new URL(`/v1/portal/payments/${id}`, apiBase);
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      return NextResponse.json({ statusCode: 200, message: 'Success', data: (json as any)?.data ?? json ?? null });
    }

    const fallbackUrl = new URL('/v1/portal/payments', apiBase);
    const fallbackRes = await fetch(fallbackUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
    const fallbackJson = await fallbackRes.json().catch(() => ({}));
    const fallbackDetail = buildFallbackPaymentDetail(fallbackJson, id);

    if (fallbackRes.ok && fallbackDetail) {
      return NextResponse.json({ statusCode: 200, message: 'Success', data: fallbackDetail });
    }

    return NextResponse.json(
      {
        statusCode: (json as any)?.statusCode ?? res.status,
        message: (json as any)?.message ?? 'Failed to fetch payment detail',
        data: (json as any)?.data ?? null,
      },
      { status: res.status },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    try {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('accessToken')?.value;
      const { id } = await params;
      const brandDomain = resolveBrandDomainFromRequest(request);

      if (accessToken) {
        const apiBase = (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, '');
        const fallbackUrl = new URL('/v1/portal/payments', apiBase);
        const fallbackRes = await fetch(fallbackUrl.toString(), {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'x-brand-domain': brandDomain,
          },
          cache: 'no-store',
        });
        const fallbackJson = await fallbackRes.json().catch(() => ({}));
        const fallbackDetail = buildFallbackPaymentDetail(fallbackJson, id);

        if (fallbackRes.ok && fallbackDetail) {
          return NextResponse.json({ statusCode: 200, message: 'Success', data: fallbackDetail });
        }
      }
    } catch {
      // Preserve the original network error below if the fallback path also fails.
    }

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
