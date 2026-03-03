"use client";

import { AlertTriangle, CheckCircle2, Clock4, Wallet2 } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const overviewTheme = jysSectionTheme.dashboardOverview;

export default function OverviewSummarySection() {
  return (
    <div className={overviewTheme.summaryGrid}>
      <div className={`${overviewTheme.summaryCardBase} ${overviewTheme.summaryCompleteCard}`}>
        <div className={overviewTheme.summaryInnerRow}>
          <div>
            <p
              className={`${overviewTheme.summaryEyebrowBase} ${overviewTheme.summaryEyebrowComplete}`}
            >
              Complete Payments
            </p>
            <p
              className={`${overviewTheme.summaryValueBase} ${overviewTheme.summaryValueComplete}`}
            >
              0
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
              Pending Payments
            </p>
            <p
              className={`${overviewTheme.summaryValueBase} ${overviewTheme.summaryValuePending}`}
            >
              0
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
              Overdue Payments
            </p>
            <p
              className={`${overviewTheme.summaryValueBase} ${overviewTheme.summaryValueOverdue}`}
            >
              0
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
              $0
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
