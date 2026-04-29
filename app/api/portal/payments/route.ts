import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getCalendarDayDifference, getInclusiveCalendarDaySpan, parseApiDate } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const requestUrl = new URL(request.url);
    const programId = requestUrl.searchParams.get('programId');

    const apiUrl = new URL('/v1/portal/payments', (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, ''));
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
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: (json as any)?.statusCode ?? res.status,
          message: (json as any)?.message ?? 'Failed to fetch payments',
          data: (json as any)?.data ?? null,
        },
        { status: res.status },
      );
    }

    // Transform API shape { history, outstanding, availableMethods, stats }
    // into what the frontend PaymentsListSection expects: { items, summary }
    const apiData = (json as any)?.data ?? json ?? {};
    const history: any[] = apiData.history ?? [];
    const outstanding: any[] = apiData.outstanding ?? [];
    const availableMethods: any[] = apiData.availableMethods ?? [];
    const stats = apiData.stats ?? {};
    const now = new Date();

    type ItemStatus = 'paid' | 'unpaid' | 'processing' | 'failed';
    type MergedItem = {
      id: string;
      label: string;
      status: ItemStatus;
      rawType: string;
      paymentType: string;
      period: string;
      deadline: string;
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

    const formatDateTime = (value: Date): string =>
      value.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    const formatShortDate = (value: Date): string =>
      value.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    const formatDaysLeft = (dueDate: Date): string => {
      const days = getInclusiveCalendarDaySpan(now, dueDate);
      if (!days || days <= 0) return 'Expired';
      return `${days} day${days === 1 ? '' : 's'} left`;
    };

    const formatDaysOverdue = (dueDate: Date): string => {
      const dayDiff = getCalendarDayDifference(dueDate, now);
      const days = dayDiff && dayDiff > 0 ? dayDiff : 1;
      return `${days} day${days === 1 ? '' : 's'} overdue`;
    };

    const toWindowLabel = (startDate: Date | null, dueDate: Date | null): string => {
      if (startDate && dueDate) {
        return `${formatShortDate(startDate)} - ${formatShortDate(dueDate)}`;
      }
      if (startDate) return `Starts ${formatShortDate(startDate)}`;
      if (dueDate) return `Until ${formatShortDate(dueDate)}`;
      return '—';
    };

    const toDeadlineLabel = (
      dueDate: Date | null,
      status: ItemStatus,
      paidAt: unknown,
    ): string => {
      const paidDate = paidAt ? parseApiDate(String(paidAt)) : null;
      if (status === 'paid') {
        return paidDate && !Number.isNaN(paidDate.getTime())
          ? `Paid ${formatDateTime(paidDate)}`
          : 'Completed';
      }

      if (status === 'processing') {
        return 'Awaiting verification';
      }

      if (!dueDate) return 'No deadline';

      const dayDiff = getCalendarDayDifference(now, dueDate);
      if (dayDiff !== null && dayDiff < 0) {
        return `${formatShortDate(dueDate)} • ${formatDaysOverdue(dueDate)}`;
      }
      return `${formatShortDate(dueDate)} • ${formatDaysLeft(dueDate)}`;
    };

    const toItem = (inv: any, fallbackStatus: ItemStatus): MergedItem => {
      const startDate = toStartDate(inv.startDate);
      const dueDate = toStartDate(inv.dueDate);
      const status = normalizeStatus(inv.status, fallbackStatus);
      const amountValue = Number(inv.amount ?? 0);
      const currency = String(inv.currency ?? stats.currency ?? 'USD');
      const rawType = String(inv.type ?? '').toLowerCase();
      const fallbackSequenceOrder = getFeeTypePriority(rawType) * 1000;
      const paidAt = inv.paidAt ? parseApiDate(inv.paidAt) : null;
      const explicitCanPay = typeof inv.canPay === 'boolean' ? inv.canPay : undefined;
      const paidAtLabel =
        paidAt && !Number.isNaN(paidAt.getTime())
          ? paidAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '—';

      return {
        id: inv.id,
        label: inv.title ?? 'Payment',
        status,
        rawType,
        paymentType: formatPaymentType(inv.type),
        period: toWindowLabel(startDate, dueDate),
        deadline: toDeadlineLabel(dueDate, status, inv.paidAt),
        amount: `${currency} ${amountValue.toFixed(2)}`,
        syncDate: paidAtLabel,
        hasInvoice: true,
        sequenceOrder: Number(inv.sequenceOrder ?? fallbackSequenceOrder),
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
      const startDate = toStartDate(method.startDate);
      const dueDate = toStartDate(method.dueDate);
      const amountValue = Number(method.amount ?? 0);
      const currency = String(method.currency ?? stats.currency ?? 'USD');
      const rawType = String(method.type ?? '').toLowerCase();
      const fallbackSequenceOrder = getFeeTypePriority(rawType) * 1000;

      return {
        id: `tier:${method.id}`,
        label: method.title ?? 'Payment',
        status: 'unpaid',
        rawType,
        paymentType: formatPaymentType(method.type),
        period: toWindowLabel(startDate, dueDate),
        deadline: toDeadlineLabel(dueDate, 'unpaid', null),
        amount: `${currency} ${amountValue.toFixed(2)}`,
        syncDate: 'Not paid yet',
        hasInvoice: false,
        sequenceOrder: Number(method.sequenceOrder ?? fallbackSequenceOrder),
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

    const items = stagedItems.map(({ sequenceOrder, startTime, hasStarted, amountValue, currency, dueDate, rawType, ...rest }) => rest);

    const summary = {
      complete,
      pending,
      overdue,
      totalRequired: `${currencyForSummary} ${totalRequiredValue.toFixed(2)}`,
    };

    return NextResponse.json({ statusCode: 200, message: 'Success', data: { items, summary } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { statusCode: 500, message, data: null },
      { status: 500 },
    );
  }
}
