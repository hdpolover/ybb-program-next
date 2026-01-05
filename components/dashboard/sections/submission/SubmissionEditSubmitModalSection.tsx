"use client";

import React from "react";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const submissionTheme = jysSectionTheme.dashboardSubmission;

type Props = {
  onClose: () => void;
};

export default function SubmissionEditSubmitModalSection({ onClose }: Props) {
  return (
    <div className={submissionTheme.modalOverlay}>
      <div className={submissionTheme.modalCard}>
        <h2 className={submissionTheme.modalTitle}>Application Preview</h2>
        <div className={submissionTheme.modalBody}>
          <p>
            The Japan Youth Summit provides both Fully Funded and Self-Funded Opportunities. To qualify for Full
            Funding, delegates must complete all registration steps and fulfill payment by the specified deadline. If
            not selected for Full Funding, delegates can still participate through a self-funded scheme.
          </p>
          <p>
            With a delegate quota limited to only 200 youth, let's join hands and collaborate at the Japan Youth
            Summit 2026. Your contribution is essential for a shared and impactful experience.
          </p>
          <p className={submissionTheme.modalBodyHighlight}>
            I am ready to join the Japan Youth Summit 2026 in Kyoto, Japan.
          </p>
        </div>

        <div className={submissionTheme.modalButtonRow}>
          <button
            type="button"
            className={submissionTheme.modalSecondaryButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <a href="/dashboard/payments" className={submissionTheme.modalPrimaryLink}>
            Go To Payment Page
          </a>
        </div>
      </div>
    </div>
  );
}
