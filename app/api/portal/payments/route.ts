import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getCalendarDayDifference, parseApiDate } from '@/lib/utils';
import { formatDeadlineWib } from '@/lib/format/deadline';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { isRecord } from '@/lib/api/response';
import { isFetchTimeoutError, withTimeoutSignal } from '@/lib/api/fetchWithTimeout';

// Deliberately shorter than PAYMENTS_FETCH_TIMEOUT_MS in PaymentsListSection
// so this hop times out first and returns a real 504, instead of the browser
// aborting blind while the upstream call is still in flight.
const PAYMENTS_PROXY_TIMEOUT_MS = 12_000;

export async function GET(request: Request) {
  const { signal, cleanup } = withTimeoutSignal(PAYMENTS_PROXY_TIMEOUT_MS);

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const requestUrl = new URL(request.url);
    const programId = requestUrl.searchParams.get('programId');

    const apiUrl = new URL('/v1/portal/payments', getServerApiBaseUrl());
    if (programId) {
      apiUrl.searchParams.set('programId', programId);
    }
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
      signal,
    });

    const json = await res.json().catch(() => ({}));
    const jsonRecord = isRecord(json) ? json : {};
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: typeof jsonRecord.statusCode === 'number' ? jsonRecord.statusCode : res.status,
          message: typeof jsonRecord.message === 'string' ? jsonRecord.message : 'Failed to fetch payments',
          data: jsonRecord.data ?? null,
        },
        { status: res.status },
      );
    }

    // Transform API shape { history, outstanding, availableMethods, stats }
    // into what the frontend PaymentsListSection expects: { items, summary }
    const apiDataRaw: unknown = jsonRecord.data ?? json ?? {};
    const apiData = isRecord(apiDataRaw) ? apiDataRaw : {};
    const history: unknown[] = Array.isArray(apiData.history) ? apiData.history : [];
    const outstanding: unknown[] = Array.isArray(apiData.outstanding) ? apiData.outstanding : [];
    const availableMethods: unknown[] = Array.isArray(apiData.availableMethods) ? apiData.availableMethods : [];
    const statsRaw: unknown = apiData.stats ?? {};
    const stats = isRecord(statsRaw) ? statsRaw : {};
    const now = new Date();

    type ItemStatus = 'paid' | 'unpaid' | 'processing' | 'failed';
    type MergedItem = {
      id: string;
      label: string;
      status: ItemStatus;
      rawType: string;
      paymentType: string;
      amount: string;
      syncDate: string;
      hasInvoice: boolean;
      sequenceOrder: number;
      startTime: number;
      hasStarted: boolean;
      amountValue: number;
      currency: string;
      startDate?: string;
      dueDate?: string;
      paidAt?: string;
      canPay: boolean;
    };

    const getFeeTypePriority = (value: unknown): number => {
      const raw = String(value ?? '').toLowerCase();
      if (raw === 'registration_fee') return 1;
      if (raw === 'program_fee_1' || raw === 'full_fee') return 2;
      if (raw === 'program_fee_2') return 3;
      return 99;
    };

    const formatPaymentType = (value: unknown): string => {
      const raw = String(value ?? '').toLowerCase();
      if (!raw) return 'General';
      if (raw === 'registration_fee') return 'Registration Fee';
      if (raw === 'full_fee') return 'Program Fee';
      if (raw === 'program_fee_1') return 'Program Fee 1';
      if (raw === 'program_fee_2') return 'Program Fee 2';
      return raw
        .split('_')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
    };

    const normalizeStatus = (status: unknown, fallback: ItemStatus): ItemStatus => {
      const normalizedStatus = String(status ?? fallback).toLowerCase();
      if (normalizedStatus === 'paid') return 'paid';
      if (normalizedStatus === 'processing' || normalizedStatus === 'pending') return 'processing';
      if (normalizedStatus === 'failed' || normalizedStatus === 'cancelled') return 'failed';
      return 'unpaid';
    };

    const toStartDate = (value: unknown): Date | null => {
      if (!value) return null;
      const date = parseApiDate(String(value));
      return Number.isNaN(date.getTime()) ? null : date;
    };


    const toItem = (inv: unknown, fallbackStatus: ItemStatus): MergedItem => {
      const invRecord = isRecord(inv) ? inv : {};
      const startDate = toStartDate(invRecord.startDate);
      const dueDate = toStartDate(invRecord.dueDate);
      const status = normalizeStatus(invRecord.status, fallbackStatus);
      const amountValue = Number(invRecord.amount ?? 0);
      const currency = String(invRecord.currency ?? stats.currency ?? 'USD');
      const rawType = String(invRecord.type ?? '').toLowerCase();
      const fallbackSequenceOrder = getFeeTypePriority(rawType) * 1000;
      const paidAt = invRecord.paidAt ? parseApiDate(String(invRecord.paidAt)) : null;
      const explicitCanPay = typeof invRecord.canPay === 'boolean' ? invRecord.canPay : undefined;
      const paidAtLabel =
        paidAt && !Number.isNaN(paidAt.getTime())
          ? formatDeadlineWib(paidAt, { withTime: false })
          : '—';

      return {
        id: String(invRecord.id ?? ''),
        label: typeof invRecord.title === 'string' ? invRecord.title : 'Payment',
        status,
        rawType,
        paymentType: formatPaymentType(invRecord.type),
        amount: `${currency} ${amountValue.toFixed(2)}`,
        syncDate: paidAtLabel,
        hasInvoice: true,
        sequenceOrder: Number(invRecord.sequenceOrder ?? fallbackSequenceOrder),
        startTime: startDate?.getTime() ?? 0,
        hasStarted: !startDate || startDate <= now,
        amountValue,
        currency,
        startDate: startDate?.toISOString(),
        dueDate: dueDate?.toISOString(),
        paidAt: paidAt && !Number.isNaN(paidAt.getTime()) ? paidAt.toISOString() : undefined,
        canPay: explicitCanPay ?? ((status === 'unpaid' || status === 'failed') && amountValue > 0),
      };
    };

    const invoiceItems: MergedItem[] = [
      ...history.map((inv) => toItem(inv, 'paid')),
      ...outstanding.map((inv) => toItem(inv, 'unpaid')),
    ];

    const availableRows: MergedItem[] = availableMethods.map((method) => {
      const methodRecord = isRecord(method) ? method : {};
      const startDate = toStartDate(methodRecord.startDate);
      const dueDate = toStartDate(methodRecord.dueDate);
      const amountValue = Number(methodRecord.amount ?? 0);
      const currency = String(methodRecord.currency ?? stats.currency ?? 'USD');
      const rawType = String(methodRecord.type ?? '').toLowerCase();
      const fallbackSequenceOrder = getFeeTypePriority(rawType) * 1000;

      return {
        id: `tier:${methodRecord.id}`,
        label: typeof methodRecord.title === 'string' ? methodRecord.title : 'Payment',
        status: 'unpaid',
        rawType,
        paymentType: formatPaymentType(methodRecord.type),
        amount: `${currency} ${amountValue.toFixed(2)}`,
        syncDate: 'Not paid yet',
        hasInvoice: false,
        sequenceOrder: Number(methodRecord.sequenceOrder ?? fallbackSequenceOrder),
        startTime: startDate?.getTime() ?? 0,
        hasStarted: !startDate || startDate <= now,
        amountValue,
        currency,
        startDate: startDate?.toISOString(),
        dueDate: dueDate?.toISOString(),
        canPay: amountValue > 0 && (!startDate || startDate <= now),
      };
    });

    const sortedItems = [...invoiceItems, ...availableRows].sort((a, b) => {
      if (a.sequenceOrder !== b.sequenceOrder) {
        return a.sequenceOrder - b.sequenceOrder;
      }

      return a.startTime - b.startTime;
    });

    // Keep payment sequence linear: stop after first unresolved stage,
    // and do not reveal future stages before their start date.
    const stagedItems: MergedItem[] = [];
    for (const item of sortedItems) {
      if (!item.hasStarted) {
        break;
      }

      stagedItems.push(item);
      if (item.status !== 'paid') {
        break;
      }
    }

    const outstandingItems = stagedItems.filter((item) => item.status !== 'paid' && item.amountValue > 0);
    const currencyForSummary =
      outstandingItems[0]?.currency ??
      stagedItems[0]?.currency ??
      String(stats.currency ?? 'USD');
    const totalRequiredValue = outstandingItems.reduce((sum, item) => sum + item.amountValue, 0);
    const complete = stagedItems.filter((item) => item.status === 'paid').length;
    const pending = stagedItems.filter((item) => item.status !== 'paid').length;
    const overdue = stagedItems.filter(
      (item) =>
        item.status === 'unpaid' &&
        item.dueDate &&
        (() => {
          const dayDiff = getCalendarDayDifference(now, parseApiDate(item.dueDate));
          return dayDiff !== null && dayDiff < 0;
        })(),
    ).length;

    const items = stagedItems.map(({ id, label, status, paymentType, amount, syncDate, hasInvoice, startDate, dueDate, paidAt, canPay }) => ({
      id,
      label,
      status,
      paymentType,
      amount,
      syncDate,
      hasInvoice,
      startDate,
      dueDate,
      paidAt,
      canPay,
    }));

    const summary = {
      complete,
      pending,
      overdue,
      totalRequired: `${currencyForSummary} ${totalRequiredValue.toFixed(2)}`,
    };

    return NextResponse.json({ statusCode: 200, message: 'Success', data: { items, summary } });
  } catch (error) {
    if (isFetchTimeoutError(error)) {
      return NextResponse.json(
        { statusCode: 504, message: 'Payments request timed out. Please try again.', data: null },
        { status: 504 },
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { statusCode: 500, message, data: null },
      { status: 500 },
    );
  } finally {
    cleanup();
  }
}
