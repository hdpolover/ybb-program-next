"use client";

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
} from "lucide-react";
import HistoryList, { type HistoryItem } from "@/components/dashboard/payments/HistoryList";
import HistoryPanel from "@/components/dashboard/payments/HistoryPanel";
import { componentsTheme } from "@/lib/theme/components";

const paymentsTheme = componentsTheme.dashboardPayments;

interface PaymentDetailSectionProps {
  paymentId: string;
}

export default function PaymentDetailSection({ paymentId }: PaymentDetailSectionProps) {
  // Konten di-hardcode biar cepat, disesuaiin sama kasus realistis di Overview
  const invoice = {
    id: paymentId,
    label: "Program Fee (Final)",
    category: "Program Fee",
    amount: 450,
    dueDate: "Dec 05, 2025",
    status: "unpaid" as const,
  };

  const currency = (v: number) => `$${v.toFixed(2)}`;
  const overdue = false;

  const history: Array<{
    id: string;
    method: string;
    amount: number;
    date: string;
    time: string;
    status: "cancelled" | "failed" | "processing" | "paid";
    note: string;
  }> = [
    {
      id: "h1",
      method: "Virtual Account",
      amount: 450,
      date: "Nov 10, 2025",
      time: "09:00 AM",
      status: "processing",
      note: "Invoice issued for Program Fee (Final). Payment link generated and sent to your email.",
    },
    {
      id: "h2",
      method: "Email Reminder",
      amount: 450,
      date: "Nov 25, 2025",
      time: "08:15 AM",
      status: "processing",
      note: "Reminder sent. Please complete payment before Dec 05, 2025 to secure your seat.",
    },
  ];

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
    amountLabel: currency(h.amount),
    date: h.date,
    time: h.time,
    badge: h.status === "cancelled" ? { label: "Cancelled", tone: "red" } : undefined,
    note: h.note,
    // Detail buat modal — diisi spesifik buat contoh
    details:
      h.id === "h1"
        ? {
            code: "TR-17190-1759390503",
            paymentMethod: "Vakif Bank",
            dateTime: "October 02, 2025 02:35 PM",
            accountName: "tretrt",
            amountLabel: "$10.00",
            source: "trtrt",
            proofUrl: "/img/galeri1.png",
          }
        : {
            code: "TR-88110-1759400111",
            paymentMethod: h.method,
            dateTime: `${h.date} ${h.time}`,
            accountName: "Hilmi",
            amountLabel: currency(h.amount),
            source: "Dashboard",
            proofUrl: "/img/galeri2.png",
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
