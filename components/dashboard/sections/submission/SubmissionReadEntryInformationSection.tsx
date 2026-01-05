"use client";

import { Info } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const submissionTheme = jysSectionTheme.dashboardSubmission;

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

export default function SubmissionReadEntryInformationSection() {
  const base = inputBaseClass();
  return (
    <section className={submissionTheme.readSectionWrapper}>
      <div>
        <h2 className={submissionTheme.readSectionHeader}>
          <span className={submissionTheme.readSectionIconCircle}>
            <Info className="h-3.5 w-3.5" />
          </span>
          <span>Entry Information</span>
        </h2>
        <p className={submissionTheme.readSectionSubtitle}>
          Basic details about how you join the program.
        </p>
      </div>

      <div className={submissionTheme.readGrid}>
        <Field label="Participation Category">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue="Social Innovation — Youth Leadership"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Program Subtheme">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue="SDG 3: Good Health and Well-being"
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Knowledge Source">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue="Instagram Ads"
              readOnly
            />
          </InputWrapper>
        </Field>
      </div>
    </section>
  );
}
