"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const overviewTheme = jysSectionTheme.dashboardOverview;

type ProgressStatus = "done" | "waiting" | "upcoming";

export interface ProgressStep {
  id: number;
  title: string;
  description: string;
  status: ProgressStatus;
  processingPeriod?: string;
  estimatedRelease?: string;
}

export const PROGRESS_STEPS: ProgressStep[] = [
  {
    id: 1,
    title: "Participant Registration",
    description: "Register an account and complete the registration form including payment.",
    status: "done",
  },
  {
    id: 2,
    title: "LoA Announcement",
    description:
      "Your application has passed the registration review stage. The Letter of Acceptance (LoA) is currently being prepared by the YBB team.",
    status: "done",
    processingPeriod: "223 January 2026",
    estimatedRelease: "24 January 2026",
  },
  {
    id: 3,
    title: "Onboarding Session",
    description: "The date of the onboarding session will be confirmed via email.",
    status: "waiting",
    processingPeriod: "To be announced",
    estimatedRelease: "See official email",
  },
  {
    id: 4,
    title: "First Payment",
    description:
      "Program fees are available when the payment period begins and after you complete the registration fee.",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Mentoring",
    description: "Participants will receive mentoring after the first stage of payment.",
    status: "upcoming",
  },
  {
    id: 6,
    title: "Second Payment",
    description:
      "Participants must complete the second installment after the mentoring session to proceed.",
    status: "upcoming",
  },
  {
    id: 7,
    title: "Fully Funded Candidate Interview Announcement",
    description: "Selected fully funded candidates are invited to attend the interview stage.",
    status: "upcoming",
  },
  {
    id: 8,
    title: "Interview Fully Funded Candidates",
    description: "Interview session for shortlisted fully funded candidates.",
    status: "upcoming",
  },
  {
    id: 9,
    title: "Final Announcement of Fully Funded Candidates",
    description: "Final results for fully funded candidates who have been selected.",
    status: "upcoming",
  },
  {
    id: 10,
    title: "Japan Youth Summit Program",
    description:
      "The Japan Youth Summit program will take place on February 2 - 5, 2026, in Osaka & Kyoto, Japan.",
    status: "upcoming",
  },
];

interface OverviewProgramDetailsSectionProps {
  showSeeDetailsButton?: boolean;
}

export default function OverviewProgramDetailsSection({
  showSeeDetailsButton = true,
}: OverviewProgramDetailsSectionProps) {
  const router = useRouter();

  const totalSteps = PROGRESS_STEPS.length;
  const currentIndex = Math.max(
    0,
    PROGRESS_STEPS.findIndex(step => step.status === "waiting")
  );
  const currentStep = PROGRESS_STEPS[currentIndex] ?? PROGRESS_STEPS[0];

  const completedCount = PROGRESS_STEPS.filter(step => step.status === "done").length;
  const progressRatio = totalSteps > 0 ? (completedCount + 1) / totalSteps : 0;

  const statusLabel =
    currentStep.status === "done"
      ? "Completed"
      : currentStep.status === "waiting"
      ? "In Progress"
      : "Upcoming";

  const progressPercentage = Math.min(100, Math.max(0, Math.round(progressRatio * 100)));

  return (
    <div className={overviewTheme.programCard}>
      <div className={overviewTheme.programHeaderRow}>
        <div>
          <h2 className={overviewTheme.programTitle}>Your Progress</h2>
          <p className={overviewTheme.programSubtitle}>
            See which stage of the Japan Youth Summit journey you are currently in.
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
                  Step {currentIndex + 1}/{totalSteps}
                </span>
              </div>
            </div>
          </div>

          <div className={overviewTheme.progressCurrentDetailWrapper}>
            <span className={overviewTheme.progressStatusPill}>{statusLabel}</span>
            <h3 className={overviewTheme.progressCurrentTitle}>{currentStep.title}</h3>
            <p className={overviewTheme.progressCurrentBody}>{currentStep.description}</p>
            {(currentStep.processingPeriod || currentStep.estimatedRelease) && (
              <ul className={overviewTheme.progressMetaList}>
                {currentStep.processingPeriod && (
                  <li className={overviewTheme.progressMetaItem}>
                    <CalendarDays className={overviewTheme.progressMetaIcon} />
                    <span>
                      <span className={overviewTheme.progressMetaLabel}>Processing period:</span>{" "}
                      {currentStep.processingPeriod}
                    </span>
                  </li>
                )}
                {currentStep.estimatedRelease && (
                  <li className={overviewTheme.progressMetaItem}>
                    <Clock3 className={overviewTheme.progressMetaIcon} />
                    <span>
                      <span className={overviewTheme.progressMetaLabel}>Estimated release:</span>{" "}
                      {currentStep.estimatedRelease}
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
