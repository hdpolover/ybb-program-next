"use client";

import { CheckCircle2, CreditCard, MapPin } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const overviewTheme = jysSectionTheme.dashboardOverview;

export default function OverviewProgramDetailsSection() {
  return (
    <div className={overviewTheme.programCard}>
      <div className={overviewTheme.programHeaderRow}>
        <div>
          <h2 className={overviewTheme.programTitle}>Program Details</h2>
          <p className={overviewTheme.programSubtitle}>
            Learn the difference between Self-funded and Fully Funded registration types.
          </p>
        </div>
      </div>

      <div className={overviewTheme.programGrid}>
        {/* Self-funded card */}
        <div className={overviewTheme.programSelfCard}>
          <div className={overviewTheme.programSelfInner}>
            <div className={overviewTheme.programSelfHeaderRow}>
              <div className={overviewTheme.programSelfIconCircle}>
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <h3 className={overviewTheme.programSelfTitle}>Self-funded</h3>
                <p className={overviewTheme.programSelfSubtitle}>Standard Registration</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className={overviewTheme.programSelfSectionLabel}>Benefit</p>
              <ul className={overviewTheme.programSelfBenefitList}>
                <li className={overviewTheme.programSelfBenefitItem}>
                  <CheckCircle2 className={overviewTheme.programSelfBenefitIcon} />
                  <span>Guaranteed program participation</span>
                </li>
                <li className={overviewTheme.programSelfBenefitItem}>
                  <CheckCircle2 className={overviewTheme.programSelfBenefitIcon} />
                  <span>Faster application processing</span>
                </li>
                <li className={overviewTheme.programSelfBenefitItem}>
                  <CheckCircle2 className={overviewTheme.programSelfBenefitIcon} />
                  <span>No competitive selection required</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <p className={overviewTheme.programSelfSectionLabel}>Payment</p>
              <p className={overviewTheme.programSelfPaymentText}>
                You pay all scheduled fee batches yourself
              </p>
            </div>
          </div>
        </div>

        {/* Fully Funded card */}
        <div className={overviewTheme.programFullyCard}>
          <div className={overviewTheme.programFullyInner}>
            <div className={overviewTheme.programFullyHeaderRow}>
              <div className={overviewTheme.programFullyIconCircle}>
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className={overviewTheme.programFullyTitle}>Fully Funded</h3>
                <p className={overviewTheme.programFullySubtitle}>Reimbursement System</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className={overviewTheme.programFullySectionLabel}>Benefit (If selected)</p>
              <ul className={overviewTheme.programFullyBenefitList}>
                <li className={overviewTheme.programFullyBenefitItem}>
                  <CheckCircle2 className={overviewTheme.programFullyBenefitIcon} />
                  <span>Full reimbursement of all payment.</span>
                </li>
                <li className={overviewTheme.programFullyBenefitItem}>
                  <CheckCircle2 className={overviewTheme.programFullyBenefitIcon} />
                  <span>Enhanced program recognition</span>
                </li>
                <li className={overviewTheme.programFullyBenefitItem}>
                  <CheckCircle2 className={overviewTheme.programFullyBenefitIcon} />
                  <span>Access to exclusive fully funded activities.</span>
                </li>
                <li className={overviewTheme.programFullyBenefitItem}>
                  <CheckCircle2 className={overviewTheme.programFullyBenefitIcon} />
                  <span>Additional mentorship opportunities</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <p className={overviewTheme.programFullySectionLabel}>Payment</p>
              <p className={overviewTheme.programFullyPaymentText}>
                Pay scheduled batches initially, get full refund if selected
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
