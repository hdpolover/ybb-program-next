"use client";



import { CalendarDays } from "lucide-react";

import { useRouter } from "next/navigation";

import { useMemo } from "react";

import { useDashboardData } from "@/components/dashboard/DashboardDataContext";

import { usePortalSubmissionProgress } from "@/hooks/usePortalSubmissionProgress";

import { componentsTheme } from "@/lib/theme/components";

import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";



const overviewTheme = componentsTheme.dashboardOverview;



type ProgressStatus = "done" | "waiting" | "upcoming";



export interface ProgressStep {

  id: number;

  title: string;

  description: string;

  status: ProgressStatus;

  processingPeriod?: string;

  estimatedRelease?: string;

}



export function mapSubmissionStatusToProgressStatus(status?: string): ProgressStatus {

  if (status === "completed") return "done";

  if (status === "in_progress") return "waiting";

  return "upcoming";

}



export function buildProgressSteps(

  sections: Array<{ id: string; title: string; description?: string; status?: string }> | null | undefined,

): ProgressStep[] {

  if (!sections?.length) {

    return [

      {

        id: 1,

        title: "Application Progress",

        description: "Your submission progress will appear here once the application form is available.",

        status: "upcoming",

      },

    ];

  }



  return sections.map((section, index) => ({

    id: index + 1,

    title: section.title,

    description: section.description || "Complete this part of your application to move forward.",

    status: mapSubmissionStatusToProgressStatus(section.status),

  }));

}



export function getClampedProgressPercentage({

  progress,

  currentStep,

  fallbackProgressPercentage,

}: {

  progress: unknown;

  currentStep: unknown;

  fallbackProgressPercentage: number;

}) {

  const hasCurrentStep = typeof currentStep === "string" && currentStep.trim().length > 0;



  if (typeof progress !== "number" || Number.isNaN(progress)) {

    return fallbackProgressPercentage;

  }



  const rounded = Math.round(progress);

  const clamped = Math.min(100, Math.max(0, rounded));



  if (clamped === 0 && hasCurrentStep) {

    return fallbackProgressPercentage;

  }



  return clamped;

}



interface OverviewProgramDetailsSectionProps {

  showSeeDetailsButton?: boolean;

}



export default function OverviewProgramDetailsSection({

  showSeeDetailsButton = true,

}: OverviewProgramDetailsSectionProps) {

  const router = useRouter();

  const { dashboardSummary, isDashboardSummaryLoading } = useDashboardData();

  const activeApplication = dashboardSummary?.activeApplication ?? null;

  const { submissionProgress, currentStepIndex, loading } = usePortalSubmissionProgress();



  const progressSteps = useMemo(() => buildProgressSteps(submissionProgress?.sections), [submissionProgress?.sections]);



  const totalSteps = progressSteps.length;

  const currentIndex = Math.min(currentStepIndex, Math.max(0, totalSteps - 1));

  const currentStep = progressSteps[currentIndex] ?? progressSteps[0];



  const completedCount = progressSteps.filter(step => step.status === "done").length;

  const progressRatio = totalSteps > 0 ? completedCount / totalSteps : 0;



  const fallbackProgressPercentage = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));



  const progressPercentage = useMemo(() => {

    const pct = submissionProgress?.overallProgress ?? activeApplication?.progress;

    if (typeof pct !== "number" || Number.isNaN(pct)) return fallbackProgressPercentage;

    return Math.min(100, Math.max(0, Math.round(pct)));

  }, [activeApplication?.progress, fallbackProgressPercentage, submissionProgress?.overallProgress]);



  const currentTitle = currentStep?.title || activeApplication?.currentStep?.trim() || "Application Progress";



  const currentBody = useMemo(() => {

    if (currentStep?.description) {

      return currentStep.description;

    }

    if (activeApplication?.currentStep?.trim()) {

      return "Continue your application to complete the next requirements.";

    }

    return "Complete the remaining submission sections to move your application forward.";

  }, [activeApplication?.currentStep, currentStep?.description]);



  const metaProcessingText = useMemo(() => {

    const days = activeApplication?.daysUntilDeadline;

    if (typeof days === "number" && !Number.isNaN(days)) {

      return `${days} days until deadline`;

    }

    return null;

  }, [activeApplication?.daysUntilDeadline]);



  const statusLabel = useMemo(() => {

    if (!currentStep) return "Upcoming";

    if (currentStep.status === "done") return "Completed";

    if (currentStep.status === "waiting") return "In Progress";

    return "Upcoming";

  }, [currentStep]);



  if (isDashboardSummaryLoading || loading) {

    return <DashboardPageSkeleton variant="overview-program-details" className="w-full" />;

  }



  return (

    <div className={overviewTheme.programCard}>

      <div className={overviewTheme.programHeaderRow}>

        <div>

          <h2 className={overviewTheme.programTitle}>Your Progress</h2>

          <p className={overviewTheme.programSubtitle}>

            See which submission sections are done and what still needs attention.

          </p>

        </div>

        {showSeeDetailsButton && (

          <button

            type="button"

            className={overviewTheme.progressSeeDetailsButton}

            onClick={() => router.push("/dashboard/progress")}

          >

            See Details

          </button>

        )}

      </div>



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



          <div className={overviewTheme.progressCurrentDetailWrapper}>

            <span className={overviewTheme.progressStatusPill}>{statusLabel}</span>

            <h3 className={overviewTheme.progressCurrentTitle}>{currentTitle}</h3>

            <p className={overviewTheme.progressCurrentBody}>{currentBody}</p>

            {metaProcessingText && (

              <ul className={overviewTheme.progressMetaList}>

                {metaProcessingText && (

                  <li className={overviewTheme.progressMetaItem}>

                    <CalendarDays className={overviewTheme.progressMetaIcon} />

                    <span>

                      <span className={overviewTheme.progressMetaLabel}>Deadline:</span>{" "}

                      {metaProcessingText}

                    </span>

                  </li>

                )}

              </ul>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

