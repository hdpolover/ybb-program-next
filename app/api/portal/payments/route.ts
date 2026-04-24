import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

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
      paymentType: string;
      period: string;
      amount: string;
      syncDate: string;
      hasInvoice: boolean;
      sequenceOrder: number;
      startTime: number;
      hasStarted: boolean;
      amountValue: number;
      currency: string;
      dueDate?: string;
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
      const date = new Date(String(value));
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const toPeriodLabel = (startDate: Date | null, paidAt: unknown): string => {
      if (startDate) {
        return startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }

      if (paidAt) {
        const paidDate = new Date(String(paidAt));
        if (!Number.isNaN(paidDate.getTime())) {
          return paidDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
      }

      return '—';
    };

    const toItem = (inv: any, fallbackStatus: ItemStatus): MergedItem => {
      const startDate = toStartDate(inv.startDate);
      const status = normalizeStatus(inv.status, fallbackStatus);
      const amountValue = Number(inv.amount ?? 0);
      const currency = String(inv.currency ?? stats.currency ?? 'USD');

      return {
        id: inv.id,
        label: inv.title ?? 'Payment',
        status,
        paymentType: formatPaymentType(inv.type),
        period: toPeriodLabel(startDate, inv.paidAt),
        amount: `${currency} ${amountValue.toFixed(2)}`,
        syncDate: inv.paidAt
          ? new Date(inv.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '—',
        hasInvoice: true,
        sequenceOrder: Number(inv.sequenceOrder ?? Number.MAX_SAFE_INTEGER),
        startTime: startDate?.getTime() ?? Number.MAX_SAFE_INTEGER,
        hasStarted: !startDate || startDate <= now,
        amountValue,
        currency,
        dueDate: inv.dueDate,
      };
    };

    const invoiceItems: MergedItem[] = [
      ...history.map((inv) => toItem(inv, 'paid')),
      ...outstanding.map((inv) => toItem(inv, 'unpaid')),
    ];

    const availableRows: MergedItem[] = availableMethods.map((method) => {
      const startDate = toStartDate(method.startDate);
      const amountValue = Number(method.amount ?? 0);
      const currency = String(method.currency ?? stats.currency ?? 'USD');

      return {
        id: `tier:${method.id}`,
        label: method.title ?? 'Payment',
        status: 'unpaid',
        paymentType: formatPaymentType(method.type),
        period: toPeriodLabel(startDate, null),
        amount: `${currency} ${amountValue.toFixed(2)}`,
        syncDate: 'Not paid yet',
        hasInvoice: false,
        sequenceOrder: Number(method.sequenceOrder ?? Number.MAX_SAFE_INTEGER),
        startTime: startDate?.getTime() ?? Number.MAX_SAFE_INTEGER,
        hasStarted: !startDate || startDate <= now,
        amountValue,
        currency,
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
      if (!item.hasInvoice && !item.hasStarted) {
        break;
      }

      stagedItems.push(item);
      if (item.status !== 'paid') {
        break;
      }
    }

    const currencyForSummary = stagedItems[0]?.currency ?? String(stats.currency ?? 'USD');
    const totalRequiredValue = stagedItems.reduce((sum, item) => sum + item.amountValue, 0);
    const complete = stagedItems.filter((item) => item.status === 'paid').length;
    const pending = stagedItems.filter((item) => item.status !== 'paid').length;
    const overdue = stagedItems.filter(
      (item) => item.status === 'unpaid' && item.dueDate && new Date(item.dueDate) < now,
    ).length;

    const items = stagedItems.map(({ sequenceOrder, startTime, hasStarted, amountValue, currency, dueDate, ...rest }) => rest);

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
