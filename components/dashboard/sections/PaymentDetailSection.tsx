"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  Mail,
  MessageCircle,
  Tag,
  Info,
  CalendarClock,
  CreditCard,
  Printer,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import HistoryList, { type HistoryItem } from "@/components/dashboard/payments/HistoryList";
import HistoryPanel from "@/components/dashboard/payments/HistoryPanel";
import { componentsTheme } from "@/lib/theme/components";

const paymentsTheme = componentsTheme.dashboardPayments;

interface PaymentDetailSectionProps {
  paymentId: string;
}

interface InvoiceData {
  id: string;
  label: string;
  category: string;
  amount: number;
  dueDate: string;
  status: "paid" | "unpaid";
  currency?: string;
}

interface HistoryEntry {
  id: string;
  method: string;
  amount: number;
  date: string;
  time: string;
  status: "cancelled" | "failed" | "processing" | "paid";
  note: string;
  code?: string;
  paymentMethod?: string;
  dateTime?: string;
  accountName?: string;
  amountLabel?: string;
}

export default function PaymentDetailSection({ paymentId }: PaymentDetailSectionProps) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currency = (v: number) => `$${v.toFixed(2)}`;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/portal/payments/${paymentId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await response.json().catch(() => ({}))) as any;
        if (!response.ok) {
          throw new Error(json?.message || "Failed to load payment details");
        }

        if (!cancelled) {
          setInvoice(json?.data?.invoice ?? null);
          setHistory(json?.data?.history ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load payment details");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  if (loading) {
    return (
      <div className={paymentsTheme.sectionWrapper}>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-slate-500">Loading payment details...</span>
        </div>
      </div>
    );
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

  if (!invoice) {
    return (
      <div className={paymentsTheme.sectionWrapper}>
        <div className={paymentsTheme.detailEmptyStateCard}>
          <div className={paymentsTheme.detailEmptyStateIconWrapper}>
            <Info className="h-6 w-6" />
          </div>
          <p className={paymentsTheme.detailEmptyStateTitle}>Payment not found.</p>
          <p className={paymentsTheme.detailEmptyStateBody}>
            The payment you are looking for could not be found. Please go back to the payments page and try
            again.
          </p>
          <Link href="/dashboard/payments" className={paymentsTheme.detailEmptyStateButton}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Payments</span>
          </Link>
        </div>
      </div>
    );
  }

  const overdue = false;

  const items: HistoryItem[] = history.map(h => ({
    id: h.id,
    title:
      h.status === "cancelled"
        ? "Payment Cancelled"
        : h.status === "paid"
        ? "Payment Completed"
        : h.status === "failed"
        ? "Payment Rejected"
        : h.status === "processing"
        ? "Payment Update"
        : "Payment Created",
    method: h.method,
    amountLabel: h.amountLabel ?? currency(h.amount),
    date: h.date,
    time: h.time,
    badge: h.status === "cancelled" ? { label: "Cancelled", tone: "red" } : undefined,
    note: h.note,
    details: {
      code: h.code ?? `TR-${h.id}`,
      paymentMethod: h.paymentMethod ?? h.method,
      dateTime: h.dateTime ?? `${h.date} ${h.time}`,
      accountName: h.accountName ?? "",
      amountLabel: h.amountLabel ?? currency(h.amount),
      source: "Dashboard",
      proofUrl: undefined,
    },
    status:
      h.status === "processing"
        ? "pending"
        : h.status === "paid"
        ? "completed"
        : h.status === "cancelled"
        ? "cancelled"
        : h.status === "failed"
        ? "rejected"
        : "created",
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

      <div className={paymentsTheme.detailLayoutGrid}>
        {/* Kolom kiri */}
        <div className="space-y-6">
          {/* Kartu info pembayaran */}
          <div className={paymentsTheme.detailPrimaryCard}>
            <p className="text-sm font-extrabold text-slate-900">Payment Information</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InfoRow
                label="Payment Name"
                value={invoice.label}
                icon={<Tag className="h-4 w-4" />}
              />
              <TagRow label="Category" tag={invoice.category} icon={<Tag className="h-4 w-4" />} />
              <InfoRow
                label="Description"
                value="Japan Youth Summit — Final program fee for self-funded participant"
                icon={<Info className="h-4 w-4" />}
              />
              <InfoRow
                label="Amount"
                value={currency(invoice.amount)}
                icon={<CreditCard className="h-4 w-4" />}
              />
              <InfoRow
                label="Due Date"
                value={`${invoice.dueDate}`}
                overdue={overdue}
                icon={<CalendarClock className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Payment history section */}
          {items.length === 0 ? (
            <div className={paymentsTheme.detailEmptyStateCard}>
              <div className={paymentsTheme.detailEmptyStateIconWrapper}>
                <Clock className="h-10 w-10" />
              </div>
              <p className={paymentsTheme.detailEmptyStateTitle}>No Payment History Found</p>
              <p className={paymentsTheme.detailEmptyStateBody}>
                There is no payment history available for this payment yet. Once you complete a payment, it will
                appear here.
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
                <p className={paymentsTheme.detailIllustrationTitle}>Payment Required</p>
                <p className={paymentsTheme.detailIllustrationBody}>
                  This payment requires your attention. Please complete your payment before the due date.
                </p>
              </div>
              <button type="button" className={paymentsTheme.detailMakePaymentButton}>
                <Link
                  href={`/dashboard/payments/${paymentId}/make-payment`}
                  className={paymentsTheme.detailMakePaymentInner}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Make Payment</span>
                </Link>
              </button>
            </div>
          </div>

          <div className={paymentsTheme.detailSideCardOuter}>
            <div className={paymentsTheme.detailSideCardHeader}>
              <p className={paymentsTheme.detailSideCardTitle}>Quick Actions</p>
            </div>
            <div className={paymentsTheme.detailQuickActionsBody}>
              <button className={paymentsTheme.detailQuickPrimaryButton}>
                <Printer className="h-4 w-4" />
                <span>Print Details</span>
              </button>

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
          {value}{" "}
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
