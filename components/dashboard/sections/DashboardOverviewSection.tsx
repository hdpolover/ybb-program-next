"use client";

import OverviewSummarySection from "./dashboardOverview/OverviewSummarySection";
import OverviewRegistrationSection from "./dashboardOverview/OverviewRegistrationSection";
import OverviewProgramDetailsSection from "./dashboardOverview/OverviewProgramDetailsSection";
import OverviewGuidebookSection from "./dashboardOverview/OverviewGuidebookSection";
import OverviewNotificationSection from "./dashboardOverview/OverviewNotificationSection";
import SubmitReminderPopup from "./dashboardOverview/SubmitReminderPopup";
import { componentsTheme } from "@/lib/theme/components";

const overviewTheme = componentsTheme.dashboardOverview;

export default function DashboardOverviewSection() {
  return (
    <section className={overviewTheme.sectionWrapper}>
      <SubmitReminderPopup />
      <OverviewSummarySection />

      <div className={overviewTheme.mainGrid}>
        <div className={overviewTheme.leftColumnWrapper}>
          <OverviewRegistrationSection />
          <OverviewProgramDetailsSection />
        </div>

        <OverviewGuidebookSection />
      </div>

      <OverviewNotificationSection />
    </section>
  );
}
