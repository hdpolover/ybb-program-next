"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { getEnvelopeData, getMessage, isRecord } from "@/lib/api/response";

const paymentsTheme = componentsTheme.dashboardPayments;

interface PaymentItem {
  id: string;
  label: string;
  status: "paid" | "unpaid" | "processing" | "failed";
  paymentType: string;
  period: string;
  amount: string;
  syncDate: string;
  hasInvoice?: boolean;
}

interface PaymentsSummary {
  complete: number;
  pending: number;
  overdue: number;
  totalRequired: string;
}

function toPaymentStatus(value: unknown): PaymentItem["status"] {
  if (value === "paid" || value === "unpaid" || value === "processing" || value === "failed") {
    return value;
  }
  return "unpaid";
}

function toPaymentItem(value: unknown): PaymentItem | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  if (!id) return null;

  return {
    id,
    label: typeof value.label === "string" ? value.label : "Payment",
    status: toPaymentStatus(value.status),
    paymentType: typeof value.paymentType === "string" ? value.paymentType : "General",
    period: typeof value.period === "string" ? value.period : "-",
    amount:
      typeof value.amount === "string"
        ? value.amount
        : typeof value.amount === "number" && Number.isFinite(value.amount)
          ? String(value.amount)
          : "-",
    syncDate: typeof value.syncDate === "string" ? value.syncDate : "-",
    hasInvoice: typeof value.hasInvoice === "boolean" ? value.hasInvoice : undefined,
  };
}

function toPaymentsSummary(value: unknown): PaymentsSummary {
  const fallback: PaymentsSummary = {
    complete: 0,
    pending: 0,
    overdue: 0,
    totalRequired: "$0",
  };

  if (!isRecord(value)) return fallback;

  return {
    complete: typeof value.complete === "number" && Number.isFinite(value.complete) ? value.complete : 0,
    pending: typeof value.pending === "number" && Number.isFinite(value.pending) ? value.pending : 0,
    overdue: typeof value.overdue === "number" && Number.isFinite(value.overdue) ? value.overdue : 0,
    totalRequired: typeof value.totalRequired === "string" ? value.totalRequired : "$0",
  };
}

