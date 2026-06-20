'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Tag,
  Info,
  CalendarClock,
  CreditCard,
  Download,
  AlertTriangle,
  Clock,
  FileText,
  User,
  Wallet,
} from 'lucide-react';
import { type HistoryItem } from '@/components/dashboard/payments/HistoryList';
import HistoryPanel from '@/components/dashboard/payments/HistoryPanel';
import PaymentPageSkeleton from '@/components/dashboard/payments/PaymentPageSkeleton';
import { componentsTheme } from '@/lib/theme/components';
import { getEnvelopeData, getErrorMessage, isRecord } from '@/lib/api/response';
import { readActiveProgramId } from '@/lib/dashboard/activeProgram';
import {
  readCachedPaymentPreview,
  upsertCachedPaymentPreview,
  type CachedPaymentPreview,
} from '@/lib/dashboard/payments-cache';
import { parseApiDate } from '@/lib/utils';

const paymentsTheme = componentsTheme.dashboardPayments;

interface PaymentDetailSectionProps {
  paymentId: string;
}

interface PendingSubmissionData {
  accountName?: string;
  sourceName?: string;
  paymentDate?: string;
  proofUrl?: string;
  paymentMethod?: string;
  actionUrl?: string;
  submittedAt?: string;
}

interface InvoiceData {
  id: string;
  label: string;
  category: string;
  amount: number;
  dueDate?: string;
  status: 'paid' | 'unpaid' | 'processing' | 'failed';
  currency?: string;
  transactionId?: string;
  intentId?: string;
  // Dual-price snapshots taken at intent creation. Used to override the
  // canonical display when a legacy manual invoice still carries USD as its
  // amount/currency — the participant actually wired the IDR snapshot.
  usdPrice?: number;
  idrPrice?: number;
  paymentMethod?: string;
  pendingSubmission?: PendingSubmissionData;
}

