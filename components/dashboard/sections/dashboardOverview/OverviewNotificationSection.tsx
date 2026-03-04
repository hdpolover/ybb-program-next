"use client";

import { AlertTriangle, ClipboardList } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";

const overviewTheme = componentsTheme.dashboardOverview;

export default function OverviewNotificationSection() {
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
                Registration Incomplete
              </span>
            </div>
            <p className={overviewTheme.notificationBodyText}>
              Your registration form is not fully completed yet. Please review your application details,
              upload all required documents, and submit the remaining sections to secure your participation.
            </p>
          </div>
        </div>

        <a href="/dashboard/submission/edit" className={overviewTheme.notificationButton}>
          <ClipboardList className="h-4 w-4" />
          <span>Complete Form</span>
        </a>
      </div>
    </div>
  );
}
