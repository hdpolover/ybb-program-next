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
    const stats = apiData.stats ?? {};

    const toItem = (inv: any, status: 'paid' | 'unpaid') => ({
      id: inv.id,
      label: inv.title ?? 'Payment',
      status,
      period: inv.dueDate
        ? new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : inv.paidAt
        ? new Date(inv.paidAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '—',
      amount: `${inv.currency ?? 'USD'} ${Number(inv.amount ?? 0).toFixed(2)}`,
      syncDate: inv.paidAt
        ? new Date(inv.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—',
    });

    const items = [
      ...history.map((inv) => toItem(inv, 'paid')),
      ...outstanding.map((inv) => toItem(inv, 'unpaid')),
    ];

    const overdue = outstanding.filter(
      (inv) => inv.dueDate && new Date(inv.dueDate) < new Date(),
    ).length;

    const summary = {
      complete: history.length,
      pending: outstanding.length - overdue,
      overdue,
      totalRequired: `${stats.currency ?? 'USD'} ${Number((stats.totalPaid ?? 0) + (stats.totalDue ?? 0)).toFixed(2)}`,
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
