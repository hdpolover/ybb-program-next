'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CheckCircle2,
  Clock4,
  Wallet2,
  ArrowLeftRight,
  CreditCard,
  Search,
  Printer,
  Eye,
} from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { Button } from '@/components/ui';
import DashboardPageSkeleton from '@/components/dashboard/ui/DashboardPageSkeleton';
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
  resolveActiveProgramId,
} from '@/lib/dashboard/activeProgram';
import { useDashboardData } from '@/components/dashboard/DashboardDataContext';
import { getEnvelopeData, getMessage, isRecord } from '@/lib/api/response';
import { isFetchTimeoutError, withTimeoutSignal } from '@/lib/api/fetchWithTimeout';
import {
  flushSwitchCategoryFeedback,
  queueSwitchCategoryFeedback,
} from '@/lib/dashboard/switchCategoryFeedback';
import {
  storeCachedPaymentPreviews,
  upsertCachedPaymentPreview,
  type CachedPaymentPreview,
} from '@/lib/dashboard/payments-cache';
import { toast } from 'sonner';
import { getCalendarDayDifference, getInclusiveCalendarDaySpan, parseApiDate } from '@/lib/utils';
import { formatDeadlineLocal } from '@/lib/format/deadline';

const paymentsTheme = componentsTheme.dashboardPayments;

// Browser-hop timeout for the payments fetch. Kept longer than the server
// proxy's own timeout (see app/api/portal/payments/route.ts) so the proxy
// times out first and returns a real error response, rather than this
// aborting blind while the proxy is still mid-request.
const PAYMENTS_FETCH_TIMEOUT_MS = 15_000;

interface PaymentItem {
  id: string;
  label: string;
  status: 'paid' | 'unpaid' | 'processing' | 'failed';
  paymentType: string;
  period: string;
  deadline: string;
  amount: string;
  syncDate: string;
  hasInvoice?: boolean;
  canPay?: boolean;
  startDate?: string;
  dueDate?: string;
  paidAt?: string;
}

function toCachedPaymentPreview(payment: PaymentItem): CachedPaymentPreview {
  return {
    id: payment.id,
    label: payment.label,
    status: payment.status,
    paymentType: payment.paymentType,
    amountLabel: payment.amount,
    syncDate: payment.syncDate,
    hasInvoice: payment.hasInvoice,
  };
}

interface PaymentsSummary {
  complete: number;
  pending: number;
  overdue: number;
  totalRequired: string;
}

