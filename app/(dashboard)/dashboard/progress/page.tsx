"use client";

import { buildProgressSteps, type ProgressStep } from "@/components/dashboard/sections/dashboardOverview/OverviewProgramDetailsSection";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { usePortalSubmissionProgress } from "@/hooks/usePortalSubmissionProgress";
import { componentsTheme } from "@/lib/theme/components";

const overviewTheme = componentsTheme.dashboardOverview;

function normalizeStepTitle(value: string) {
  return value.trim().toLowerCase();
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
  const { submissionProgress, currentStepIndex, loading, error } = usePortalSubmissionProgress();
  const progressSteps = buildProgressSteps(submissionProgress?.sections);

  const fallbackCurrentIndex = getCurrentStepIndex({ steps: progressSteps, currentStepTitle: null, progressPercentage: 0 });
  const currentIndex = currentStepIndex >= 0 ? Math.min(currentStepIndex, Math.max(0, progressSteps.length - 1)) : fallbackCurrentIndex;
  const totalSteps = progressSteps.length;
  const completedCount = progressSteps.filter(step => step.status === "done").length;
  const progressRatio = totalSteps > 0 ? (completedCount + 1) / totalSteps : 0;
  const fallbackProgressPercentage = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));

  const progressPercentage =
    typeof submissionProgress?.overallProgress === "number" && !Number.isNaN(submissionProgress.overallProgress)
      ? Math.min(100, Math.max(0, Math.round(submissionProgress.overallProgress)))
      : typeof activeApplication?.progress === "number" && !Number.isNaN(activeApplication.progress)
      ? Math.min(100, Math.max(0, Math.round(activeApplication.progress)))
      : fallbackProgressPercentage;

  const resolvedCurrentStep = progressSteps[currentIndex];
  const currentStepTitle = resolvedCurrentStep?.title || activeApplication?.currentStep?.trim() || "Application Progress";

  return (
    <section className={overviewTheme.sectionWrapper}>
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

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 shadow-sm">
          Loading progress...
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
                    style={{ left: `${progressPercentage}%` }}
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
                const isDone = idx < currentIndex;

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
    </section>
  );
}
