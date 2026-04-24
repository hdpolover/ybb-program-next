"use client";

import { AlertTriangle, CheckCircle2, Clock4, Wallet2 } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";

const overviewTheme = componentsTheme.dashboardOverview;

function formatMoney(amount: number, currencyCode: string): string {
  const normalizedCurrency = String(currencyCode || "USD").toUpperCase();
  const fractionDigits = normalizedCurrency === "IDR" ? 0 : 2;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toFixed(fractionDigits)}`;
  }
}

export default function OverviewSummarySection() {
  const { dashboardSummary, isDashboardSummaryLoading } = useDashboardData();
  const stats = dashboardSummary?.stats;

  const applicationsCount = stats?.applicationsCount ?? 0;
  const completedProgramsCount = stats?.completedProgramsCount ?? 0;
  const certificatesCount = stats?.certificatesCount ?? 0;
  const totalRequiredLabel = formatMoney(
    stats?.totalRequired?.amount ?? 0,
    stats?.totalRequired?.currency ?? "USD",
  );

  if (isDashboardSummaryLoading) {
    return <DashboardPageSkeleton variant="overview-summary" className={overviewTheme.summaryGrid} />;
  }

  return (
    <div className={overviewTheme.summaryGrid}>
      <div className={`${overviewTheme.summaryCardBase} ${overviewTheme.summaryCompleteCard}`}>
        <div className={overviewTheme.summaryInnerRow}>
          <div>
            <p
              className={`${overviewTheme.summaryEyebrowBase} ${overviewTheme.summaryEyebrowComplete}`}
            >
              Applications
            </p>
            <p
              className={`${overviewTheme.summaryValueBase} ${overviewTheme.summaryValueComplete}`}
            >
              {applicationsCount}
            </p>
          </div>
          <div
            className={`${overviewTheme.summaryIconCircleBase} ${overviewTheme.summaryIconCircleComplete}`}
          >
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className={`${overviewTheme.summaryCardBase} ${overviewTheme.summaryPendingCard}`}>
        <div className={overviewTheme.summaryInnerRow}>
          <div>
            <p
              className={`${overviewTheme.summaryEyebrowBase} ${overviewTheme.summaryEyebrowPending}`}
            >
              Completed Programs
            </p>
            <p
              className={`${overviewTheme.summaryValueBase} ${overviewTheme.summaryValuePending}`}
            >
              {completedProgramsCount}
            </p>
          </div>
          <div
            className={`${overviewTheme.summaryIconCircleBase} ${overviewTheme.summaryIconCirclePending}`}
          >
            <Clock4 className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className={`${overviewTheme.summaryCardBase} ${overviewTheme.summaryOverdueCard}`}>
        <div className={overviewTheme.summaryInnerRow}>
          <div>
            <p
              className={`${overviewTheme.summaryEyebrowBase} ${overviewTheme.summaryEyebrowOverdue}`}
            >
              Certificates
            </p>
            <p
              className={`${overviewTheme.summaryValueBase} ${overviewTheme.summaryValueOverdue}`}
            >
              {certificatesCount}
            </p>
          </div>
          <div
            className={`${overviewTheme.summaryIconCircleBase} ${overviewTheme.summaryIconCircleOverdue}`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className={`${overviewTheme.summaryCardBase} ${overviewTheme.summaryTotalCard}`}>
        <div className={overviewTheme.summaryInnerRow}>
          <div>
            <p
              className={`${overviewTheme.summaryEyebrowBase} ${overviewTheme.summaryEyebrowTotal}`}
            >
              Total Required
            </p>
            <p
              className={`${overviewTheme.summaryValueBase} ${overviewTheme.summaryValueTotal}`}
            >
              {totalRequiredLabel}
            </p>
          </div>
          <div
            className={`${overviewTheme.summaryIconCircleBase} ${overviewTheme.summaryIconCircleTotal}`}
          >
            <Wallet2 className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
