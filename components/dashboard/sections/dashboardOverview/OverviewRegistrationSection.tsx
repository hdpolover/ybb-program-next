"use client";

import { ArrowLeftRight, GraduationCap } from "lucide-react";
import { useMemo } from "react";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { componentsTheme } from "@/lib/theme/components";

const overviewTheme = componentsTheme.dashboardOverview;

export default function OverviewRegistrationSection() {
  const { dashboardSummary } = useDashboardData();
  const activeApplication = dashboardSummary?.activeApplication ?? null;

  const categoryUi = useMemo(() => {
    const category = activeApplication?.category;
    if (category === "fully_funded") {
      return {
        label: "Fully Funded Participant",
        description:
          "You're registered as a Fully Funded participant. Complete all requirements including essays and interviews. You'll pay program fees in scheduled batches, and if selected after the evaluation process, all your payments will be reimbursed.",
      };
    }
    if (category === "self_funded") {
      return {
        label: "Self Funded Participant",
        description:
          "You're registered as a Self Funded participant. Complete all requirements including essays and interviews. You'll pay program fees in scheduled batches to confirm your participation.",
      };
    }

    return {
      label: "Participant",
      description:
        "Review your application category and complete all required steps to continue your journey.",
    };
  }, [activeApplication?.category]);

  const canSwitchCategory = activeApplication?.canSwitchCategory ?? false;
  const currentCategory = activeApplication?.category;
  const switchTarget = currentCategory === "self_funded" ? "fully_funded" : "self_funded";
  const switchTargetLabel = switchTarget === "fully_funded" ? "Fully Funded" : "Self Funded";

  return (
    <div className={overviewTheme.registrationCard}>
      <div className="flex flex-wrap items-start gap-4">
        <div className={overviewTheme.registrationIconCircle}>
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className={overviewTheme.registrationBodyWrapper}>
          <div className={overviewTheme.registrationHeaderRow}>
            <div>
              <h2 className={overviewTheme.registrationTitle}>Your Registration Category</h2>
              <p className={overviewTheme.registrationSubtitle}>{categoryUi.label}</p>
            </div>
          </div>

          <p className={overviewTheme.registrationDescription}>
            {categoryUi.description}
          </p>

          {canSwitchCategory ? (
            <div className={overviewTheme.registrationFooterRow}>
              <div className="flex items-start gap-2">
                <div className={overviewTheme.registrationSwitchIconCircle}>
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                </div>
                <p className={overviewTheme.registrationSwitchText}>
                  <span className="font-semibold">Switch Available:</span> You can switch to {switchTargetLabel}
                  registration for guaranteed program participation with standard payment requirements.
                </p>
              </div>

              <button type="button" className={overviewTheme.registrationSwitchButton}>
                <ArrowLeftRight className="h-4 w-4" />
                <span>Switch to {switchTargetLabel}</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
