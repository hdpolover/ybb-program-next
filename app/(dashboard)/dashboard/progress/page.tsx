"use client";

import { PROGRESS_STEPS, type ProgressStep } from "@/components/dashboard/sections/dashboardOverview/OverviewProgramDetailsSection";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const overviewTheme = jysSectionTheme.dashboardOverview;

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

  const { step: currentStep, index: currentIndex } = getCurrentStep(PROGRESS_STEPS);
  const totalSteps = PROGRESS_STEPS.length;
  const completedCount = PROGRESS_STEPS.filter(step => step.status === "done").length;
  const progressRatio = totalSteps > 0 ? (completedCount + 1) / totalSteps : 0;
  const fallbackProgressPercentage = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));

  const progressPercentage =
    typeof activeApplication?.progress === "number" && !Number.isNaN(activeApplication.progress)
      ? Math.min(100, Math.max(0, Math.round(activeApplication.progress)))
      : fallbackProgressPercentage;

  const currentStepTitle = activeApplication?.currentStep?.trim() || currentStep.title;

  return (
    <section className={overviewTheme.sectionWrapper}>
      <div className={overviewTheme.progressDetailHeaderRow}>
        <div>
          <h1 className={overviewTheme.progressDetailTitle}>Program Progress</h1>
          <p className={overviewTheme.progressDetailSubtitle}>
            Track every stage of your Japan Youth Summit journey and see where you are right now.
          </p>
        </div>
        <div className={overviewTheme.progressDetailCurrentChip}>
          <span className={overviewTheme.progressDetailCurrentLabel}>Current step</span>
          <span className={overviewTheme.progressDetailCurrentValue}>
            Step {currentIndex + 1} of {totalSteps}: {currentStepTitle}
          </span>
        </div>
      </div>

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
              {PROGRESS_STEPS.map((step, idx) => {
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

                const isLast = idx === PROGRESS_STEPS.length - 1;

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
