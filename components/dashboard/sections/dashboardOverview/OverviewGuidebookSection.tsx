"use client";

import { componentsTheme } from "@/lib/theme/components";

const overviewTheme = componentsTheme.dashboardOverview;

interface OverviewGuidebookSectionProps {
  /** URL for the English guidebook PDF. Defaults to "#guidebook-en". */
  guidebookEnUrl?: string;
  /** URL for the Indonesian guidebook PDF. Defaults to "#guidebook-id". */
  guidebookIdUrl?: string;
}

export default function OverviewGuidebookSection({
  guidebookEnUrl = "#guidebook-en",
  guidebookIdUrl = "#guidebook-id",
}: OverviewGuidebookSectionProps) {
  return (
    <aside
      className={overviewTheme.guideAside}

    >


            {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 via-transparent to-[var(--brand-primary)]/5 pointer-events-none" />
      <div className={overviewTheme.guideInner}>


        <div className={overviewTheme.guideHeaderWrapper}>
          <p className={overviewTheme.guideEyebrow}>More Information?</p>
          <h2 className={overviewTheme.guideTitle}>Check this Guidebook!</h2>
          <p className={overviewTheme.guideBodyText}>
            The complete information regarding this program can be seen in the guidebook below.
          </p>
        </div>

        <div className={overviewTheme.guideLinksWrapper}>
          <a href={guidebookEnUrl} className={overviewTheme.guideLink}>
            <span className={overviewTheme.guideLeftLinkInner}>
              <span className={overviewTheme.guideBadgeCircle}>
                <span className={overviewTheme.guideBadgeText}>GB</span>
              </span>
              <span>Read Guidebook (Eng)</span>
            </span>
            <span className={overviewTheme.guideFileType}>PDF</span>
          </a>
          <a href={guidebookIdUrl} className={overviewTheme.guideLink}>
            <span className={overviewTheme.guideLeftLinkInner}>
              <span className={overviewTheme.guideBadgeCircle}>
                <span className={overviewTheme.guideBadgeText}>ID</span>
              </span>
              <span>Read Guidebook (Ind)</span>
            </span>
            <span className={overviewTheme.guideFileType}>PDF</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
