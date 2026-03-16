"use client";

import { buildProgressSteps, type ProgressStep } from "@/components/dashboard/sections/dashboardOverview/OverviewProgramDetailsSection";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { usePortalSubmissionProgress } from "@/hooks/usePortalSubmissionProgress";
import { componentsTheme } from "@/lib/theme/components";

const overviewTheme = componentsTheme.dashboardOverview;

function getCurrentStep(steps: ProgressStep[]) {
  const waitingIndex = steps.findIndex(step => step.status === "waiting");
  if (waitingIndex !== -1) return { step: steps[waitingIndex], index: waitingIndex };

  const doneIndex = steps.findLastIndex(step => step.status === "done");
  if (doneIndex !== -1) return { step: steps[doneIndex], index: doneIndex };

  return { step: steps[0], index: 0 };
}

export default function DashboardProgressPage() {
  const { dashboardSummary } = useDashboardData();
  const activeApplication = dashboardSummary?.activeApplication ?? null;
  const { submissionProgress, currentStepIndex, loading, error } = usePortalSubmissionProgress();
  const progressSteps = buildProgressSteps(submissionProgress?.sections);

  const { step: currentStep, index: fallbackCurrentIndex } = getCurrentStep(progressSteps);
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

  const resolvedCurrentStep = progressSteps[currentIndex] ?? currentStep;
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
            Step {currentIndex + 1} of {totalSteps}: {currentStepTitle}
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
                      Step {currentIndex + 1}/{totalSteps}
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
                      <div className="flex items-center gap-2">
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
