"use client";

import { mapSubmissionStatusToProgressStatus, type ProgressStep } from "@/components/dashboard/sections/dashboardOverview/OverviewProgramDetailsSection";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { usePortalSubmissionProgress } from "@/hooks/usePortalSubmissionProgress";
import { componentsTheme } from "@/lib/theme/components";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";
import { useMemo, useEffect, useState, useRef } from "react";
import {
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import { getEnvelopeData } from "@/lib/api/response";
import { toPortalSubmissionDetail } from "@/lib/dashboard/submissionParser";
import type { PortalSubmissionDetail, PortalSubmissionSection, PortalSubmissionEssay } from "@/types/portal-submission";

const overviewTheme = componentsTheme.dashboardOverview;

function normalizeStepTitle(value: string) {
  return value.trim().toLowerCase();
}

function calculateSectionStatus(section: PortalSubmissionSection, essays?: PortalSubmissionEssay[]): 'pending' | 'in_progress' | 'completed' {
  const relevant = section.fields.filter(f => f.type !== 'header' && f.type !== 'divider' && f.isRequired);
  if (relevant.length === 0) {
    if (section.id === 'entry_information' && essays && essays.length > 0) {
      const requiredEssays = essays.filter(e => e.isRequired);
      if (requiredEssays.length === 0) return 'completed';
      const answeredEssays = requiredEssays.filter(e => e.answer && e.answer.trim() !== '');
      const essayFillRate = answeredEssays.length / requiredEssays.length;
      if (essayFillRate === 1) return 'completed';
      if (essayFillRate > 0) return 'in_progress';
      return 'pending';
    }
    return 'completed';
  }

  const filled = relevant.filter(f => {
    const v = section.values[f.name];
    return v !== null && v !== undefined && v !== '' && String(v).trim() !== '';
  });

  const fillRate = filled.length / relevant.length;
  
  if (fillRate === 1) return 'completed';
  if (fillRate > 0) return 'in_progress';
  return 'pending';
}

function getCurrentStepIndex({
  steps,
  currentStepTitle,
  progressPercentage,
}: {
  steps: ProgressStep[];
  currentStepTitle: string | null;
  progressPercentage: number;
}) {
  if (currentStepTitle?.trim()) {
    const normalized = normalizeStepTitle(currentStepTitle);
    const matchedIndex = steps.findIndex(step => normalizeStepTitle(step.title) === normalized);
    if (matchedIndex !== -1) return matchedIndex;
  }

  const totalSteps = steps.length;
  if (totalSteps <= 0) return 0;

  const ratio = Math.min(1, Math.max(0, progressPercentage / 100));
  const idx = Math.max(0, Math.min(totalSteps - 1, Math.ceil(ratio * totalSteps) - 1));
  return idx;
}

export default function DashboardProgressPage() {
  const { dashboardSummary } = useDashboardData();
  const activeApplication = dashboardSummary?.activeApplication ?? null;
  const { currentStepIndex, error } = usePortalSubmissionProgress();
  const [submissionDetail, setSubmissionDetail] = useState<PortalSubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const loadedApplicationIdRef = useRef<string | null>(null);

  useEffect(() => {
    const selectedProgramId = readActiveProgramId();
    if (!selectedProgramId) return;

    let cancelled = false;
    if (loadedApplicationIdRef.current !== selectedProgramId) {
      loadedApplicationIdRef.current = selectedProgramId;
      setSubmissionDetail(null);
      setDetailLoading(true);
    }

    (async () => {
      try {
        const res = await fetch(appendProgramId("/api/portal/submissions/detail", selectedProgramId), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as unknown;
        if (!cancelled && res.ok) {
          const detail = toPortalSubmissionDetail(getEnvelopeData(json));
          setSubmissionDetail(detail);
        }
      } catch (err) {
        console.error("Failed to load submission detail:", err);
      } finally {
        if (!cancelled) {
          setDetailLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const progressSteps = useMemo(() => {
    if (!submissionDetail?.sections) return [];
    
    const sectionSteps = submissionDetail.sections.map((section, index) => ({
      id: index + 1,
      title: section.title,
      description: section.description || "Complete this part of your application to move forward.",
      status: mapSubmissionStatusToProgressStatus(calculateSectionStatus(section, submissionDetail.essays)),
    }));
    
    return [
      ...sectionSteps,
      {
        id: sectionSteps.length + 1,
        title: "Preview",
        description: "Review your application before submission.",
        status: "upcoming" as const,
      },
    ];
  }, [submissionDetail]);

  const fallbackCurrentIndex = getCurrentStepIndex({ steps: progressSteps, currentStepTitle: null, progressPercentage: 0 });
  const currentIndex = currentStepIndex >= 0 ? Math.min(currentStepIndex, Math.max(0, progressSteps.length - 1)) : fallbackCurrentIndex;
  const completedSections = submissionDetail?.sections
    ? submissionDetail.sections.filter(section => calculateSectionStatus(section, submissionDetail.essays) === 'completed').length
    : 0;
  const totalSections = submissionDetail?.sections?.length ?? 0;
  const progressPercentage = totalSections > 0 ? Math.min(100, Math.max(0, Math.round((completedSections / totalSections) * 100))) : 0;
  const totalSteps = progressSteps.length;

  const chipTranslateX = progressPercentage <= 5 ? '0%' : progressPercentage >= 95 ? '-100%' : '-50%';

  const resolvedCurrentStep = progressSteps[currentIndex];
  const currentStepTitle = progressPercentage === 100
    ? "All Done"
    : resolvedCurrentStep?.title || activeApplication?.currentStep?.trim() || "Application Progress";

  return (
    <section className={overviewTheme.sectionWrapper}>
      {detailLoading ? (
        <DashboardPageSkeleton variant="overview-program-details" className="w-full" />
      ) : (
        <>
          <div className={overviewTheme.progressDetailHeaderRow}>
            <div>
              <h1 className={overviewTheme.progressDetailTitle}>Program Progress</h1>
              <p className={overviewTheme.progressDetailSubtitle}>
                Track your live submission sections and see exactly what is still pending.
              </p>
            </div>
            <div className={overviewTheme.progressDetailCurrentChip}>
              <span className={overviewTheme.progressDetailCurrentLabel}>Current step</span>
              <span className={overviewTheme.progressDetailCurrentValue}>
                {progressPercentage}% · Step {currentIndex + 1} of {totalSteps}: {currentStepTitle}
              </span>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

      <div className={overviewTheme.progressDetailListWrapper}>
        <div className={overviewTheme.programCard}>
          <div className={overviewTheme.progressSummaryWrapper}>
            <div className={overviewTheme.progressSummaryMainCol}>
              <div className={overviewTheme.progressBarWrapper}>
                <div className={overviewTheme.progressBarTrackOuter}>
                  <div className={overviewTheme.progressBarTrack}>
                    <div
                      className={overviewTheme.progressBarFill}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div
                    className={overviewTheme.progressStepChipFloating}
                    style={{ left: `${progressPercentage}%`, transform: `translateX(${chipTranslateX})` }}
                  >
                    <span className={overviewTheme.progressStepChip}>
                      {progressPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`${overviewTheme.progressTimeline} mt-4`}>
            {/* Garis vertikal */}
            <div className={overviewTheme.progressLineCol}>
              <div className={overviewTheme.progressLine} />
            </div>

            {/* Steps */}
            <div className={overviewTheme.progressStepsCol}>
              {progressSteps.map((step, idx) => {
                const isCurrent = idx === currentIndex;
                const isDone = step.status === "done";

                const indexCircleCls = isDone
                  ? overviewTheme.progressStepIndexDone
                  : isCurrent
                  ? overviewTheme.progressStepIndexCurrent
                  : overviewTheme.progressStepIndexUpcoming;

                const statusChipCls = isDone
                  ? overviewTheme.progressStatusChipDone
                  : isCurrent
                  ? overviewTheme.progressStatusChipWaiting
                  : overviewTheme.progressStatusChipUpcoming;

                const statusLabel = isDone
                  ? "Completed"
                  : isCurrent
                  ? "In Progress"
                  : "Not Yet";

                const isLast = idx === progressSteps.length - 1;

                return (
                  <div key={step.id} className={overviewTheme.progressStepRow}>
                    <div className={overviewTheme.progressStepIconCol}>
                      <div
                        className={`${overviewTheme.progressStepIndexCircleBase} ${indexCircleCls}`}
                      >
                        {idx + 1}
                      </div>
                      {!isLast && <div className={overviewTheme.progressStepConnector} />}
                    </div>

                    <div className={overviewTheme.progressStepContent}>
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                        <h2 className={overviewTheme.progressStepTitle}>{step.title}</h2>
                        <span
                          className={`${overviewTheme.progressStatusChipBase} ${statusChipCls}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <p className={overviewTheme.progressStepBody}>{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </section>
  );
}
