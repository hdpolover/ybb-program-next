"use client";

import { ArrowLeftRight, GraduationCap } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const overviewTheme = jysSectionTheme.dashboardOverview;

export default function OverviewRegistrationSection() {
  return (
    <div className={overviewTheme.registrationCard}>
      <div className="flex flex-wrap items-start gap-4">
        <div className={overviewTheme.registrationIconCircle}>
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className={overviewTheme.registrationBodyWrapper}>
          <div className={overviewTheme.registrationHeaderRow}>
            <div>
              <h2 className={overviewTheme.registrationTitle}>Your Registration Category</h2>
              <p className={overviewTheme.registrationSubtitle}>Fully Funded Participant</p>
            </div>
          </div>

          <p className={overviewTheme.registrationDescription}>
            You're registered as a Fully Funded participant. Complete all requirements including essays
            and interviews. You'll pay program fees in scheduled batches, and if selected after the
            evaluation process, all your payments will be reimbursed.
          </p>

          <div className={overviewTheme.registrationFooterRow}>
            <div className="flex items-start gap-2">
              <div className={overviewTheme.registrationSwitchIconCircle}>
                <ArrowLeftRight className="h-3.5 w-3.5" />
              </div>
              <p className={overviewTheme.registrationSwitchText}>
                <span className="font-semibold">Switch Available:</span> You can switch to Self Funded
                registration for guaranteed program participation with standard payment requirements.
              </p>
            </div>

            <button
              type="button"
              className={overviewTheme.registrationSwitchButton}
            >
              <ArrowLeftRight className="h-4 w-4" />
              <span>Switch to Self Funded</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
