'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Clock,
  Mail,
  Tag,
  Info,
  CalendarClock,
  CreditCard,
  Download,
  AlertTriangle,
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

const paymentsTheme = componentsTheme.dashboardPayments;

interface PaymentDetailSectionProps {
  paymentId: string;
}

interface InvoiceData {
  id: string;
  label: string;
  category: string;
  amount: number;
  dueDate?: string;
  status: 'paid' | 'unpaid' | 'processing' | 'failed';
  currency?: string;
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
  paymentMethod?: string;
  dateTime?: string;
  accountName?: string;
  amountLabel?: string;
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

function toMethodDisplayLabel(value: string | null | undefined): string {
  if (isUnknownMethod(value)) return '';
  return toTitleCaseFromToken(value);
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
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No due date';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatDateTimeLabel(value?: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
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
    paymentMethod: typeof value.paymentMethod === 'string' ? value.paymentMethod : undefined,
    dateTime: typeof value.dateTime === 'string' ? value.dateTime : undefined,
    accountName: typeof value.accountName === 'string' ? value.accountName : undefined,
    amountLabel: typeof value.amountLabel === 'string' ? value.amountLabel : undefined,
  };
}

export default function PaymentDetailSection({ paymentId }: PaymentDetailSectionProps) {
  const [paymentPreview, setPaymentPreview] = useState<CachedPaymentPreview | null>(() =>
    readCachedPaymentPreview(readActiveProgramId(), paymentId)
  );
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(paymentPreview === null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const programId = readActiveProgramId();
    const cachedPreview = readCachedPaymentPreview(programId, paymentId);

    if (cachedPreview) {
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
  const invoiceCurrency = (invoice?.currency || 'USD').toUpperCase();
  const formatInvoiceAmount = (value: number) => formatCurrencyValue(value, invoiceCurrency);
  const categoryLabel = toTitleCaseFromToken(invoice?.category ?? paymentPreview?.paymentType);
  const dueDateLabel = invoice ? formatDateLabel(invoice.dueDate) : 'Loading details...';
  const paymentName = invoice?.label?.trim() || paymentPreview?.label?.trim() || 'Program Payment';
  const invoiceStatusLabel = toTitleCaseFromToken(effectiveStatus);
  const paymentDescription = `Payment for ${paymentName} (${categoryLabel}). Current status: ${invoiceStatusLabel}.`;
  const dueDateValue = invoice?.dueDate ? new Date(invoice.dueDate) : null;
  const overdue = Boolean(
    dueDateValue &&
      !Number.isNaN(dueDateValue.getTime()) &&
      dueDateValue < new Date() &&
      effectiveStatus !== 'paid'
  );
  const amountLabel = invoice
    ? formatInvoiceAmount(invoice.amount)
    : paymentPreview?.amountLabel || 'Loading amount...';
  const handleDownloadInvoice = () => {
    const invoiceId = invoice?.id ?? paymentId;
    const content = [
      `Invoice ID: ${invoiceId}`,
      `Payment Name: ${paymentName}`,
      `Category: ${categoryLabel}`,
      `Amount: ${amountLabel}`,
      `Status: ${invoiceStatusLabel}`,
      `Due Date: ${dueDateLabel}`,
      `Generated At: ${new Date().toISOString()}`,
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
    method: toMethodDisplayLabel(h.method),
    amountLabel: h.amountLabel ?? formatInvoiceAmount(h.amount),
    date: formatDateLabel(h.date),
    time: h.time,
    badge:
      h.status === 'cancelled'
        ? { label: 'Cancelled', tone: 'red' as const }
        : h.status === 'failed'
          ? { label: 'Failed', tone: 'red' as const }
          : undefined,
    note: h.note?.trim() || 'No additional notes.',
    details: {
      code: h.code ?? `TR-${h.id}`,
      paymentMethod: toMethodDisplayLabel(h.paymentMethod ?? h.method) || 'Not specified',
      dateTime: h.dateTime
        ? formatDateTimeLabel(h.dateTime)
        : `${formatDateLabel(h.date)} ${h.time}`,
      accountName: h.accountName ?? '',
      amountLabel: h.amountLabel ?? formatInvoiceAmount(h.amount),
      source: 'Participant Dashboard',
      proofUrl: undefined,
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
            </div>
          </div>

          {/* Payment history section */}
          {historyLoading ? (
            <HistorySectionSkeleton />
          ) : items.length === 0 ? (
            <div className={paymentsTheme.detailEmptyStateCard}>
              <div className={paymentsTheme.detailEmptyStateIconWrapper}>
                <Clock className="h-10 w-10" />
              </div>
              <p className={paymentsTheme.detailEmptyStateTitle}>No Payment History Found</p>
              <p className={paymentsTheme.detailEmptyStateBody}>
                There is no payment history available for this payment yet. Once you complete a
                payment, it will appear here.
              </p>
              <button className={paymentsTheme.detailEmptyStateButton}>
                <CreditCard className="h-4 w-4" />
                <span>Make First Payment</span>
              </button>
            </div>
          ) : (
            <div className={paymentsTheme.detailPrimaryCard}>
              <p className="text-sm font-extrabold text-slate-900">Payment History</p>
              <div className="mt-3">
                <HistoryPanel items={items} pageSize={1} />
              </div>
            </div>
          )}
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
                    : overdue
                      ? 'Payment Overdue'
                      : 'Payment Required'}
                </p>
                <p className={paymentsTheme.detailIllustrationBody}>
                  {effectiveStatus === 'paid'
                    ? 'This payment has been completed. You can review the details and receipt history below.'
                    : overdue
                      ? 'This payment is overdue. Please complete your payment as soon as possible.'
                      : 'This payment requires your attention. Please complete your payment before the due date.'}
                </p>
              </div>
              {effectiveStatus !== 'paid' ? (
                <button type="button" className={paymentsTheme.detailMakePaymentButton}>
                  <Link
                    href={`/dashboard/payments/${paymentId}/make-payment`}
                    className={paymentsTheme.detailMakePaymentInner}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Make Payment</span>
                  </Link>
                </button>
              ) : null}
            </div>
          </div>

          <div className={paymentsTheme.detailSideCardOuter}>
            <div className={paymentsTheme.detailSideCardHeader}>
              <p className={paymentsTheme.detailSideCardTitle}>Quick Actions</p>
            </div>
            <div className={paymentsTheme.detailQuickActionsBody}>
              <button type="button" className={paymentsTheme.detailQuickPrimaryButton} onClick={handleDownloadInvoice}>
                <Download className="h-4 w-4" />
                <span>Download Invoice</span>
              </button>

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
