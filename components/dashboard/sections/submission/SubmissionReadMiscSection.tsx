"use client";

import { Info } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import { DUMMY_ENTRY_INFO } from "../SubmissionEditSection";

const submissionTheme = componentsTheme.dashboardSubmission;

function InputWrapper({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={submissionTheme.readInputWrapper}>
      <span className={submissionTheme.readInputIcon}>{icon}</span>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={submissionTheme.readFieldLabelWrapper}>
      <span className={submissionTheme.readFieldLabelText}>{label}</span>
      {children}
    </label>
  );
}

function inputBaseClass() {
  return submissionTheme.readInputBase;
}

export default function SubmissionReadMiscSection() {
  const base = inputBaseClass();
  const entry = DUMMY_ENTRY_INFO;

  return (
    <section className={submissionTheme.readSectionWrapper}>
      <div>
        <h2 className={submissionTheme.readSectionHeader}>
          <span className={submissionTheme.readSectionIconCircle}>
            <Info className="h-3.5 w-3.5" />
          </span>
          <span>Miscellaneous</span>
        </h2>
        <p className={submissionTheme.readSectionSubtitle}>
          Additional information related to your social media and campaign.
        </p>
      </div>

      <div className={submissionTheme.readGrid}>
        <Field label="Instagram Account">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue={entry.instagramAccount ?? ""}
              readOnly
            />
          </InputWrapper>
        </Field>

        <Field label="Knowledge Source">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue={entry.miscKnowledgeSource ?? ""}
              readOnly
            />
          </InputWrapper>
        </Field>

        <Field label="Source Account Name">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue={entry.sourceAccountName ?? ""}
              readOnly
            />
          </InputWrapper>
        </Field>

        <Field label="Twibbon Link">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="url"
              className={`${base} pl-9`}
              defaultValue={entry.twibbonLink ?? ""}
              readOnly
            />
          </InputWrapper>
        </Field>

        <Field label="Requirement Link">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="url"
              className={`${base} pl-9`}
              defaultValue={entry.requirementLink ?? ""}
              readOnly
            />
          </InputWrapper>
        </Field>

        <Field label="Ambassador Referral Code (Optional)">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue={entry.ambassadorReferralCode ?? ""}
              readOnly
            />
          </InputWrapper>
        </Field>
      </div>
    </section>
  );
}
