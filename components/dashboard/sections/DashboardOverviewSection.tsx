"use client";

import OverviewSummarySection from "./dashboardOverview/OverviewSummarySection";
import OverviewRegistrationSection from "./dashboardOverview/OverviewRegistrationSection";
import OverviewProgramDetailsSection from "./dashboardOverview/OverviewProgramDetailsSection";
import OverviewGuidebookSection from "./dashboardOverview/OverviewGuidebookSection";
import OverviewNotificationSection from "./dashboardOverview/OverviewNotificationSection";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const overviewTheme = jysSectionTheme.dashboardOverview;

export default function DashboardOverviewSection() {
  return (
    <section className={overviewTheme.sectionWrapper}>
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
