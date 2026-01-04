"use client";

import React from "react";
import { PencilLine } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import type { EntryInfo, PersonalDetails, ProfessionalProfile } from "../SubmissionEditSection";

const submissionTheme = jysSectionTheme.dashboardSubmission;

type Props = {
  personal: PersonalDetails;
  professional: ProfessionalProfile;
  entry: EntryInfo;
  onBack: () => void;
  onEditStep: (step: "Personal Details" | "Professional Profile" | "Entry Information") => void;
  onSubmitClick: () => void;
};

export default function SubmissionEditPreviewSection({
  personal,
  professional,
  entry,
  onBack,
  onEditStep,
  onSubmitClick,
}: Props) {
  return (
    <div className={submissionTheme.formSectionWrapper}>
      <div>
        <h2 className={submissionTheme.formSectionTitle}>Preview</h2>
        <p className={submissionTheme.formSectionSubtitle}>
          Final check of your information before submission.
        </p>
      </div>

      <div className={submissionTheme.previewWrapper}>
        <div className={submissionTheme.previewCard}>
          <div className={submissionTheme.previewCardHeader}>
            <h3 className={submissionTheme.previewCardTitle}>Personal Details</h3>
            <button
              type="button"
              onClick={() => onEditStep("Personal Details")}
              className={submissionTheme.previewEditButton}
            >
              <PencilLine className={submissionTheme.previewEditIcon} />
              <span>Edit</span>
            </button>
          </div>
          <dl className={submissionTheme.previewDefinitionList}>
            <div>
              <dt className={submissionTheme.previewDt}>Full Name</dt>
              <dd className={submissionTheme.previewDd}>{personal.fullName}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Nick Name</dt>
              <dd className={submissionTheme.previewDd}>{personal.nickName}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Gender</dt>
              <dd className={`${submissionTheme.previewDd} capitalize`}>{personal.gender}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Birthdate</dt>
              <dd className={submissionTheme.previewDd}>{personal.birthdate}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Nationality</dt>
              <dd className={submissionTheme.previewDd}>{personal.nationality}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Current Address</dt>
              <dd className={submissionTheme.previewDd}>{personal.currentAddress}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Phone Number</dt>
              <dd className={submissionTheme.previewDd}>{personal.phoneNumber}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Emergency Contact</dt>
              <dd className={submissionTheme.previewDd}>
                {personal.emergencyRelationship} – {personal.emergencyPhoneNumber}
              </dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>T-Shirt Size</dt>
              <dd className={submissionTheme.previewDd}>{personal.tshirtSize}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className={submissionTheme.previewDt}>Disease History</dt>
              <dd className={submissionTheme.previewDd}>{personal.diseaseHistory}</dd>
            </div>
          </dl>
        </div>

        <div className={submissionTheme.previewCard}>
          <div className={submissionTheme.previewCardHeader}>
            <h3 className={submissionTheme.previewCardTitle}>Professional Profile</h3>
            <button
              type="button"
              onClick={() => onEditStep("Professional Profile")}
              className={submissionTheme.previewEditButton}
            >
              <PencilLine className={submissionTheme.previewEditIcon} />
              <span>Edit</span>
            </button>
          </div>
          <dl className={submissionTheme.previewDefinitionList}>
            <div>
              <dt className={submissionTheme.previewDt}>Education Level</dt>
              <dd className={submissionTheme.previewDd}>{professional.educationLevel}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Institution</dt>
              <dd className={submissionTheme.previewDd}>{professional.institution}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Major</dt>
              <dd className={submissionTheme.previewDd}>{professional.major}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Organization</dt>
              <dd className={submissionTheme.previewDd}>{professional.organization}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className={submissionTheme.previewDt}>Experiences</dt>
              <dd className={submissionTheme.previewDdMultiline}>{professional.experiences}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className={submissionTheme.previewDt}>Achievements &amp; Rewards</dt>
              <dd className={submissionTheme.previewDdMultiline}>{professional.achievements}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Resume</dt>
              <dd className={submissionTheme.previewDd}>
                {professional.resumeName || "Not uploaded"}
              </dd>
            </div>
          </dl>
        </div>

        <div className={submissionTheme.previewCard}>
          <div className={submissionTheme.previewCardHeader}>
            <h3 className={submissionTheme.previewCardTitle}>Entry Information</h3>
            <button
              type="button"
              onClick={() => onEditStep("Entry Information")}
              className={submissionTheme.previewEditButton}
            >
              <PencilLine className={submissionTheme.previewEditIcon} />
              <span>Edit</span>
            </button>
          </div>
          <dl className={submissionTheme.previewDefinitionList}>
            <div>
              <dt className={submissionTheme.previewDt}>Participation Category</dt>
              <dd className={submissionTheme.previewDd}>{entry.participationCategory}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Program Subtheme</dt>
              <dd className={submissionTheme.previewDd}>{entry.programSubtheme}</dd>
            </div>
            <div>
              <dt className={submissionTheme.previewDt}>Knowledge Source</dt>
              <dd className={submissionTheme.previewDd}>{entry.knowledgeSource}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={submissionTheme.buttonRow}>
        <button
          type="button"
          className={submissionTheme.secondaryButton}
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className={submissionTheme.primaryButton}
          onClick={onSubmitClick}
        >
          Submit Changes
        </button>
      </div>
    </div>
  );
}
