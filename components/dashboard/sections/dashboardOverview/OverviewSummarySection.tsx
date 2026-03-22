"use client";

import { AlertTriangle, CheckCircle2, Clock4, Wallet2 } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";

const overviewTheme = componentsTheme.dashboardOverview;

export default function OverviewSummarySection() {
  const { dashboardSummary } = useDashboardData();
  const stats = dashboardSummary?.stats as Record<string, any> | undefined;

  const applicationsCount = stats?.applicationsCount ?? 0;
  const completedProgramsCount = stats?.completedProgramsCount ?? 0;
  const certificatesCount = stats?.certificatesCount ?? 0;

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
              {stats?.totalRequired ?? "$0"}
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
