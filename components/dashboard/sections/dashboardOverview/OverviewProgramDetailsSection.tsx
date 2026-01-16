"use client";

import { jysSectionTheme } from "@/lib/theme/jys-components";

const overviewTheme = jysSectionTheme.dashboardOverview;

type ProgressStatus = "done" | "waiting" | "upcoming";

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  status: ProgressStatus;
}

const PROGRESS_STEPS: ProgressStep[] = [
  {
    id: 1,
    title: "Participant Registration",
    description: "Register an account and complete the registration form including payment.",
    status: "done",
  },
  {
    id: 2,
    title: "LoA Announcement",
    description: "Check your email and Instagram for more information.",
    status: "done",
  },
  {
    id: 3,
    title: "Onboarding Session",
    description: "The date of the onboarding session will be confirmed via email.",
    status: "waiting",
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

export default function OverviewProgramDetailsSection() {
  return (
    <div className={overviewTheme.programCard}>
      <div className={overviewTheme.programHeaderRow}>
        <div>
          <h2 className={overviewTheme.programTitle}>Your Progress</h2>
          <p className={overviewTheme.programSubtitle}>
            See which stage of the Japan Youth Summit journey you are currently in.
          </p>
        </div>
      </div>

      <div className={overviewTheme.progressTimeline}>
        {/* Line */}
        <div className={overviewTheme.progressLineCol}>
          <div className={overviewTheme.progressLine} />
        </div>

        {/* Steps */}
        <div className={overviewTheme.progressStepsCol}>
          {PROGRESS_STEPS.map((step, index) => {
            const isLast = index === PROGRESS_STEPS.length - 1;

            let indexCircleCls: string = overviewTheme.progressStepIndexUpcoming;
            let statusChipCls: string = overviewTheme.progressStatusChipUpcoming;
            let statusLabel = "Not Yet";

            if (step.status === "done") {
              indexCircleCls = overviewTheme.progressStepIndexDone;
              statusChipCls = overviewTheme.progressStatusChipDone;
              statusLabel = "Done";
            } else if (step.status === "waiting") {
              indexCircleCls = overviewTheme.progressStepIndexCurrent;
              statusChipCls = overviewTheme.progressStatusChipWaiting;
              statusLabel = "Waiting";
            }

            return (
              <div key={step.id} className={overviewTheme.progressStepRow}>
                <div className={overviewTheme.progressStepIconCol}>
                  <div
                    className={`${overviewTheme.progressStepIndexCircleBase} ${indexCircleCls}`}
                  >
                    {step.id}
                  </div>
                  {!isLast && <div className={overviewTheme.progressStepConnector} />}
                </div>

                <div className={overviewTheme.progressStepContent}>
                  <div className="flex items-center gap-2">
                    <h3 className={overviewTheme.progressStepTitle}>{step.title}</h3>
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
  );
}
