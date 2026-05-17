"use client";



import { CalendarDays } from "lucide-react";

import { useRouter } from "next/navigation";

import { useMemo, useRef, useEffect, useState } from "react";

import { useDashboardData } from "@/components/dashboard/DashboardDataContext";

import { usePortalSubmissionProgress } from "@/hooks/usePortalSubmissionProgress";

import { componentsTheme } from "@/lib/theme/components";

import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";

import {
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import { getEnvelopeData } from "@/lib/api/response";
import { toPortalSubmissionDetail } from "@/lib/dashboard/submissionParser";
import type { PortalSubmissionDetail, PortalSubmissionSection, PortalSubmissionEssay } from "@/types/portal-submission";



const overviewTheme = componentsTheme.dashboardOverview;

function calculateSectionStatus(section: PortalSubmissionSection, essays?: PortalSubmissionEssay[]): 'pending' | 'in_progress' | 'completed' {
  const relevant = section.fields.filter(f => f.type !== 'header' && f.type !== 'divider' && f.isRequired);
  if (relevant.length === 0) {
    // If no fields, check if this is essay section
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

  const { currentStepIndex } = usePortalSubmissionProgress();
  const [submissionDetail, setSubmissionDetail] = useState<PortalSubmissionDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const loadedApplicationIdRef = useRef<string | null>(null);

  // Load submission detail for client-side status calculation
  useEffect(() => {
    const selectedProgramId = readActiveProgramId();
    if (!selectedProgramId) return;

    let cancelled = false;

    // Reset state if program changed
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
    
    return submissionDetail.sections.map((section, index) => ({
      id: index + 1,
      title: section.title,
      description: section.description || "Complete this part of your application to move forward.",
      status: mapSubmissionStatusToProgressStatus(calculateSectionStatus(section, submissionDetail.essays)),
    }));
  }, [submissionDetail]);



  const totalSteps = progressSteps.length;

  const currentIndex = Math.min(currentStepIndex, Math.max(0, totalSteps - 1));

  const currentStep = progressSteps[currentIndex] ?? progressSteps[0];



  const completedCount = progressSteps.filter(step => step.status === "done").length;

  const progressRatio = totalSteps > 0 ? completedCount / totalSteps : 0;

  const progressPercentage = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));
  const progressChipPosition = Math.min(96, Math.max(4, progressPercentage));



  const currentTitle = progressPercentage === 100
    ? "All Done"
    : currentStep?.title || activeApplication?.currentStep?.trim() || "Application Progress";



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

  const statusPillColor = useMemo(() => {
    if (!currentStep) return "bg-slate-50 text-slate-600 ring-slate-200";
    if (currentStep.status === "done") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    if (currentStep.status === "waiting") return "bg-amber-50 text-amber-700 ring-amber-200";
    return "bg-slate-50 text-slate-600 ring-slate-200";
  }, [currentStep]);



  if (isDashboardSummaryLoading || detailLoading) {

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

                style={{ left: `${progressChipPosition}%`, transform: "translateX(-50%)" }}

              >

                <span className={overviewTheme.progressStepChip}>

                  {progressPercentage}%

                </span>

              </div>

            </div>

          </div>



          <div className={overviewTheme.progressCurrentDetailWrapper}>

            <span className={`${overviewTheme.progressStatusPill} ${statusPillColor}`}>{statusLabel}</span>

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
