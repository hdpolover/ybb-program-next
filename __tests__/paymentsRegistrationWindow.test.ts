// __tests__/paymentsRegistrationWindow.test.ts
//
// MEYS/CYS 2026: Fully Funded registration closed, yet the payments list kept a
// lapsed Fully Funded registration fee on screen as payable ("overdue") and the
// pay flow accepted it. The API now flags such a row windowClosed/canPay:false
// and refuses new invoices/payments with REGISTRATION_WINDOW_CLOSED.
//
// These exercise the BFF routes themselves (not a stubbed /api/... call), for
// the reason __tests__/cancelDeletionRoute.test.ts records: a page can be
// updated to read a code while the proxy silently drops it.
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: async () => ({ get: () => ({ value: 'access-token' }) }),
}));
vi.mock('@/lib/server/envContext', () => ({
  resolveBrandDomainFromRequest: () => 'example.com',
}));
vi.mock('@/lib/server/apiBaseUrl', () => ({
  getServerApiBaseUrl: () => 'http://api.internal',
}));
vi.mock('@/lib/server/bffSecurity', () => ({
  getCsrfGuardRejection: () => null,
}));

import { GET as getPayments } from '@/app/api/portal/payments/route';
import { POST as ensureInvoice } from '@/app/api/portal/payments/tiers/[tierId]/ensure-invoice/route';
import { POST as confirmPayment } from '@/app/api/portal/payments/[id]/confirm/route';
import {
  getPaymentErrorMessage,
  resolvePaymentRowAction,
} from '@/lib/dashboard/paymentOutcome';

const stubFetch = (ok: boolean, status: number, body: unknown) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok, status, json: async () => body })) as unknown as typeof fetch,
  );

const past = new Date(Date.now() - 30 * 86_400_000).toISOString();
const longPast = new Date(Date.now() - 60 * 86_400_000).toISOString();

describe('GET /api/portal/payments', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('keeps a closed-window registration fee listed but not payable, not required and not overdue', async () => {
    stubFetch(true, 200, {
      data: {
        history: [],
        outstanding: [],
        availableMethods: [
          {
            id: 'tier-ff',
            title: 'Fully Funded Registration',
            amount: 10,
            currency: 'USD',
            type: 'registration_fee',
            startDate: longPast,
            dueDate: past,
            sequenceOrder: 1001,
            canPay: false,
            windowClosed: true,
          },
        ],
        stats: { currency: 'USD' },
      },
    });

    const body = await (await getPayments(new Request('http://localhost/api/portal/payments'))).json();

    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0]).toMatchObject({ id: 'tier:tier-ff', canPay: false, windowClosed: true });
    expect(body.data.summary.totalRequired).toBe('USD 0.00');
    expect(body.data.summary.overdue).toBe(0);
  });

  it('does not let an invoice row with windowClosed become payable through the status fallback', async () => {
    stubFetch(true, 200, {
      data: {
        history: [],
        outstanding: [
          { id: 'inv-ff', title: 'FF', amount: 10, currency: 'USD', status: 'unpaid', type: 'registration_fee', dueDate: past, windowClosed: true },
        ],
        availableMethods: [],
        stats: { currency: 'USD' },
      },
    });

    const body = await (await getPayments(new Request('http://localhost/api/portal/payments'))).json();

    expect(body.data.items[0]).toMatchObject({ id: 'inv-ff', canPay: false, windowClosed: true });
    expect(body.data.summary.totalRequired).toBe('USD 0.00');
  });

  it('leaves an open registration fee payable and required', async () => {
    stubFetch(true, 200, {
      data: {
        history: [],
        outstanding: [],
        availableMethods: [
          { id: 'tier-sf', title: 'SF', amount: 15, currency: 'USD', type: 'registration_fee', startDate: longPast, sequenceOrder: 1001 },
        ],
        stats: { currency: 'USD' },
      },
    });

    const body = await (await getPayments(new Request('http://localhost/api/portal/payments'))).json();

    expect(body.data.items[0]).toMatchObject({ canPay: true, windowClosed: false });
    expect(body.data.summary.totalRequired).toBe('USD 15.00');
  });
});

describe('payment-start BFF routes forward the API outcome code', () => {
  beforeEach(() => vi.unstubAllGlobals());

  const failure = {
    statusCode: 400,
    message: 'Fully Funded registration has closed, so this registration fee can no longer be paid.',
    errorCode: 'REGISTRATION_WINDOW_CLOSED',
  };

  it('ensure-invoice', async () => {
    stubFetch(false, 400, failure);
    const res = await ensureInvoice(new Request('http://localhost/x', { method: 'POST', body: '{}' }), {
      params: Promise.resolve({ tierId: 'tier-ff' }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).errorCode).toBe('REGISTRATION_WINDOW_CLOSED');
  });

  it('confirm', async () => {
    stubFetch(false, 400, failure);
    const res = await confirmPayment(new Request('http://localhost/x', { method: 'POST', body: '{}' }), {
      params: Promise.resolve({ id: 'inv-ff' }),
    });
    expect((await res.json()).errorCode).toBe('REGISTRATION_WINDOW_CLOSED');
  });
});

describe('paymentOutcome', () => {
  it('maps known codes to actionable copy, independent of the API wording', () => {
    expect(getPaymentErrorMessage({ message: 'anything', errorCode: 'REGISTRATION_WINDOW_CLOSED' }, 'x')).toMatch(
      /registration for your category has closed/i,
    );
    expect(getPaymentErrorMessage({ errorCode: 'REGISTRATION_WINDOW_NOT_OPEN' }, 'x')).toMatch(/not opened yet/);
    expect(getPaymentErrorMessage({ errorCode: 'REGISTRATION_FEE_CATEGORY_MISMATCH' }, 'x')).toMatch(/different category/);
  });

  it('keeps the API message (or fallback) for unknown codes', () => {
    expect(getPaymentErrorMessage({ message: 'Invoice is already paid', errorCode: 'OTHER' }, 'x')).toBe('Invoice is already paid');
    expect(getPaymentErrorMessage(null, 'Payment submission failed')).toBe('Payment submission failed');
  });

  it('resolvePaymentRowAction: closed window replaces Pay, even over a stale canPay', () => {
    expect(resolvePaymentRowAction({ status: 'unpaid', canPay: true, windowClosed: true })).toBe('window-closed');
    expect(resolvePaymentRowAction({ status: 'failed', windowClosed: true })).toBe('window-closed');
    expect(resolvePaymentRowAction({ status: 'processing', windowClosed: true })).toBe('none');
    expect(resolvePaymentRowAction({ status: 'unpaid', canPay: true })).toBe('pay');
    expect(resolvePaymentRowAction({ status: 'unpaid', canPay: false })).toBe('none');
    expect(resolvePaymentRowAction({ status: 'unpaid' })).toBe('pay');
    expect(resolvePaymentRowAction({ status: 'paid' })).toBe('none');
  });
});
