"use client";

import { AlertTriangle, ClipboardList } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";

const overviewTheme = componentsTheme.dashboardOverview;

export default function OverviewNotificationSection() {
  const { dashboardSummary, isDashboardSummaryLoading } = useDashboardData();
  const alert = dashboardSummary?.alerts?.[0];

  if (isDashboardSummaryLoading) {
    return <DashboardPageSkeleton variant="overview-notification" className="w-full" />;
  }

  if (!alert) {
    return null;
  }

  return (
    <div className={overviewTheme.notificationCard}>
      <div className={overviewTheme.notificationRow}>
        <div className={overviewTheme.notificationLeftRow}>
          <div className={overviewTheme.notificationIconCircle}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className={overviewTheme.notificationTextWrapper}>
            <div className={overviewTheme.notificationTitleRow}>
              <p className={overviewTheme.notificationEyebrow}>Notification Alert</p>
              <span className={overviewTheme.notificationStatusPill}>
                {alert.title ?? "Action Required"}
              </span>
            </div>
            <p className={overviewTheme.notificationBodyText}>
              {alert.message ??
                "Your registration form is not fully completed yet. Please review your application details, upload all required documents, and submit the remaining sections to secure your participation."}
            </p>
          </div>
        </div>

        {alert.actionUrl && (
          <a href={alert.actionUrl} className={overviewTheme.notificationButton}>
            <ClipboardList className="h-4 w-4" />
            <span>{alert.actionLabel ?? "Take Action"}</span>
          </a>
        )}
      </div>
    </div>
  );
}