export default function PaymentsListSection() {
  const { dashboardSummary } = useDashboardData();
  const router = useRouter();
  const activeApplication = dashboardSummary?.activeApplication ?? null;
  const canSwitchCategory = activeApplication?.canSwitchCategory ?? false;
  const currentCategory = activeApplication?.category;
  const switchTarget = currentCategory === "self_funded" ? "fully_funded" : "self_funded";
  const switchTargetLabel = switchTarget === "fully_funded" ? "Fully Funded" : "Self Funded";
  const currentCategoryLabel = currentCategory === "fully_funded" ? "Fully Funded" : "Self Funded";

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [summary, setSummary] = useState<PaymentsSummary>({
    complete: 0,
    pending: 0,
    overdue: 0,
    totalRequired: "$0",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [rowActionLoadingId, setRowActionLoadingId] = useState<string | null>(null);

  const resolveInvoiceId = async (payment: PaymentItem): Promise<string> => {
    if (payment.hasInvoice !== false) {
      return payment.id;
    }

    const tierId = payment.id.startsWith("tier:") ? payment.id.slice(5) : "";
    if (!tierId) {
      throw new Error("Unable to resolve payment option ID.");
    }

    const programId = readActiveProgramId();
    const response = await fetch(`/api/portal/payments/tiers/${tierId}/ensure-invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program_id: programId || undefined }),
    });

    const json = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
      throw new Error(getMessage(json) ?? "Failed to prepare payment invoice");
    }

    const payload = getEnvelopeData(json);
    const invoiceId =
      isRecord(payload) && typeof payload.invoice_id === "string"
        ? payload.invoice_id
        : null;
    if (!invoiceId) {
      throw new Error("Invoice was not returned by the server");
    }

    setPayments((prev) =>
      prev.map((row) =>
        row.id === payment.id
          ? {
              ...row,
              id: invoiceId,
              hasInvoice: true,
            }
          : row,
      ),
    );

    return invoiceId;
  };

  const handlePaymentAction = async (
    payment: PaymentItem,
    target: "detail" | "make-payment" | "print",
  ) => {
    try {
      setActionError(null);
      setRowActionLoadingId(payment.id);
      const invoiceId = await resolveInvoiceId(payment);

      if (target === "make-payment") {
        router.push(`/dashboard/payments/${invoiceId}/make-payment`);
        return;
      }

      if (target === "print") {
        window.open(`/dashboard/payments/${invoiceId}`, "_blank", "noopener,noreferrer");
        return;
      }

      router.push(`/dashboard/payments/${invoiceId}`);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to open payment action");
    } finally {
      setRowActionLoadingId(null);
    }
  };

  async function handleSwitch() {
    if (!activeApplication?.id) {
      setSwitchError("Application ID not found. Please refresh the page and try again.");
      return;
    }
    setSwitchLoading(true);
    setSwitchError(null);
    try {
      const res = await fetch("/api/portal/switch-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: activeApplication.id, targetCategory: switchTarget }),
      });
      const json = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) {
        setSwitchError(getMessage(json) ?? "Failed to switch category. Please try again.");
        return;
      }
      setShowSwitchModal(false);
      router.refresh();
    } catch {
      setSwitchError("Something went wrong. Please try again.");
    } finally {
      setSwitchLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);

        const programId = readActiveProgramId();
        const url = appendProgramId("/api/portal/payments", programId);

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await response.json().catch(() => null)) as unknown;
        if (!response.ok) {
          throw new Error(getMessage(json) ?? "Failed to load payments");
        }

        if (!cancelled) {
          const payload = getEnvelopeData(json);
          const payloadRecord = isRecord(payload) ? payload : null;
          const items = Array.isArray(payloadRecord?.items)
            ? payloadRecord.items
                .map(toPaymentItem)
                .filter((item): item is PaymentItem => item !== null)
            : [];

          setActionError(null);
          setPayments(items);
          setSummary(toPaymentsSummary(payloadRecord?.summary));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load payments");
        }
      } finally {
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
      window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, handleProgramChange as EventListener);
    };
  }, []);

  if (loading) {
    return <DashboardPageSkeleton variant="payments-list" className={paymentsTheme.sectionWrapper} />;
  }

  if (error) {
    return (
      <section className={paymentsTheme.sectionWrapper}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={paymentsTheme.sectionWrapper}>
      {/* Payments summary (mirroring dashboard overview) */}
      <div className={paymentsTheme.summaryGrid}>
        <div
          className={`${paymentsTheme.summaryCardBase} ${paymentsTheme.summaryCompleteCard}`}
        >
          <div className={paymentsTheme.summaryCardInner}>
            <div>
              <p
                className={`${paymentsTheme.summaryEyebrow} ${paymentsTheme.summaryCompleteEyebrow}`}
              >
                Complete Payments
              </p>
              <p
                className={`${paymentsTheme.summaryValue} ${paymentsTheme.summaryCompleteValue}`}
              >
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

        <div
          className={`${paymentsTheme.summaryCardBase} ${paymentsTheme.summaryPendingCard}`}
        >
          <div className={paymentsTheme.summaryCardInner}>
            <div>
              <p
                className={`${paymentsTheme.summaryEyebrow} ${paymentsTheme.summaryPendingEyebrow}`}
              >
                Pending Payments
              </p>
              <p
                className={`${paymentsTheme.summaryValue} ${paymentsTheme.summaryPendingValue}`}
              >
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

        <div
          className={`${paymentsTheme.summaryCardBase} ${paymentsTheme.summaryOverdueCard}`}
        >
          <div className={paymentsTheme.summaryCardInner}>
            <div>
              <p
                className={`${paymentsTheme.summaryEyebrow} ${paymentsTheme.summaryOverdueEyebrow}`}
              >
                Overdue Payments
              </p>
              <p
                className={`${paymentsTheme.summaryValue} ${paymentsTheme.summaryOverdueValue}`}
              >
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

        <div
          className={`${paymentsTheme.summaryCardBase} ${paymentsTheme.summaryTotalCard}`}
        >
          <div className={paymentsTheme.summaryCardInner}>
            <div>
              <p
                className={`${paymentsTheme.summaryEyebrow} ${paymentsTheme.summaryTotalEyebrow}`}
              >
                Total Required
              </p>
              <p
                className={`${paymentsTheme.summaryValue} ${paymentsTheme.summaryTotalValue}`}
              >
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

      {canSwitchCategory && (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Registration Category</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900">
                {currentCategoryLabel}
                <span className="mx-2 text-slate-300">|</span>
                <span className="text-primary">Eligible to switch to {switchTargetLabel}</span>
              </p>
              <p className="mt-0.5 text-xs text-slate-600">
                Payment options will follow your selected category and payment stage.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-primary"
              onClick={() => setShowSwitchModal(true)}
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Switch to {switchTargetLabel}</span>
            </button>
          </div>
        </div>
      )}

      {showSwitchModal && typeof document !== "undefined" && createPortal(
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
              You are about to switch your registration category from{" "}
              <span className="font-medium">{currentCategoryLabel}</span> to{" "}
              <span className="font-medium">{switchTargetLabel}</span>. This will change your payment
              requirements and program participation terms.
            </p>

            {switchTarget === "self_funded" && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p className="font-medium">Important: Switching to Self Funded</p>
                <p className="mt-1">You will be required to pay program fees in scheduled batches to confirm your participation. Any previous fully funded payments may be subject to program terms.</p>
              </div>
            )}
            {switchTarget === "fully_funded" && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                <p className="font-medium">Important: Switching to Fully Funded</p>
                <p className="mt-1">You will be eligible for program funding after completing evaluation. If selected, your payments will be reimbursed.</p>
              </div>
            )}

            {switchError && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{switchError}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => { setShowSwitchModal(false); setSwitchError(null); }}
                disabled={switchLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                onClick={handleSwitch}
                disabled={switchLoading}
              >
                <ArrowLeftRight className="h-4 w-4" />
                {switchLoading ? "Switching…" : `Confirm Switch to ${switchTargetLabel}`}
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
            <h2 className={paymentsTheme.tableTitle}>
              Payment Details
            </h2>
            <p className={paymentsTheme.tableSubtitle}>
              Overview of your registration payments, status, and synchronization time.
            </p>
          </div>

          <div className={paymentsTheme.tableControlsWrapper}>
            <div className={paymentsTheme.tableShowWrapper}>
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
          <table className={paymentsTheme.table}>
            <thead>
              <tr className={paymentsTheme.tableHeadRow}>
                <th className={paymentsTheme.tableHeadCell}>Payment Information</th>
                <th className={paymentsTheme.tableHeadCell}>Payment Type</th>
                <th className={paymentsTheme.tableHeadCell}>Payment Status</th>
                <th className={paymentsTheme.tableHeadCell}>Period</th>
                <th className={paymentsTheme.tableHeadCell}>Amount</th>
                <th className={paymentsTheme.tableHeadCell}>Sync Date</th>
                <th className={paymentsTheme.tableHeadCellRight}>Actions</th>
              </tr>
            </thead>
            <tbody className={paymentsTheme.tableBody}>
              {payments.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center bg-slate-50 px-6 py-10 text-center">
                      <img
                        src="/img/tablenotfounds.png"
                        alt="No payments"
                        className="mb-4 h-auto max-h-36 w-auto"
                      />
                      <p className="text-base font-extrabold text-slate-900">No payments yet</p>
                      <p className="mt-1 max-w-sm text-sm text-slate-500">
                        Your payment records will appear here once payments are assigned to your account.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
              {payments.map(payment => {
                const isPaid = payment.status === "paid";
                const isProcessing = payment.status === "processing";
                const isFailed = payment.status === "failed";
                const isRowLoading = rowActionLoadingId === payment.id;
                return (
                  <tr key={payment.id} className={paymentsTheme.tableRow}>
                    <td className={paymentsTheme.paymentInfoCell}>{payment.label}</td>
                    <td className={paymentsTheme.periodCell}>{payment.paymentType || "General"}</td>
                    <td className={paymentsTheme.statusCell}>
                      <span
                        className={`${paymentsTheme.statusBadgeBase} ${
                          isPaid
                            ? paymentsTheme.statusBadgePaid
                            : isProcessing
                              ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                              : isFailed
                                ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                                : paymentsTheme.statusBadgeUnpaid
                        }`}
                      >
                        {isPaid ? "Paid" : isProcessing ? "Processing" : isFailed ? "Failed" : "Unpaid"}
                      </span>
                    </td>
                    <td className={paymentsTheme.periodCell}>{payment.period}</td>
                    <td className={paymentsTheme.amountCell}>{payment.amount}</td>
                    <td className={paymentsTheme.syncDateCell}>{payment.syncDate}</td>
                    <td className={paymentsTheme.actionsCell}>
                      <div className={paymentsTheme.actionsWrapper}>
                        <button
                          type="button"
                          className={`${paymentsTheme.primaryIconButton} ${isRowLoading ? "cursor-wait opacity-70" : ""}`}
                          aria-label="Pay now"
                          disabled={isRowLoading}
                          onClick={() => handlePaymentAction(payment, "make-payment")}
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={`${paymentsTheme.secondaryIconButton} ${isRowLoading ? "cursor-wait opacity-70" : ""}`}
                          aria-label="See details"
                          disabled={isRowLoading}
                          onClick={() => handlePaymentAction(payment, "detail")}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={`${paymentsTheme.tertiaryIconButton} ${isRowLoading ? "cursor-wait opacity-70" : ""}`}
                          aria-label="Print invoice"
                          disabled={isRowLoading}
                          onClick={() => handlePaymentAction(payment, "print")}
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
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
