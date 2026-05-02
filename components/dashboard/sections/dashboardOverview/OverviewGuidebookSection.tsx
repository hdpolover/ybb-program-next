"use client";

import { useMemo } from 'react';
import { componentsTheme } from "@/lib/theme/components";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";

const overviewTheme = componentsTheme.dashboardOverview;

type GuidelineCardLink = {
  href: string;
  label: string;
  badge: string;
  fileType: string;
};

function inferGuidelineBadge(label: string, index: number): string {
  const normalizedLabel = label.trim().toLowerCase();

  if (normalizedLabel.includes('ind')) return 'ID';
  if (normalizedLabel.includes('eng') || normalizedLabel.includes('english')) return 'EN';

  const compact = label.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase();
  if (compact.length === 2) return compact;

  return index === 0 ? 'EN' : 'ID';
}

function inferFileTypeLabel(href: string): string {
  const normalizedPath = href.split('?')[0]?.split('#')[0] ?? href;
  const extension = normalizedPath.split('.').pop()?.trim().toUpperCase();

  if (extension && /^[A-Z0-9]{2,5}$/.test(extension)) {
    return extension;
  }

  return 'FILE';
}

export default function OverviewGuidebookSection() {
  const { dashboardSummary, isDashboardSummaryLoading } = useDashboardData();
  const guidelines = useMemo<GuidelineCardLink[]>(() => {
    const items = dashboardSummary?.activeApplication?.guidebooks;
    if (!items?.length) return [];

    return items
      .filter((guidebook): guidebook is { label?: string; url: string } => typeof guidebook?.url === 'string' && guidebook.url.trim().length > 0)
      .map((guidebook, index) => {
        const baseLabel = guidebook.label?.trim() || `Read Guideline ${index + 1}`;
        const label = baseLabel.replace(/\bguidebooks?\b/gi, match =>
          match.toLowerCase().endsWith("s") ? "Guidelines" : "Guideline",
        );

        return {
          href: guidebook.url,
          label,
          badge: inferGuidelineBadge(label, index),
          fileType: inferFileTypeLabel(guidebook.url),
        };
      });
  }, [dashboardSummary?.activeApplication?.guidebooks]);

  if (isDashboardSummaryLoading) {
    return <DashboardPageSkeleton variant="overview-guidebook" className={overviewTheme.guideAside} />;
  }

  if (guidelines.length === 0) {
    return null;
  }

  return (
    <aside
      className={overviewTheme.guideAside}

    >


            {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/10 via-transparent to-[var(--brand-primary)]/5 pointer-events-none" />
      <div className={overviewTheme.guideInner}>


        <div className={overviewTheme.guideHeaderWrapper}>
          <p className={overviewTheme.guideEyebrow}>More Information?</p>
          <h2 className={overviewTheme.guideTitle}>Check this Guideline!</h2>
          <p className={overviewTheme.guideBodyText}>
            The complete information regarding this program can be seen in the guideline below.
          </p>
        </div>

        <div className={overviewTheme.guideLinksWrapper}>
          {guidelines.map((guidebook) => (
            <a
              key={`${guidebook.href}-${guidebook.label}`}
              href={guidebook.href}
              className={overviewTheme.guideLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={overviewTheme.guideLeftLinkInner}>
                <span className={overviewTheme.guideBadgeCircle}>
                  <span className={overviewTheme.guideBadgeText}>{guidebook.badge}</span>
                </span>
                <span className="truncate">{guidebook.label}</span>
              </span>
              <span className={overviewTheme.guideFileType}>{guidebook.fileType}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
