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
            Funding, delegates must complete all registration steps and fulfill payment by the specified deadline.
          </p>

          <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-700">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span>
              If not selected as fully funded, I agree to continue as a self-funded participant with a non-refundable
              payment.
            </span>
          </label>

          <label className="flex items-start gap-2 text-xs leading-relaxed text-slate-700">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-pink-600 focus:ring-pink-500"
            />
            <span>
              I understand that this program is for educational purposes only and does not guarantee visa approval,
              which is solely determined by the embassy.
            </span>
          </label>
        </div>

        <div className="mt-6 flex justify-center">
          <a href="/dashboard/payments" className={submissionTheme.modalPrimaryLink}>
            Go to Payment
          </a>
        </div>
      </div>
    </div>
  );
}
