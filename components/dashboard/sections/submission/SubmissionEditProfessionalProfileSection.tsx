"use client";

import React from "react";
import { Award, BriefcaseBusiness, Info, MapPin, Upload, Users } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import type { ProfessionalProfile } from "../SubmissionEditSection";
import StyledSelect from "@/components/ui/StyledSelect";

const submissionTheme = componentsTheme.dashboardSubmission;

function InputWrapper({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className={submissionTheme.editInputWrapper}>
      <span className={submissionTheme.editInputIcon}>{icon}</span>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className={submissionTheme.editFieldLabelWrapper}>
      <span className={submissionTheme.editFieldLabelText}>{label}</span>
      {children}
    </label>
  );
}

function inputBaseClass() {
  return submissionTheme.editInputBase;
}

type Props = {
  professional: ProfessionalProfile;
  onChangeProfessional: (value: ProfessionalProfile) => void;
  showErrors: boolean;
  onBack: () => void;
  onSaveAndContinue: () => void;
};

export default function SubmissionEditProfessionalProfileSection({
  professional,
  onChangeProfessional,
  showErrors,
  onBack,
  onSaveAndContinue,
}: Props) {
  const base = inputBaseClass();
  const educationLevelOptions = React.useMemo(
    () => [
      { value: "SD", label: "SD (Primary School)" },
      { value: "SMP", label: "SMP (Junior High School)" },
      { value: "SMA/SMK", label: "SMA / SMK" },
      { value: "Diploma", label: "Diploma (D1–D3)" },
      { value: "Bachelor's (S1)", label: "Bachelor's (S1)" },
      { value: "Master's (S2)", label: "Master's (S2)" },
      { value: "Doctoral (S3)", label: "Doctoral (S3)" },
    ],
    [],
  );

  return (
    <div className={submissionTheme.formSectionWrapper}>
      <div>
        <h2 className={submissionTheme.formSectionTitle}>Professional Profile</h2>
        <p className={submissionTheme.formSectionSubtitle}>
          Update your education and professional background.
        </p>
      </div>

      <div className={submissionTheme.formGrid}>
        <Field label="Education Level">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <StyledSelect
              value={professional.educationLevel}
              onChange={value =>
                onChangeProfessional({
                  ...professional,
                  educationLevel: value,
                })
              }
              options={educationLevelOptions}
              placeholder="Select education level"
              className={`${base} pl-9 ${
                showErrors && !professional.educationLevel.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
            />
          </InputWrapper>
          {showErrors && !professional.educationLevel.trim() && (
            <p className={submissionTheme.errorText}>You must select your education level.</p>
          )}
        </Field>

        <Field label="Institution">
          <InputWrapper icon={<MapPin className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !professional.institution.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={professional.institution}
              onChange={e =>
                onChangeProfessional({
                  ...professional,
                  institution: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !professional.institution.trim() && (
            <p className={submissionTheme.errorText}>You must enter your institution.</p>
          )}
        </Field>

        <Field label="Major">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !professional.major.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={professional.major}
              onChange={e =>
                onChangeProfessional({
                  ...professional,
                  major: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !professional.major.trim() && (
            <p className={submissionTheme.errorText}>You must enter your major.</p>
          )}
        </Field>

        <Field label="Occupation">
          <InputWrapper icon={<BriefcaseBusiness className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !professional.occupation.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={professional.occupation}
              onChange={e =>
                onChangeProfessional({
                  ...professional,
                  occupation: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !professional.occupation.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Organization">
          <InputWrapper icon={<Users className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !professional.organization.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={professional.organization}
              onChange={e =>
                onChangeProfessional({
                  ...professional,
                  organization: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !professional.organization.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Experiences">
          <InputWrapper icon={<BriefcaseBusiness className="h-4 w-4" />}>
            <textarea
              rows={3}
              className={`${base} pl-9 ${
                showErrors && !professional.experiences.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={professional.experiences}
              onChange={e =>
                onChangeProfessional({
                  ...professional,
                  experiences: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !professional.experiences.trim() && (
            <p className={submissionTheme.errorText}>
              You must describe your experiences.
            </p>
          )}
        </Field>

        <Field label="Achievements & Rewards">
          <InputWrapper icon={<Award className="h-4 w-4" />}>
            <textarea
              rows={3}
              className={`${base} pl-9 ${
                showErrors && !professional.achievements.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={professional.achievements}
              onChange={e =>
                onChangeProfessional({
                  ...professional,
                  achievements: e.target.value,
                })
              }
            />
          </InputWrapper>
          {showErrors && !professional.achievements.trim() && (
            <p className={submissionTheme.errorText}>This field is required.</p>
          )}
        </Field>

        <Field label="Resume (PDF)">
          <div className={submissionTheme.uploadOuter}>
            <label className="block">
              <span className={submissionTheme.uploadLabelSrOnly}>Upload Resume (PDF)</span>
              <div className={submissionTheme.uploadDropzone}>
                <Upload className={submissionTheme.uploadIcon} />
                {professional.resumeName ? (
                  <>
                    <p className={submissionTheme.uploadTitle}>{professional.resumeName}</p>
                    <p className={submissionTheme.uploadSubtitle}>
                      Click to re-upload your resume (PDF, max 1 MB).
                    </p>
                  </>
                ) : (
                  <>
                    <p className={submissionTheme.uploadTitle}>Upload your Resume</p>
                    <p className={submissionTheme.uploadSubtitle}>
                      Upload in PDF format (max size 1 MB)
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  className={submissionTheme.uploadInput}
                  onChange={e =>
                    onChangeProfessional({
                      ...professional,
                      resumeName: e.target.files?.[0]?.name ?? professional.resumeName,
                    })
                  }
                />
              </div>
            </label>
            {showErrors && !professional.resumeName.trim() && (
              <p className={submissionTheme.errorText}>
                You must upload your resume (PDF, max 1 MB).
              </p>
            )}
            {professional.resumeName && (
              <p className={submissionTheme.uploadHintText}>
                Current file: {" "}
                <span className={submissionTheme.uploadHintFileName}>
                  {professional.resumeName}
                </span>
              </p>
            )}
          </div>
        </Field>
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
          onClick={onSaveAndContinue}
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
