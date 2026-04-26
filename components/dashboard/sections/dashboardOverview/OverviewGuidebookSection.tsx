"use client";

import { useMemo } from 'react';
import { componentsTheme } from "@/lib/theme/components";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";

const overviewTheme = componentsTheme.dashboardOverview;

type GuidebookCardLink = {
  href: string;
  label: string;
  badge: string;
  fileType: string;
};

function inferGuidebookBadge(label: string, index: number): string {
  const normalizedLabel = label.trim().toLowerCase();

  if (normalizedLabel.includes('ind')) return 'ID';
  if (normalizedLabel.includes('eng') || normalizedLabel.includes('english')) return 'GB';

  const compact = label.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase();
  if (compact.length === 2) return compact;

  return index === 0 ? 'GB' : 'ID';
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
  const guidebooks = useMemo<GuidebookCardLink[]>(() => {
    const items = dashboardSummary?.activeApplication?.guidebooks;
    if (!items?.length) return [];

    return items
      .filter((guidebook): guidebook is { label?: string; url: string } => typeof guidebook?.url === 'string' && guidebook.url.trim().length > 0)
      .map((guidebook, index) => {
        const label = guidebook.label?.trim() || `Read Guidebook ${index + 1}`;

        return {
          href: guidebook.url,
          label,
          badge: inferGuidebookBadge(label, index),
          fileType: inferFileTypeLabel(guidebook.url),
        };
      });
  }, [dashboardSummary?.activeApplication?.guidebooks]);

  if (isDashboardSummaryLoading) {
    return <DashboardPageSkeleton variant="overview-guidebook" className={overviewTheme.guideAside} />;
  }

  if (guidebooks.length === 0) {
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
          <h2 className={overviewTheme.guideTitle}>Check this Guidebook!</h2>
          <p className={overviewTheme.guideBodyText}>
            The complete information regarding this program can be seen in the guidebook below.
          </p>
        </div>

        <div className={overviewTheme.guideLinksWrapper}>
          {guidebooks.map((guidebook) => (
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
                <span>{guidebook.label}</span>
              </span>
              <span className={overviewTheme.guideFileType}>{guidebook.fileType}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