function formatMoney(amount: number, currencyCode: string): string {
  const normalizedCurrency = String(currencyCode || 'USD').toUpperCase();
  const fractionDigits = normalizedCurrency === 'IDR' ? 0 : 2;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: normalizedCurrency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toFixed(fractionDigits)}`;
  }
}

function toPaymentStatus(value: unknown): PaymentItem['status'] {
  if (value === 'paid' || value === 'unpaid' || value === 'processing' || value === 'failed') {
    return value;
  }
  return 'unpaid';
}

function toDate(value: unknown): Date | null {
  if (typeof value !== 'string' || value.trim().length === 0) return null;
  const parsed = parseApiDate(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatLocalDate(value: Date): string {
  return formatDeadlineLocal(value, { withTime: false });
}

function formatLocalDateTime(value: Date): string {
  return formatDeadlineLocal(value, { withTime: true });
}

function formatDaysLeft(dueDate: Date): string {
  const days = getInclusiveCalendarDaySpan(new Date(), dueDate);
  if (!days || days <= 0) return 'Expired';
  return `${days} day${days === 1 ? '' : 's'} left`;
}

function formatDaysOverdue(dueDate: Date): string {
  const dayDiff = getCalendarDayDifference(dueDate, new Date());
  const days = dayDiff && dayDiff > 0 ? dayDiff : 1;
  return `${days} day${days === 1 ? '' : 's'} overdue`;
}

function toWindowLabel(startDate: Date | null, dueDate: Date | null): string {
  if (startDate && dueDate) {
    return `${formatLocalDate(startDate)} - ${formatLocalDate(dueDate)}`;
  }
  if (startDate) return `Starts ${formatLocalDate(startDate)}`;
  if (dueDate) return `Until ${formatLocalDate(dueDate)}`;
  return '—';
}

function toDeadlineLabel(
  dueDate: Date | null,
  status: PaymentItem['status'],
  paidAt: Date | null,
): string {
  if (status === 'paid') {
    return paidAt ? `Paid ${formatLocalDateTime(paidAt)}` : 'Completed';
  }

  if (status === 'processing') {
    return 'Awaiting verification';
  }

  if (!dueDate) return 'No deadline';

  const dayDiff = getCalendarDayDifference(new Date(), dueDate);
  if (dayDiff !== null && dayDiff < 0) {
    return `${formatLocalDate(dueDate)} • ${formatDaysOverdue(dueDate)}`;
  }
  return `${formatLocalDate(dueDate)} • ${formatDaysLeft(dueDate)}`;
}

function toPaymentItem(value: unknown): PaymentItem | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' ? value.id : null;
  if (!id) return null;

  const status = toPaymentStatus(value.status);
  const startDate = toDate(value.startDate);
  const dueDate = toDate(value.dueDate);
  const paidAt = toDate(value.paidAt) ?? toDate(value.syncDate);

  return {
    id,
    label: typeof value.label === 'string' ? value.label : 'Payment',
    status,
    paymentType: typeof value.paymentType === 'string' ? value.paymentType : 'General',
    period: toWindowLabel(startDate, dueDate),
    deadline: toDeadlineLabel(dueDate, status, paidAt),
    amount:
      typeof value.amount === 'string'
        ? value.amount
        : typeof value.amount === 'number' && Number.isFinite(value.amount)
          ? String(value.amount)
          : '-',
    syncDate: paidAt ? formatLocalDate(paidAt) : 'Not paid yet',
    hasInvoice: typeof value.hasInvoice === 'boolean' ? value.hasInvoice : undefined,
    canPay: typeof value.canPay === 'boolean' ? value.canPay : undefined,
    startDate: startDate?.toISOString(),
    dueDate: dueDate?.toISOString(),
    paidAt: paidAt?.toISOString(),
  };
}

function isPaymentPayable(payment: PaymentItem): boolean {
  if (typeof payment.canPay === 'boolean') return payment.canPay;
  return payment.status === 'unpaid' || payment.status === 'failed';
}

function toPaymentsSummary(value: unknown): PaymentsSummary {
  const fallback: PaymentsSummary = {
    complete: 0,
    pending: 0,
    overdue: 0,
    totalRequired: '$0',
  };

  if (!isRecord(value)) return fallback;

  return {
    totalRequired:
      typeof value.totalRequired === 'string'
        ? value.totalRequired
        : isRecord(value.totalRequired)
          ? formatMoney(
              typeof value.totalRequired.amount === 'number' &&
                Number.isFinite(value.totalRequired.amount)
                ? value.totalRequired.amount
                : 0,
              typeof value.totalRequired.currency === 'string'
                ? value.totalRequired.currency
                : 'USD'
            )
          : '$0',
    complete:
      typeof value.complete === 'number' && Number.isFinite(value.complete) ? value.complete : 0,
    pending:
      typeof value.pending === 'number' && Number.isFinite(value.pending) ? value.pending : 0,
    overdue:
      typeof value.overdue === 'number' && Number.isFinite(value.overdue) ? value.overdue : 0,
  };
}

function summarizeByLocalTime(items: PaymentItem[], totalRequired: string): PaymentsSummary {
  const now = new Date();
  const complete = items.filter((item) => item.status === 'paid').length;
  const pending = items.filter((item) => item.status !== 'paid').length;
  const overdue = items.filter((item) => {
    if (item.status !== 'unpaid') return false;
    if (!item.dueDate) return false;
    const dueDate = parseApiDate(item.dueDate);
    if (Number.isNaN(dueDate.getTime())) return false;
    const dayDiff = getCalendarDayDifference(now, dueDate);
    return dayDiff !== null && dayDiff < 0;
  }).length;

  return {
    complete,
    pending,
    overdue,
    totalRequired,
  };
}

export default function PaymentsListSection() {
  const { dashboardSummary, me } = useDashboardData();
  const router = useRouter();
  const activeApplication = dashboardSummary?.activeApplication ?? null;
  const canSwitchCategory = activeApplication?.canSwitchCategory ?? false;
  const switchCategoryMessage = activeApplication?.switchCategoryMessage?.trim() || '';
  const switchCategoryBlockingInvoiceId =
    activeApplication?.switchCategoryBlockingInvoiceId?.trim() || '';
  const currentCategory = activeApplication?.category;
  const switchTarget = currentCategory === 'self_funded' ? 'fully_funded' : 'self_funded';
  const switchTargetLabel = switchTarget === 'fully_funded' ? 'Fully Funded' : 'Self Funded';
  const currentCategoryLabel = currentCategory === 'fully_funded' ? 'Fully Funded' : 'Self Funded';
  const showCategoryCard = currentCategory === 'self_funded' || currentCategory === 'fully_funded';

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [summary, setSummary] = useState<PaymentsSummary>({
    complete: 0,
    pending: 0,
    overdue: 0,
    totalRequired: '$0',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumped by the retry button to re-run the fetch effect below (e.g. after
  // a timeout) without duplicating its fetch logic.
  const [retryCount, setRetryCount] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);
  const [rowActionLoadingId, setRowActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    flushSwitchCategoryFeedback();
  }, []);

  const resolveInvoiceId = async (payment: PaymentItem): Promise<string> => {
    if (payment.hasInvoice !== false) {
      return payment.id;
    }

    const tierId = payment.id.startsWith('tier:') ? payment.id.slice(5) : '';
    if (!tierId) {
      throw new Error('Unable to resolve payment option ID.');
    }

    const programId = readActiveProgramId();
    const response = await fetch(`/api/portal/payments/tiers/${tierId}/ensure-invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ program_id: programId || undefined }),
    });

    const json = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
      throw new Error(getMessage(json) ?? 'Failed to prepare payment invoice');
    }

    const payload = getEnvelopeData(json);
    const invoiceId =
      isRecord(payload) && typeof payload.invoice_id === 'string' ? payload.invoice_id : null;
    if (!invoiceId) {
      throw new Error('Invoice was not returned by the server');
    }

    setPayments(prev =>
      prev.map(row =>
        row.id === payment.id
          ? {
              ...row,
              id: invoiceId,
              hasInvoice: true,
            }
          : row
      )
    );

    upsertCachedPaymentPreview(programId, {
      ...toCachedPaymentPreview(payment),
      id: invoiceId,
      hasInvoice: true,
    });

    return invoiceId;
  };

  const handlePaymentAction = async (
    payment: PaymentItem,
    target: 'detail' | 'make-payment' | 'print'
  ) => {
    if (target === 'make-payment' && !isPaymentPayable(payment)) {
      toast.info('This payment is already settled or not payable yet.');
      return;
    }

    if (target === 'print' && payment.hasInvoice === false) {
      toast.info('Invoice is not available yet for this payment.');
      return;
    }

    try {
      setActionError(null);
      setRowActionLoadingId(payment.id);
      const invoiceId = await resolveInvoiceId(payment);

      if (target === 'make-payment') {
        router.push(`/dashboard/payments/${invoiceId}/make-payment`);
        return;
      }

      if (target === 'print') {
        window.open(`/api/portal/payments/${invoiceId}/invoice`, '_blank', 'noopener,noreferrer');
        return;
      }

      router.push(`/dashboard/payments/${invoiceId}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to open payment action');
    } finally {
      setRowActionLoadingId(null);
    }
  };

  async function handleSwitch() {
    if (!activeApplication?.id) {
      const message = 'Application ID not found. Please refresh the page and try again.';
      setSwitchError(message);
      toast.error(message);
      return;
    }
    setSwitchLoading(true);
    setSwitchError(null);
    try {
      const res = await fetch('/api/portal/switch-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: activeApplication.id, targetCategory: switchTarget }),
      });
      const json = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) {
        const message = getMessage(json) ?? 'Failed to switch category. Please try again.';
        const normalized = message.toLowerCase();
        if (normalized.includes('already in the target category')) {
          queueSwitchCategoryFeedback('info', 'Category already switched. Dashboard has been synced.');
          setShowSwitchModal(false);
          window.location.reload();
          return;
        }
        setSwitchError(message);
        toast.error(message);
        return;
      }
      queueSwitchCategoryFeedback('success', `Switched to ${switchTargetLabel}.`);
      setShowSwitchModal(false);
      window.location.reload();
    } catch {
      const fallback = 'Something went wrong. Please try again.';
      setSwitchError(fallback);
      toast.error(fallback);
    } finally {
      setSwitchLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    // Owns unmount-cancellation; withTimeoutSignal chains its own timeout
    // abort onto this so either unmount or the 15s timeout stops the fetch.
    const unmountController = new AbortController();

    const fetchPayments = async () => {
      const { signal, cleanup } = withTimeoutSignal(PAYMENTS_FETCH_TIMEOUT_MS, unmountController.signal);

      try {
        setLoading(true);
        setError(null);

        // Derive the program id the same deterministic way ProgramSelector
        // does, rather than trusting the raw localStorage snapshot: on first
        // mount ProgramSelector may not have resolved/corrected it yet, and
        // this sidesteps that race instead of depending on its timing.
        const storedProgramId = readActiveProgramId();
        const programId = resolveActiveProgramId(me?.registeredPrograms ?? [], storedProgramId);
        const url = appendProgramId('/api/portal/payments', programId);

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
          signal,
        });

        const json = (await response.json().catch(() => null)) as unknown;
        if (!response.ok) {
          throw new Error(getMessage(json) ?? 'Failed to load payments');
        }

        if (!cancelled) {
          const payload = getEnvelopeData(json);
          const payloadRecord = isRecord(payload) ? payload : null;
          const items = Array.isArray(payloadRecord?.items)
            ? payloadRecord.items
                .map(toPaymentItem)
                .filter((item): item is PaymentItem => item !== null)
            : [];
          const serverSummary = toPaymentsSummary(payloadRecord?.summary);

          setActionError(null);
          setPayments(items);
          setSummary(summarizeByLocalTime(items, serverSummary.totalRequired));
          storeCachedPaymentPreviews(programId, items.map(toCachedPaymentPreview));
        }
      } catch (err) {
        if (!cancelled) {
          if (isFetchTimeoutError(err)) {
            setError('Loading payments is taking longer than expected. Please try again.');
          } else {
            setError(err instanceof Error ? err.message : 'Failed to load payments');
          }
        }
      } finally {
        cleanup();
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPayments();

    const handleProgramChange = () => {
      fetchPayments();
    };

    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, handleProgramChange as EventListener);

    return () => {
      cancelled = true;
      unmountController.abort();
      window.removeEventListener(
        ACTIVE_PROGRAM_CHANGED_EVENT,
        handleProgramChange as EventListener
      );
    };
  }, [me?.registeredPrograms, retryCount]);

  if (loading) {
    return (
      <DashboardPageSkeleton variant="payments-list" className={paymentsTheme.sectionWrapper} />
    );
  }

  if (error) {
    return (
      <section className={paymentsTheme.sectionWrapper}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <Button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            size="sm"
            className="mt-4 min-w-[120px]"
          >
            Try again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={paymentsTheme.sectionWrapper}>
      {/* Payments summary (mirroring dashboard overview) */}
      <div className={paymentsTheme.summaryGrid}>
        <div className={`${paymentsTheme.summaryCardBase} ${paymentsTheme.summaryCompleteCard}`}>
          <div className={paymentsTheme.summaryCardInner}>
            <div>
              <p
                className={`${paymentsTheme.summaryEyebrow} ${paymentsTheme.summaryCompleteEyebrow}`}
              >
                Complete Payments
              </p>
              <p className={`${paymentsTheme.summaryValue} ${paymentsTheme.summaryCompleteValue}`}>
                {summary.complete}
              </p>
            </div>
            <div
              className={`${paymentsTheme.summaryIconCircle} ${paymentsTheme.summaryCompleteIconCircle}`}
            >
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className={`${paymentsTheme.summaryCardBase} ${paymentsTheme.summaryPendingCard}`}>
          <div className={paymentsTheme.summaryCardInner}>
            <div>
              <p
                className={`${paymentsTheme.summaryEyebrow} ${paymentsTheme.summaryPendingEyebrow}`}
              >
                Pending Payments
              </p>
              <p className={`${paymentsTheme.summaryValue} ${paymentsTheme.summaryPendingValue}`}>
                {summary.pending}
              </p>
            </div>
            <div
              className={`${paymentsTheme.summaryIconCircle} ${paymentsTheme.summaryPendingIconCircle}`}
            >
              <Clock4 className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className={`${paymentsTheme.summaryCardBase} ${paymentsTheme.summaryOverdueCard}`}>
          <div className={paymentsTheme.summaryCardInner}>
            <div>
              <p
                className={`${paymentsTheme.summaryEyebrow} ${paymentsTheme.summaryOverdueEyebrow}`}
              >
                Overdue Payments
              </p>
              <p className={`${paymentsTheme.summaryValue} ${paymentsTheme.summaryOverdueValue}`}>
                {summary.overdue}
              </p>
            </div>
            <div
              className={`${paymentsTheme.summaryIconCircle} ${paymentsTheme.summaryOverdueIconCircle}`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className={`${paymentsTheme.summaryCardBase} ${paymentsTheme.summaryTotalCard}`}>
          <div className={paymentsTheme.summaryCardInner}>
            <div>
              <p className={`${paymentsTheme.summaryEyebrow} ${paymentsTheme.summaryTotalEyebrow}`}>
                Total Required
              </p>
              <p className={`${paymentsTheme.summaryValue} ${paymentsTheme.summaryTotalValue}`}>
                {summary.totalRequired}
              </p>
            </div>
            <div
              className={`${paymentsTheme.summaryIconCircle} ${paymentsTheme.summaryTotalIconCircle}`}
            >
              <Wallet2 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {showCategoryCard && (
        <div className={paymentsTheme.categoryCard}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className={paymentsTheme.categoryTitle}>
                Registration Category
              </p>
              <p className="mt-0.5 text-[13px] font-semibold text-slate-900 sm:text-sm">
                {currentCategoryLabel}
                <span className="mx-2 text-slate-300">|</span>
                <span className={canSwitchCategory ? 'text-primary' : 'text-slate-500'}>
                  {canSwitchCategory
                    ? `Eligible to switch to ${switchTargetLabel}`
                    : 'Category switching unavailable'}
                </span>
              </p>
              <p className={paymentsTheme.categoryDescription}>
                Payment options will follow your selected category and payment stage.
              </p>
              {!canSwitchCategory && switchCategoryMessage ? (
                <p className="mt-1 text-xs font-medium text-amber-700">
                  {switchCategoryMessage}
                  {switchCategoryBlockingInvoiceId ? (
                    <>
                      {' '}
                      <Link
                        href={`/dashboard/payments/${switchCategoryBlockingInvoiceId}`}
                        className="underline decoration-amber-700/60 underline-offset-2 hover:decoration-amber-700 cursor-pointer"
                      >
                        View pending payment &rarr;
                      </Link>
                    </>
                  ) : null}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className={`${paymentsTheme.categoryPrimaryCta} disabled:cursor-not-allowed disabled:opacity-50`}
              onClick={() => {
                if (!canSwitchCategory) return;
                setShowSwitchModal(true);
              }}
              disabled={!canSwitchCategory}
              aria-disabled={!canSwitchCategory}
              title={!canSwitchCategory && switchCategoryMessage ? switchCategoryMessage : undefined}
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Switch to {switchTargetLabel}</span>
            </button>
          </div>
        </div>
      )}

      {showSwitchModal && canSwitchCategory &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Switch to {switchTargetLabel}?
                </h2>
              </div>

              <p className="mb-4 text-sm text-slate-600">
                You are about to switch your registration category from{' '}
                <span className="font-medium">{currentCategoryLabel}</span> to{' '}
                <span className="font-medium">{switchTargetLabel}</span>. This will change your
                payment requirements and program participation terms.
              </p>

              {switchTarget === 'self_funded' && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <p className="font-medium">Important: Switching to Self Funded</p>
                  <p className="mt-1">
                    You will be required to pay program fees in scheduled batches to confirm your
                    participation. Any previous fully funded payments may be subject to program
                    terms.
                  </p>
                </div>
              )}
              {switchTarget === 'fully_funded' && (
                <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  <p className="font-medium">Important: Switching to Fully Funded</p>
                  <p className="mt-1">
                    You will be eligible for program funding after completing evaluation. If
                    selected, your payments will be reimbursed.
                  </p>
                </div>
              )}

              {switchError && (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                  {switchError}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  onClick={() => {
                    setShowSwitchModal(false);
                    setSwitchError(null);
                  }}
                  disabled={switchLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="hover:bg-primary/90 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  onClick={handleSwitch}
                  disabled={switchLoading}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  {switchLoading ? 'Switching…' : `Confirm Switch to ${switchTargetLabel}`}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <div className={paymentsTheme.tableCard}>
        {actionError && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {actionError}
          </div>
        )}

        <div className={paymentsTheme.tableHeaderRow}>
          <div>
            <h2 className={paymentsTheme.tableTitle}>Payment Details</h2>
            <p className={paymentsTheme.tableSubtitle}>
              Overview of your registration payments, status, and synchronization time.
            </p>
          </div>

          <div className={paymentsTheme.tableControlsWrapper}>
            <div className={`${paymentsTheme.tableShowWrapper} hidden sm:flex`}>
              <span>Show</span>
              <select className={paymentsTheme.tableShowSelect}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
              </select>
              <span>entries</span>
            </div>

            <div className={paymentsTheme.tableSearchWrapper}>
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search payments..."
                className={paymentsTheme.tableSearchInput}
              />
            </div>
          </div>
        </div>

        <div className={paymentsTheme.tableOuter}>
          <div className="space-y-2 md:hidden">
            {payments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl bg-slate-50 px-5 py-8 text-center">
                <Image
                  src="/img/tablenotfounds.png"
                  alt="No payments"
                  width={160}
                  height={112}
                  className="mb-3 h-auto max-h-28 w-auto"
                />
                <p className="text-sm font-extrabold text-slate-900">No payments yet</p>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Your payment records will appear here once payments are assigned to your account.
                </p>
              </div>
            ) : (
              payments.map(payment => {
                const isPaid = payment.status === 'paid';
                const isProcessing = payment.status === 'processing';
                const isFailed = payment.status === 'failed';
                const isRowLoading = rowActionLoadingId === payment.id;
                const canPayNow = isPaymentPayable(payment);
                const canPrintInvoice = payment.hasInvoice !== false;
                return (
                  <article key={`mobile-${payment.id}`} className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{payment.label}</p>
                      <span
                        className={`${paymentsTheme.statusBadgeBase} ${
                          isPaid
                            ? paymentsTheme.statusBadgePaid
                            : isProcessing
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                              : isFailed
                                ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                                : paymentsTheme.statusBadgeUnpaid
                        }`}
                      >
                        {isPaid ? 'Paid' : isProcessing ? 'Processing' : isFailed ? 'Failed' : 'Unpaid'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                      <p className="text-slate-500">Type</p>
                      <p className="text-right text-slate-700">{payment.paymentType || 'General'}</p>
                      <p className="text-slate-500">Window</p>
                      <p className="text-right text-slate-700">{payment.period}</p>
                      <p className="text-slate-500">Deadline</p>
                      <p className="text-right font-medium text-slate-700">{payment.deadline}</p>
                      <p className="text-slate-500">Amount</p>
                      <p className="text-right font-semibold text-slate-900">{payment.amount}</p>
                      <p className="text-slate-500">Synced</p>
                      <p className="text-right text-slate-700">{payment.syncDate}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {canPayNow ? (
                        <button
                          type="button"
                          className={`${paymentsTheme.primaryIconButton} ${isRowLoading ? 'cursor-wait opacity-70' : ''}`}
                          aria-label="Pay now"
                          disabled={isRowLoading}
                          onClick={() => handlePaymentAction(payment, 'make-payment')}
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className={`${paymentsTheme.secondaryIconButton} ${isRowLoading ? 'cursor-wait opacity-70' : ''}`}
                        aria-label="See details"
                        disabled={isRowLoading}
                        onClick={() => handlePaymentAction(payment, 'detail')}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {canPrintInvoice ? (
                        <button
                          type="button"
                          className={`${paymentsTheme.tertiaryIconButton} ${isRowLoading ? 'cursor-wait opacity-70' : ''}`}
                          aria-label="Print invoice"
                          disabled={isRowLoading}
                          onClick={() => handlePaymentAction(payment, 'print')}
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <table className={`${paymentsTheme.table} hidden md:table`}>
            <thead>
              <tr className={paymentsTheme.tableHeadRow}>
                <th className={paymentsTheme.tableHeadCell}>Payment Information</th>
                <th className={paymentsTheme.tableHeadCell}>Payment Type</th>
                <th className={paymentsTheme.tableHeadCell}>Payment Status</th>
                <th className={paymentsTheme.tableHeadCell}>Payment Window</th>
                <th className={paymentsTheme.tableHeadCell}>Deadline</th>
                <th className={paymentsTheme.tableHeadCell}>Amount</th>
                <th className={paymentsTheme.tableHeadCell}>Sync Date</th>
                <th className={paymentsTheme.tableHeadCellRight}>Actions</th>
              </tr>
            </thead>
            <tbody className={paymentsTheme.tableBody}>
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                    <div className="flex flex-col items-center justify-center bg-slate-50 px-6 py-10 text-center">
                      <Image
                        src="/img/tablenotfounds.png"
                        alt="No payments"
                        width={160}
                        height={144}
                        className="mb-4 h-auto max-h-36 w-auto"
                      />
                      <p className="text-base font-extrabold text-slate-900">No payments yet</p>
                      <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Your payment records will appear here once payments are assigned to your
                        account.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {payments.map(payment => {
                const isPaid = payment.status === 'paid';
                const isProcessing = payment.status === 'processing';
                const isFailed = payment.status === 'failed';
                const isRowLoading = rowActionLoadingId === payment.id;
                const canPayNow = isPaymentPayable(payment);
                const canPrintInvoice = payment.hasInvoice !== false;
                return (
                  <tr key={payment.id} className={paymentsTheme.tableRow}>
                    <td className={paymentsTheme.paymentInfoCell}>{payment.label}</td>
                    <td className={paymentsTheme.periodCell}>{payment.paymentType || 'General'}</td>
                    <td className={paymentsTheme.statusCell}>
                      <span
                        className={`${paymentsTheme.statusBadgeBase} ${
                          isPaid
                            ? paymentsTheme.statusBadgePaid
                            : isProcessing
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                              : isFailed
                                ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                                : paymentsTheme.statusBadgeUnpaid
                        }`}
                      >
                        {isPaid
                          ? 'Paid'
                          : isProcessing
                            ? 'Processing'
                            : isFailed
                              ? 'Failed'
                              : 'Unpaid'}
                      </span>
                    </td>
                    <td className={paymentsTheme.periodCell}>
                      <p className="text-sm font-medium text-slate-700">{payment.period}</p>
                    </td>
                    <td className={paymentsTheme.periodCell}>
                      <span
                        className={`text-sm font-semibold ${
                          isPaid
                            ? 'text-emerald-700'
                            : isFailed
                              ? 'text-red-700'
                              : isProcessing
                                ? 'text-amber-700'
                                : 'text-slate-700'
                        }`}
                      >
                        {payment.deadline}
                      </span>
                    </td>
                    <td className={paymentsTheme.amountCell}>{payment.amount}</td>
                    <td className={paymentsTheme.syncDateCell}>{payment.syncDate}</td>
                    <td className={paymentsTheme.actionsCell}>
                      <div className={paymentsTheme.actionsWrapper}>
                        {canPayNow ? (
                          <button
                            type="button"
                            className={`${paymentsTheme.primaryIconButton} ${isRowLoading ? 'cursor-wait opacity-70' : ''}`}
                            aria-label="Pay now"
                            disabled={isRowLoading}
                            onClick={() => handlePaymentAction(payment, 'make-payment')}
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                        <button
                          type="button"
                          className={`${paymentsTheme.secondaryIconButton} ${isRowLoading ? 'cursor-wait opacity-70' : ''}`}
                          aria-label="See details"
                          disabled={isRowLoading}
                          onClick={() => handlePaymentAction(payment, 'detail')}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {canPrintInvoice ? (
                          <button
                            type="button"
                            className={`${paymentsTheme.tertiaryIconButton} ${isRowLoading ? 'cursor-wait opacity-70' : ''}`}
                            aria-label="Print invoice"
                            disabled={isRowLoading}
                            onClick={() => handlePaymentAction(payment, 'print')}
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className={paymentsTheme.tableFooterText}>
          Showing {payments.length} of {payments.length} entries
        </p>
      </div>
    </section>
  );
}
