"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock4,
  Wallet2,
  ArrowLeftRight,
  BadgeCheck,
  CreditCard,
  Sparkles,
  Search,
  Printer,
  Eye,
  Loader2,
} from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";

const paymentsTheme = componentsTheme.dashboardPayments;

interface PaymentItem {
  id: string;
  label: string;
  status: "paid" | "unpaid";
  period: string;
  amount: string;
  syncDate: string;
}

interface PaymentsSummary {
  complete: number;
  pending: number;
  overdue: number;
  totalRequired: string;
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

  async function handleSwitch() {
    if (!activeApplication?.id) return;
    setSwitchLoading(true);
    setSwitchError(null);
    try {
      const res = await fetch("/api/portal/switch-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: activeApplication.id, targetCategory: switchTarget }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSwitchError((json as any)?.message ?? "Failed to switch category. Please try again.");
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

        const json = (await response.json().catch(() => ({}))) as any;
        if (!response.ok) {
          throw new Error(json?.message || "Failed to load payments");
        }

        if (!cancelled) {
          setPayments(json?.data?.items ?? []);
          setSummary(
            json?.data?.summary ?? {
              complete: 0,
              pending: 0,
              overdue: 0,
              totalRequired: "$0",
            },
          );
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
    return (
      <section className={paymentsTheme.sectionWrapper}>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-slate-500">Loading payments...</span>
        </div>
      </section>
    );
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
        <div className={paymentsTheme.categoryCard}>
          <div className={paymentsTheme.categoryHeader}>
            <div className="space-y-3">
              <h2 className={paymentsTheme.categoryTitle}>
                Category Switch Available
              </h2>
              <div className={paymentsTheme.categoryBodyText}>
                <p className={paymentsTheme.categoryLabel}>Your Registration Category:</p>
                <div className="flex items-center gap-2">
                  <span className={paymentsTheme.categoryPill}>
                    <BadgeCheck className={paymentsTheme.categoryPillIcon} />
                  </span>
                  <p className={paymentsTheme.categoryStatusText}>{currentCategoryLabel}</p>
                </div>
                <p className={paymentsTheme.categoryDescription}>
                  You&apos;re eligible to switch from {currentCategoryLabel} to {switchTargetLabel}. By switching, you&apos;ll be able to:
                </p>
              </div>

              <ul className={paymentsTheme.categoryBulletList}>
                <li className={paymentsTheme.categoryBulletItem}>
                  <span
                    className={`${paymentsTheme.categoryBulletIconBase} ${paymentsTheme.categoryBulletIconPrimary}`}
                  >
                    <BadgeCheck className={paymentsTheme.categoryBulletIconInner} />
                  </span>
                  <span>Continue with your program participation.</span>
                </li>
                <li className={paymentsTheme.categoryBulletItem}>
                  <span
                    className={`${paymentsTheme.categoryBulletIconBase} ${paymentsTheme.categoryBulletIconSecondary}`}
                  >
                    <CreditCard className={paymentsTheme.categoryBulletIconInner} />
                  </span>
                  <span>Access {switchTargetLabel.toLowerCase()} payment options.</span>
                </li>
                <li className={paymentsTheme.categoryBulletItem}>
                  <span
                    className={`${paymentsTheme.categoryBulletIconBase} ${paymentsTheme.categoryBulletIconTertiary}`}
                  >
                    <Sparkles className={paymentsTheme.categoryBulletIconInner} />
                  </span>
                  <span>Complete your registration and program fees.</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  type="button"
                  className={paymentsTheme.categoryPrimaryCta}
                  onClick={() => setShowSwitchModal(true)}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>Switch to {switchTargetLabel}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSwitchModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4">
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
        </div>
      )}

      <div className={paymentsTheme.tableCard}>
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
                  <td colSpan={6}>
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
                return (
                  <tr key={payment.id} className={paymentsTheme.tableRow}>
                    <td className={paymentsTheme.paymentInfoCell}>{payment.label}</td>
                    <td className={paymentsTheme.statusCell}>
                      <span
                        className={`${paymentsTheme.statusBadgeBase} ${
                          isPaid
                            ? paymentsTheme.statusBadgePaid
                            : paymentsTheme.statusBadgeUnpaid
                        }`}
                      >
                        {isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className={paymentsTheme.periodCell}>{payment.period}</td>
                    <td className={paymentsTheme.amountCell}>{payment.amount}</td>
                    <td className={paymentsTheme.syncDateCell}>{payment.syncDate}</td>
                    <td className={paymentsTheme.actionsCell}>
                      <div className={paymentsTheme.actionsWrapper}>
                        <button
                          type="button"
                          className={paymentsTheme.primaryIconButton}
                          aria-label="Pay now"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                        </button>
                        <Link
                          href={`/dashboard/payments/${payment.id}`}
                          className={paymentsTheme.secondaryIconButton}
                          aria-label="See details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          className={paymentsTheme.tertiaryIconButton}
                          aria-label="Print invoice"
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
