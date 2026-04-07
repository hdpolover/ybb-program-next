"use client";

import { jysSectionTheme } from "@/lib/theme/jys-components";

const overviewTheme = jysSectionTheme.dashboardOverview;

export default function OverviewGuidebookSection() {
  return (
    <aside
      className={`${overviewTheme.guideAside} sm:bg-[url('/img/bgguidebookdashboard.png')] sm:bg-cover sm:bg-bottom`}
      style={{
        backgroundColor: '#facde7',
        backgroundImage: 'none',
      }}
    >
      <div className={overviewTheme.guideInner}>
        <div className={overviewTheme.guideHeaderWrapper}>
          <p className={overviewTheme.guideEyebrow}>More Information?</p>
          <h2 className={overviewTheme.guideTitle}>Check this Guidebook!</h2>
          <p className={overviewTheme.guideBodyText}>
            The complete information regarding this program can be seen in the guidebook below.
          </p>
        </div>

        <div className={overviewTheme.guideLinksWrapper}>
          <a href="#guidebook-en" className={overviewTheme.guideLink}>
            <span className={overviewTheme.guideLeftLinkInner}>
              <span className={overviewTheme.guideBadgeCircle}>
                <span className={overviewTheme.guideBadgeText}>GB</span>
              </span>
              <span>Read Guidebook (Eng)</span>
            </span>
            <span className={overviewTheme.guideFileType}>PDF</span>
          </a>
          <a href="#guidebook-id" className={overviewTheme.guideLink}>
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
