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

export default function SubmissionReadEntryInformationSection() {
  const base = inputBaseClass();
  const entry = DUMMY_ENTRY_INFO;
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
            <input type="text" className={`${base} pl-9`} defaultValue={entry.participationCategory} readOnly />
          </InputWrapper>
        </Field>
        <Field label="Program Subtheme">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input type="text" className={`${base} pl-9`} defaultValue={entry.programSubtheme} readOnly />
          </InputWrapper>
        </Field>
        <Field label="Knowledge Source">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input type="text" className={`${base} pl-9`} defaultValue={entry.knowledgeSource} readOnly />
          </InputWrapper>
        </Field>
      </div>

      {/* Essay information (read-only) */}
      <div className={submissionTheme.readEssaySectionWrapper}>
        <div>
          <h3 className={submissionTheme.readEssaySectionTitle}>
            Main Essay Question
          </h3>
        </div>

        <div className={submissionTheme.readEssayFieldWrapper}>
          <Field label="Essay Title">
            <InputWrapper icon={<Info className="h-4 w-4" />}>
              <input type="text" className={`${base} pl-9`} defaultValue={entry.essayTitle} readOnly />
            </InputWrapper>
          </Field>
        </div>

        <div className={submissionTheme.readEssayFieldWrapper}>
          <Field label="Essay (Main Answer)">
            <textarea
              className={`${submissionTheme.essayTextarea} ${submissionTheme.readEssayTextarea}`}
              readOnly
              defaultValue={entry.mainEssay}
            />
          </Field>
        </div>

        <div className={submissionTheme.readEssayFieldWrapper}>
          <Field label="Keywords">
            <div className={submissionTheme.readEssayKeywordRow}>
              {entry.keywords.map(keyword => (
                <span
                  key={keyword}
                  className={submissionTheme.readEssayKeywordChip}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Field>
        </div>

        <div className={submissionTheme.readEssayFieldWrapper}>
          <Field label="Reference">
            <textarea
              className={`${submissionTheme.essayTextarea} ${submissionTheme.readEssayTextarea}`}
              readOnly
              defaultValue={entry.reference}
            />
          </Field>
        </div>
      </div>
    </section>
  );
}
