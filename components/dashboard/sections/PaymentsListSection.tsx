import Link from "next/link";
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
} from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";

const paymentsTheme = componentsTheme.dashboardPayments;

export default function PaymentsListSection() {
  const mockPayments = [
    {
      id: "registration",
      label: "Registration Fee Fully Funded Registration",
      status: "paid" as const,
      period: "Nov 15, 2025 - Jan 15, 2026",
      amount: "$10.00",
      syncDate: "10-10-2024, 12:10:00",
    },
    {
      id: "program",
      label: "Program Fee Fully Funded Registration",
      status: "unpaid" as const,
      period: "Nov 15, 2025 - Jan 15, 2026",
      amount: "$10.00",
      syncDate: "10-10-2024, 12:10:00",
    },
    {
      id: "accommodation",
      label: "Accommodation",
      status: "paid" as const,
      period: "Nov 15, 2025 - Jan 15, 2026",
      amount: "$10.00",
      syncDate: "10-10-2024, 12:10:00",
    },
    {
      id: "hotel",
      label: "Hotel Tickets",
      status: "paid" as const,
      period: "Nov 15, 2025 - Jan 15, 2026",
      amount: "$10.00",
      syncDate: "10-10-2024, 12:10:00",
    },
  ];

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
                0
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
                0
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
                0
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
                $0
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
                <p className={paymentsTheme.categoryStatusText}>Fully Funded</p>
              </div>
              <p className={paymentsTheme.categoryDescription}>
                You're eligible to switch from Fully Funded to Self Funded. By switching to self-funded
                status, you'll be able to:
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
                <span>Access self-funded payment options.</span>
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
              >
                <ArrowLeftRight className="h-4 w-4" />
                <span>Switch to Self Funded</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
              {mockPayments.map(payment => {
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

        <p className={paymentsTheme.tableFooterText}>Showing 4 of 4 entries</p>
      </div>
    </section>
  );
}