interface HistoryEntry {
  id: string;
  method: string;
  amount: number;
  date: string;
  time: string;
  status: 'cancelled' | 'failed' | 'processing' | 'paid';
  note: string;
  code?: string;
  invoiceId?: string;
  transactionId?: string;
  paymentMethod?: string;
  dateTime?: string;
  accountName?: string;
  sourceName?: string;
  paymentDate?: string;
  amountLabel?: string;
  actionUrl?: string;
  proofUrl?: string;
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200/70 ${className ?? ''}`}
      aria-hidden="true"
    />
  );
}

function HistorySectionSkeleton() {
  return (
    <div className={paymentsTheme.detailPrimaryCard}>
      <SkeletonBlock className="h-5 w-40" />
      <div className="mt-4 space-y-3">
        <SkeletonBlock className="h-24 w-full" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
    </div>
  );
}

function toTitleCaseFromToken(value: string | null | undefined): string {
  if (!value) return '-';

  const acronymTokens = new Set([
    'va',
    'qris',
    'bca',
    'bni',
    'bri',
    'cimb',
    'btn',
    'bsi',
    'ovo',
    'dana',
    'gopay',
    'jcb',
    'idr',
    'usd',
  ]);

  return value
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => {
      const lower = word.toLowerCase();
      if (acronymTokens.has(lower)) {
        return lower.toUpperCase();
      }
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

function isUnknownMethod(value: string | null | undefined): boolean {
  const normalized = String(value ?? '').trim().toLowerCase();
  return !normalized || normalized === 'unknown' || normalized === 'n/a' || normalized === '-';
}

interface PaymentMethodMeta {
  code: string;
  displayName: string;
  icon: string | null;
  // 'manual' = bank transfer with proof upload, 'automatic' = gateway-routed.
  // Used to decide whether to render a legacy USD invoice in its IDR snapshot.
  type: 'manual' | 'automatic' | null;
}

function toPaymentMethodMeta(value: unknown): PaymentMethodMeta | null {
  if (!isRecord(value)) return null;
  const code = typeof value.code === 'string' && value.code.trim().length > 0 ? value.code.trim() : null;
  if (!code) return null;
  const displayName =
    typeof value.display_name === 'string' && value.display_name.trim().length > 0
      ? value.display_name.trim()
      : code;
  const icon =
    typeof value.icon === 'string' && value.icon.trim().length > 0 ? value.icon.trim() : null;
  const rawType = typeof value.type === 'string' ? value.type.trim().toLowerCase() : '';
  const type: PaymentMethodMeta['type'] =
    rawType === 'manual' ? 'manual' : rawType === 'automatic' ? 'automatic' : null;
  return { code, displayName, icon, type };
}

function normalizePaymentMethodPayload(payload: unknown): PaymentMethodMeta[] {
  const source = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.data)
      ? payload.data
      : isRecord(payload) && Array.isArray(payload.methods)
        ? payload.methods
        : [];
  return source
    .map(toPaymentMethodMeta)
    .filter((m): m is PaymentMethodMeta => m !== null);
}

function buildMethodCatalog(methods: PaymentMethodMeta[]): Map<string, PaymentMethodMeta> {
  return new Map(methods.map(m => [m.code.toLowerCase(), m]));
}

// Resolve a raw method token (typically a code like "mandiri_gm84xd") into the
// admin-curated display name + icon, falling back to a title-cased token when
// the catalog has nothing for it. Centralized so pending submission and history
// share the same rendering rules.
function resolveMethodMeta(
  raw: string | null | undefined,
  catalog: Map<string, PaymentMethodMeta>,
): { label: string; icon: string | null } {
  if (isUnknownMethod(raw)) return { label: '', icon: null };
  const token = String(raw).trim();
  const match = catalog.get(token.toLowerCase());
  if (match) return { label: match.displayName, icon: match.icon };
  return { label: toTitleCaseFromToken(token), icon: null };
}

function normalizeInvoiceStatus(value: unknown): InvoiceData['status'] {
  const status = String(value ?? '').toLowerCase();
  if (status === 'paid') return 'paid';
  if (status === 'processing') return 'processing';
  if (status === 'failed') return 'failed';
  return 'unpaid';
}

function normalizeHistoryStatus(value: unknown): HistoryEntry['status'] {
  const status = String(value ?? '').toLowerCase();
  if (status === 'paid') return 'paid';
  if (status === 'processing') return 'processing';
  if (status === 'failed') return 'failed';
  if (status === 'cancelled') return 'cancelled';
  return 'processing';
}

function formatCurrencyValue(amount: number, currencyCode = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: currencyCode.toUpperCase() === 'IDR' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
}

function formatDateLabel(value?: string | null): string {
  if (!value) return 'No due date';
  const date = parseApiDate(value);
  if (Number.isNaN(date.getTime())) return 'No due date';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDateTimeLabel(value?: string | null): string {
  if (!value) return '-';
  const date = parseApiDate(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatTimeLabel(value?: string | null): string {
  if (!value) return '-';
  const date = parseApiDate(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function toPendingSubmissionData(value: unknown): PendingSubmissionData | undefined {
  if (!isRecord(value)) return undefined;

  const accountName = typeof value.accountName === 'string' && value.accountName.trim().length > 0
    ? value.accountName.trim()
    : undefined;
  const sourceName = typeof value.sourceName === 'string' && value.sourceName.trim().length > 0
    ? value.sourceName.trim()
    : undefined;
  const paymentDate = typeof value.paymentDate === 'string' && value.paymentDate.trim().length > 0
    ? value.paymentDate.trim()
    : undefined;
  const proofUrl = typeof value.proofUrl === 'string' && value.proofUrl.trim().length > 0
    ? value.proofUrl.trim()
    : undefined;
  const paymentMethod = typeof value.paymentMethod === 'string' && value.paymentMethod.trim().length > 0
    ? value.paymentMethod.trim()
    : undefined;
  const actionUrl = typeof value.actionUrl === 'string' && value.actionUrl.trim().length > 0
    ? value.actionUrl.trim()
    : undefined;
  const submittedAt = typeof value.submittedAt === 'string' && value.submittedAt.trim().length > 0
    ? value.submittedAt.trim()
    : undefined;

  // Suppress the panel entirely when no meaningful field is present.
  if (!accountName && !sourceName && !paymentDate && !proofUrl && !paymentMethod && !actionUrl) {
    return undefined;
  }

  return { accountName, sourceName, paymentDate, proofUrl, paymentMethod, actionUrl, submittedAt };
}

function toInvoiceData(value: unknown): InvoiceData | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' ? value.id : null;
  if (!id) return null;

  return {
    id,
    label: typeof value.label === 'string' ? value.label : 'Program Payment',
    category: typeof value.category === 'string' ? value.category : 'payment',
    amount: typeof value.amount === 'number' && Number.isFinite(value.amount) ? value.amount : 0,
    dueDate: typeof value.dueDate === 'string' ? value.dueDate : undefined,
    status: normalizeInvoiceStatus(value.status),
    currency: typeof value.currency === 'string' ? value.currency.toUpperCase() : 'USD',
    transactionId: typeof value.transactionId === 'string' ? value.transactionId : undefined,
    intentId: typeof value.intentId === 'string' ? value.intentId : undefined,
    usdPrice:
      typeof value.usdPrice === 'number' && Number.isFinite(value.usdPrice)
        ? value.usdPrice
        : undefined,
    idrPrice:
      typeof value.idrPrice === 'number' && Number.isFinite(value.idrPrice)
        ? value.idrPrice
        : undefined,
    paymentMethod:
      typeof value.paymentMethod === 'string' && value.paymentMethod.trim().length > 0
        ? value.paymentMethod.trim()
        : undefined,
    pendingSubmission: toPendingSubmissionData(value.pendingSubmission),
  };
}

function toHistoryEntry(value: unknown): HistoryEntry | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' ? value.id : null;
  if (!id) return null;

  return {
    id,
    method:
      typeof value.method === 'string'
        ? value.method
        : typeof value.paymentMethod === 'string'
          ? value.paymentMethod
          : 'Payment',
    amount: typeof value.amount === 'number' && Number.isFinite(value.amount) ? value.amount : 0,
    date: typeof value.date === 'string' ? value.date : '-',
    time: typeof value.time === 'string' ? value.time : '-',
    status: normalizeHistoryStatus(value.status),
    note: typeof value.note === 'string' ? value.note : '',
    code: typeof value.code === 'string' ? value.code : undefined,
    invoiceId: typeof value.invoiceId === 'string' ? value.invoiceId : undefined,
    transactionId: typeof value.transactionId === 'string' ? value.transactionId : undefined,
    paymentMethod: typeof value.paymentMethod === 'string' ? value.paymentMethod : undefined,
    dateTime: typeof value.dateTime === 'string' ? value.dateTime : undefined,
    accountName: typeof value.accountName === 'string' ? value.accountName : undefined,
    sourceName: typeof value.sourceName === 'string' ? value.sourceName : undefined,
    paymentDate: typeof value.paymentDate === 'string' ? value.paymentDate : undefined,
    amountLabel: typeof value.amountLabel === 'string' ? value.amountLabel : undefined,
    actionUrl: typeof value.actionUrl === 'string' ? value.actionUrl : undefined,
    proofUrl: typeof value.proofUrl === 'string' ? value.proofUrl : undefined,
  };
}

export default function PaymentDetailSection({ paymentId }: PaymentDetailSectionProps) {
  const router = useRouter();
  const [paymentPreview, setPaymentPreview] = useState<CachedPaymentPreview | null>(() =>
    readCachedPaymentPreview(readActiveProgramId(), paymentId)
  );
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodMeta[]>([]);
  const [loading, setLoading] = useState(paymentPreview === null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [cancellingPending, setCancellingPending] = useState(false);
  const [cancelPendingError, setCancelPendingError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const programId = readActiveProgramId();
    const cachedPreview = readCachedPaymentPreview(programId, paymentId);

    if (cachedPreview) {
      // Sync-setting preview from cache to populate the UI immediately before the
      // async fetch resolves — intentional to avoid a loading flash on revisit.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPaymentPreview(cachedPreview);
      setLoading(false);
    } else {
      setPaymentPreview(null);
    }

    (async () => {
      try {
        setLoading(!cachedPreview);
        setHistoryLoading(true);
        setError(null);
        setBackgroundError(null);

        const response = await fetch(`/api/portal/payments/${paymentId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        const json = (await response.json().catch(() => null)) as unknown;
        if (!response.ok) {
          throw new Error(getErrorMessage(json, 'Failed to load payment details'));
        }

        if (!cancelled) {
          const payload = getEnvelopeData(json);
          const payloadRecord = isRecord(payload) ? payload : null;
          const normalizedInvoice = toInvoiceData(payloadRecord?.invoice);

          setInvoice(normalizedInvoice);

          const normalizedHistory: HistoryEntry[] = Array.isArray(payloadRecord?.history)
            ? payloadRecord.history
                .map(toHistoryEntry)
                .filter((entry): entry is HistoryEntry => entry !== null)
            : [];

          setHistory(normalizedHistory);

          if (normalizedInvoice) {
            const preview: CachedPaymentPreview = {
              id: normalizedInvoice.id,
              label: normalizedInvoice.label,
              status: normalizedInvoice.status,
              paymentType: normalizedInvoice.category,
              amountLabel: formatCurrencyValue(
                normalizedInvoice.amount,
                normalizedInvoice.currency || 'USD'
              ),
              syncDate: normalizedInvoice.dueDate ?? '-',
              hasInvoice: true,
            };

            setPaymentPreview(preview);
            upsertCachedPaymentPreview(programId, preview);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to load payment details';
          if (cachedPreview) {
            setBackgroundError(message);
          } else {
            setError(message);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setHistoryLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  // Fetch the admin-managed payment method catalog so we can render proper
  // display names + icons instead of raw codes like "mandiri_gm84xd".
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/portal/payment-methods', { cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json().catch(() => null)) as unknown;
        const payload = getEnvelopeData(json);
        const methods = normalizePaymentMethodPayload(payload);
        if (!cancelled) setPaymentMethods(methods);
      } catch {
        // Catalog is enhancement-only; fall back to title-cased token on failure.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const methodCatalog = buildMethodCatalog(paymentMethods);

  if (loading) {
    return <PaymentPageSkeleton variant="payment-detail" />;
  }

  if (error) {
    return (
      <div className={paymentsTheme.sectionWrapper}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <Link href="/dashboard/payments" className="mt-4 text-sm text-primary underline">
            Back to Payments
          </Link>
        </div>
      </div>
    );
  }

  if (!invoice && !paymentPreview) {
    return (
      <div className={paymentsTheme.sectionWrapper}>
        <div className={paymentsTheme.detailEmptyStateCard}>
          <div className={paymentsTheme.detailEmptyStateIconWrapper}>
            <Info className="h-6 w-6" />
          </div>
          <p className={paymentsTheme.detailEmptyStateTitle}>Payment not found.</p>
          <p className={paymentsTheme.detailEmptyStateBody}>
            The payment you are looking for could not be found. Please go back to the payments page
            and try again.
          </p>
          <Link href="/dashboard/payments" className={paymentsTheme.detailEmptyStateButton}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Payments</span>
          </Link>
        </div>
      </div>
    );
  }

  const effectiveStatus = invoice?.status ?? paymentPreview?.status ?? 'unpaid';

  // Settlement override: when the participant chose a manual method and we
  // have an IDR snapshot from the tier, render in IDR — even on legacy rows
  // where the canonical amount/currency is still USD because the invoice was
  // settled before the dual-pricing handler shipped. New manual confirms
  // already write IDR to amount/currency, so this override is idempotent for
  // them and load-bearing for the historical rows.
  const invoiceMethodType = invoice?.paymentMethod
    ? methodCatalog.get(invoice.paymentMethod.toLowerCase())?.type ?? null
    : null;
  const useIdrSettlement =
    invoiceMethodType === 'manual'
    && typeof invoice?.idrPrice === 'number'
    && invoice.idrPrice > 0;
  const invoiceCurrency = useIdrSettlement ? 'IDR' : (invoice?.currency || 'USD').toUpperCase();
  const effectiveAmount = useIdrSettlement
    ? (invoice?.idrPrice ?? invoice?.amount ?? 0)
    : (invoice?.amount ?? 0);
  const formatInvoiceAmount = (value: number) => formatCurrencyValue(value, invoiceCurrency);
  const categoryLabel = toTitleCaseFromToken(invoice?.category ?? paymentPreview?.paymentType);
  const dueDateLabel = invoice ? formatDateLabel(invoice.dueDate) : 'Loading details...';
  const paymentName = invoice?.label?.trim() || paymentPreview?.label?.trim() || 'Program Payment';
  const invoiceStatusLabel = toTitleCaseFromToken(effectiveStatus);
  const paymentDescription = `Payment for ${paymentName} (${categoryLabel}). Current status: ${invoiceStatusLabel}.`;
  const dueDateValue = invoice?.dueDate ? parseApiDate(invoice.dueDate) : null;
  const overdue = Boolean(
    dueDateValue &&
      !Number.isNaN(dueDateValue.getTime()) &&
      dueDateValue < new Date() &&
      effectiveStatus !== 'paid'
  );
  const amountLabel = invoice
    ? formatInvoiceAmount(effectiveAmount)
    : paymentPreview?.amountLabel || 'Loading amount...';
  const primaryTransactionId = invoice?.transactionId ?? history.find(entry => entry.transactionId)?.transactionId;
  const handleDownloadInvoice = () => {
    const invoiceId = invoice?.id ?? paymentId;
    const content = [
      `Invoice ID: ${invoiceId}`,
      `Transaction ID: ${primaryTransactionId ?? '-'}`,
      `Payment Name: ${paymentName}`,
      `Category: ${categoryLabel}`,
      `Amount: ${amountLabel}`,
      `Status: ${invoiceStatusLabel}`,
      `Due Date: ${dueDateLabel}`,
      `Generated At: ${new Date().toLocaleString()}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoiceId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // When the IDR override is active, the backend's per-entry amountLabel
  // ("USD 15.00" on legacy rows) lies about the true settlement. Always
  // re-derive from the invoice's effective amount/currency so the row badge,
  // the row meta, and the modal all read the same number.
  const historyAmountLabel = (h: HistoryEntry): string =>
    useIdrSettlement ? formatInvoiceAmount(effectiveAmount) : (h.amountLabel ?? formatInvoiceAmount(h.amount));

  const items: HistoryItem[] = history.map(h => ({
    id: h.id,
    title:
      h.status === 'cancelled'
        ? 'Payment Cancelled'
        : h.status === 'paid'
          ? 'Payment Completed'
          : h.status === 'failed'
            ? 'Payment Rejected'
            : h.status === 'processing'
              ? 'Payment Update'
              : 'Payment Created',
    method: resolveMethodMeta(h.method, methodCatalog).label,
    amountLabel: historyAmountLabel(h),
    date: h.dateTime ? formatDateLabel(h.dateTime) : formatDateLabel(h.date),
    time: h.dateTime ? formatTimeLabel(h.dateTime) : h.time,
    badge:
      h.status === 'cancelled'
        ? { label: 'Cancelled', tone: 'red' as const }
        : h.status === 'failed'
          ? { label: 'Failed', tone: 'red' as const }
          : undefined,
    note: h.note?.trim() || 'No additional notes.',
    details: {
      invoiceId: h.invoiceId ?? invoice?.id ?? paymentId,
      transactionId: h.transactionId ?? h.code ?? `TR-${h.id}`,
      paymentMethod: resolveMethodMeta(h.paymentMethod ?? h.method, methodCatalog).label || 'Not specified',
      dateTime: h.paymentDate
        ? formatDateLabel(h.paymentDate)
        : h.dateTime
        ? formatDateTimeLabel(h.dateTime)
        : `${formatDateLabel(h.date)} ${h.time}`,
      accountName: h.accountName ?? '',
      amountLabel: historyAmountLabel(h),
      source: h.sourceName ?? 'Participant Dashboard',
      proofUrl: h.proofUrl,
    },
    status:
      h.status === 'processing'
        ? 'pending'
        : h.status === 'paid'
          ? 'completed'
          : h.status === 'cancelled'
            ? 'cancelled'
            : h.status === 'failed'
              ? 'rejected'
              : 'created',
  }));
  const hasPaymentActivity = effectiveStatus !== 'unpaid' || items.length > 0;
  const pendingGatewayActionUrl = history
    .find(entry => entry.status === 'processing' && typeof entry.actionUrl === 'string' && entry.actionUrl.trim().length > 0)
    ?.actionUrl;

  const handleCancelPendingPayment = async () => {
    if (cancellingPending || effectiveStatus !== 'processing') return;
    setCancellingPending(true);
    setCancelPendingError(null);
    try {
      const response = await fetch(`/api/portal/payments/${paymentId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = (await response.json().catch(() => null)) as unknown;
      if (!response.ok) {
        throw new Error(getErrorMessage(json, 'Failed to cancel pending payment'));
      }
      const programId = readActiveProgramId();
      const updatedPreview: CachedPaymentPreview = {
        id: invoice?.id ?? paymentId,
        label: paymentName,
        status: 'unpaid',
        paymentType: invoice?.category ?? paymentPreview?.paymentType ?? 'payment',
        amountLabel,
        syncDate: invoice?.dueDate ?? paymentPreview?.syncDate ?? '-',
        hasInvoice: true,
      };
      setInvoice(current =>
        current ? { ...current, status: 'unpaid', transactionId: undefined, intentId: undefined } : current
      );
      setHistory([]);
      setPaymentPreview(updatedPreview);
      upsertCachedPaymentPreview(programId, updatedPreview);
      router.refresh();
    } catch (err) {
      setCancelPendingError(err instanceof Error ? err.message : 'Failed to cancel pending payment');
    } finally {
      setCancellingPending(false);
    }
  };

  return (
    <div className={paymentsTheme.sectionWrapper}>
      {/* Local breadcrumb for payment detail */}
      <nav className={paymentsTheme.breadcrumbNav}>
        <Link href="/dashboard/payments" className={paymentsTheme.breadcrumbLink}>
          Payments
        </Link>
        <span className={paymentsTheme.breadcrumbSeparator}>/</span>
        <span className={paymentsTheme.breadcrumbCurrent}>Payment Details</span>
      </nav>

      {/* Page title */}
      <h1 className={paymentsTheme.headingTitle}>Payment Details</h1>

      {backgroundError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Payment details are partially loaded. {backgroundError}
        </div>
      ) : null}

      <div className={paymentsTheme.detailLayoutGrid}>
        {/* Kolom kiri */}
        <div className="space-y-6">
          {/* Kartu info pembayaran */}
          <div className={paymentsTheme.detailPrimaryCard}>
            <p className="text-sm font-extrabold text-slate-900">Payment Information</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InfoRow
                label="Payment Name"
                value={paymentName}
                icon={<Tag className="h-4 w-4" />}
              />
              <TagRow label="Category" tag={categoryLabel} icon={<Tag className="h-4 w-4" />} />
              <InfoRow
                label="Description"
                value={paymentDescription}
                icon={<Info className="h-4 w-4" />}
              />
              <InfoRow
                label="Amount"
                value={amountLabel}
                icon={<CreditCard className="h-4 w-4" />}
              />
              <InfoRow
                label="Due Date"
                value={dueDateLabel}
                overdue={overdue}
                icon={<CalendarClock className="h-4 w-4" />}
              />
              <InfoRow
                label="Invoice ID"
                value={invoice?.id ?? paymentId}
                icon={<Tag className="h-4 w-4" />}
              />
              <InfoRow
                label="Transaction ID"
                value={primaryTransactionId ?? 'Not generated yet'}
                icon={<CreditCard className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Pending submission panel — shown above history while the participant's
              manual payment is awaiting admin verification, so they can confirm what
              they submitted without opening a modal. */}
          {effectiveStatus === 'processing' && invoice?.pendingSubmission ? (
            <PendingSubmissionCard
              submission={invoice.pendingSubmission}
              fallbackDateLabel={formatDateLabel}
              methodCatalog={methodCatalog}
            />
          ) : null}

          {/* Payment history section */}
          {historyLoading ? (
            <HistorySectionSkeleton />
          ) : items.length > 0 ? (
            <div className={paymentsTheme.detailPrimaryCard}>
              <p className="text-sm font-extrabold text-slate-900">Payment History</p>
              <div className="mt-3">
                <HistoryPanel items={items} pageSize={1} />
              </div>
            </div>
          ) : null}
        </div>

        {/* Kolom kanan */}
        <div className="space-y-4">
          <div className={paymentsTheme.detailSideCardOuter}>
            <div className={paymentsTheme.detailSideCardHeader}>
              <p className={paymentsTheme.detailSideCardTitle}>Payment Actions</p>
            </div>
            <div className={paymentsTheme.detailSideCardBody}>
              <div className={paymentsTheme.detailIllustrationWrapper}>
                <div className={paymentsTheme.detailIllustrationImageWrapper}>
                  <Image
                    src="/img/paymentrequired.png"
                    alt="Payment required illustration"
                    width={320}
                    height={320}
                    className={paymentsTheme.detailIllustrationImage}
                  />
                </div>
                <p className={paymentsTheme.detailIllustrationTitle}>
                  {effectiveStatus === 'paid'
                    ? 'Payment Completed'
                    : effectiveStatus === 'processing'
                      ? 'Payment In Progress'
                    : overdue
                      ? 'Payment Overdue'
                      : 'Payment Required'}
                </p>
                <p className={paymentsTheme.detailIllustrationBody}>
                  {effectiveStatus === 'paid'
                    ? 'This payment has been completed. You can review the details and receipt history below.'
                    : effectiveStatus === 'processing'
                      ? pendingGatewayActionUrl
                        ? 'Your payment is still pending. Continue from your latest checkout page to finish it.'
                        : 'Your payment is currently pending. We are waiting for payment confirmation.'
                    : overdue
                      ? 'This payment is overdue. Please complete your payment as soon as possible.'
                      : 'This payment requires your attention. Please complete your payment before the due date.'}
                </p>
              </div>
              {effectiveStatus === 'processing' && pendingGatewayActionUrl ? (
                <a
                  href={pendingGatewayActionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={paymentsTheme.detailMakePaymentButton}
                >
                  <span className={paymentsTheme.detailMakePaymentInner}>
                    <CreditCard className="h-4 w-4" />
                    <span>Continue Payment</span>
                  </span>
                </a>
              ) : null}
              {effectiveStatus === 'processing' ? (
                <button
                  type="button"
                  onClick={handleCancelPendingPayment}
                  disabled={cancellingPending}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancellingPending ? 'Cancelling...' : 'Cancel Pending Payment'}
                </button>
              ) : null}
              {effectiveStatus !== 'paid' && effectiveStatus !== 'processing' ? (
                <Link
                  href={`/dashboard/payments/${paymentId}/make-payment`}
                  className={paymentsTheme.detailMakePaymentButton}
                >
                  <span className={paymentsTheme.detailMakePaymentInner}>
                    <CreditCard className="h-4 w-4" />
                    <span>Make Payment</span>
                  </span>
                </Link>
              ) : null}
              {cancelPendingError ? (
                <p className="mt-2 text-sm text-red-600">{cancelPendingError}</p>
              ) : null}
            </div>
          </div>

          <div className={paymentsTheme.detailSideCardOuter}>
            <div className={paymentsTheme.detailSideCardHeader}>
              <p className={paymentsTheme.detailSideCardTitle}>Quick Actions</p>
            </div>
            <div className={paymentsTheme.detailQuickActionsBody}>
              {hasPaymentActivity ? (
                <button type="button" className={paymentsTheme.detailQuickPrimaryButton} onClick={handleDownloadInvoice}>
                  <Download className="h-4 w-4" />
                  <span>Download Invoice</span>
                </button>
              ) : null}

              {effectiveStatus === 'paid' ? (
                <a
                  href={`/api/portal/payments/${paymentId}/receipt`}
                  className={paymentsTheme.detailQuickSecondaryLink}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Receipt</span>
                </a>
              ) : null}

              <a
                href="mailto:support@ybbfoundation.org?subject=Payment%20Assistance"
                className={paymentsTheme.detailQuickSecondaryLink}
              >
                <Mail className="h-4 w-4" />
                <span>Contact Administrator</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  overdue?: boolean;
  icon: React.ReactNode;
}

function InfoRow({ label, value, overdue, icon }: InfoRowProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-primary">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-sm text-slate-700">
          {value}{' '}
          {overdue ? (
            <span className="ml-2 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 ring-1 ring-red-200">
              Overdue
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

interface TagRowProps {
  label: string;
  tag: string;
  icon: React.ReactNode;
}

function TagRow({ label, tag, icon }: TagRowProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-primary">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <span className="mt-1 inline-block rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
          {tag}
        </span>
      </div>
    </div>
  );
}

interface PendingSubmissionCardProps {
  submission: PendingSubmissionData;
  fallbackDateLabel: (value?: string | null) => string;
  methodCatalog: Map<string, PaymentMethodMeta>;
}

function PendingSubmissionCard({ submission, fallbackDateLabel, methodCatalog }: PendingSubmissionCardProps) {
  const methodMeta = resolveMethodMeta(submission.paymentMethod, methodCatalog);
  const paymentMethodLabel = methodMeta.label || 'Not specified';
  const paymentDateLabel = submission.paymentDate
    ? fallbackDateLabel(submission.paymentDate)
    : 'Not provided';
  const submittedAtLabel = submission.submittedAt
    ? fallbackDateLabel(submission.submittedAt)
    : null;

  return (
    <div className={`${paymentsTheme.detailPrimaryCard} border-amber-200 bg-amber-50/40 ring-1 ring-amber-200`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Clock className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-extrabold text-slate-900">Pending Submission</p>
          <p className="mt-1 text-xs text-slate-600">
            Your payment has been submitted and is awaiting verification by our team. Below are the
            details you provided.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="flex gap-3">
          <div className="mt-1 text-primary">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Payment Method</p>
            <div className="mt-1 flex items-center gap-2">
              {methodMeta.icon ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={methodMeta.icon}
                  alt={paymentMethodLabel}
                  className="h-5 w-5 rounded object-contain"
                />
              ) : null}
              <p className="text-sm text-slate-700">{paymentMethodLabel}</p>
            </div>
          </div>
        </div>
        <InfoRow
          label="Source / Account"
          value={submission.sourceName || 'Not provided'}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <InfoRow
          label="Account Name"
          value={submission.accountName || 'Not provided'}
          icon={<User className="h-4 w-4" />}
        />
        <InfoRow
          label="Payment Date"
          value={paymentDateLabel}
          icon={<CalendarClock className="h-4 w-4" />}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {submission.proofUrl ? (
          <a
            href={submission.proofUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>View Payment Proof</span>
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500">
            <FileText className="h-3.5 w-3.5" />
            <span>No proof uploaded</span>
          </span>
        )}
        {submittedAtLabel ? (
          <span className="text-[11px] font-medium text-slate-500">Submitted on {submittedAtLabel}</span>
        ) : null}
      </div>
    </div>
  );
}
