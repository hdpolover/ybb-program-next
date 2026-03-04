"use client";

import { Award, BriefcaseBusiness, FileText, Info, MapPin, Users } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import { DUMMY_PROFESSIONAL_PROFILE } from "../SubmissionEditSection";

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

export default function SubmissionReadProfessionalProfileSection() {
  const base = inputBaseClass();
  const professional = DUMMY_PROFESSIONAL_PROFILE;
  return (
    <section className={submissionTheme.readSectionWrapper}>
      <div>
        <h2 className={submissionTheme.readSectionHeader}>
          <span className={submissionTheme.readSectionIconCircle}>
            <BriefcaseBusiness className="h-3.5 w-3.5" />
          </span>
          <span>Professional Profile</span>
        </h2>
        <p className={submissionTheme.readSectionSubtitle}>
          Tell us about your education and experience.
        </p>
      </div>

      <div className={submissionTheme.readGrid}>
        <Field label="Education Level">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue={professional.educationLevel}
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Institution">
          <InputWrapper icon={<MapPin className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue={professional.institution}
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Major">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue={professional.major}
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Organization">
          <InputWrapper icon={<Users className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9`}
              defaultValue={professional.organization}
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Experiences">
          <InputWrapper icon={<BriefcaseBusiness className="h-4 w-4" />}>
            <textarea
              rows={3}
              className={`${base} pl-9`}
              defaultValue={professional.experiences}
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Achievements &amp; Rewards">
          <InputWrapper icon={<Award className="h-4 w-4" />}>
            <textarea
              rows={3}
              className={`${base} pl-9`}
              defaultValue={professional.achievements}
              readOnly
            />
          </InputWrapper>
        </Field>
        <Field label="Resume (PDF)">
          <InputWrapper icon={<FileText className="h-4 w-4" />}>
            <input
              type="file"
              accept="application/pdf"
              className={`${base} pl-9`}
              disabled
            />
          </InputWrapper>
        </Field>
      </div>
    </section>
  );
}
