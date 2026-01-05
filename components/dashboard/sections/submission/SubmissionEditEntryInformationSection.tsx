"use client";

import React from "react";
import { Award, Info, Lock, Users } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import type { EntryInfo } from "../SubmissionEditSection";

const submissionTheme = jysSectionTheme.dashboardSubmission;

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
  entry: EntryInfo;
  onChangeEntry: (value: EntryInfo) => void;
  showErrors: boolean;
  onBack: () => void;
  onGoToPreview: () => void;
};

export default function SubmissionEditEntryInformationSection({
  entry,
  onChangeEntry,
  showErrors,
  onBack,
  onGoToPreview,
}: Props) {
  const base = inputBaseClass();

  return (
    <div className={submissionTheme.formSectionWrapper}>
      <div>
        <h2 className={submissionTheme.formSectionTitle}>Entry Information</h2>
        <p className={submissionTheme.formSectionSubtitle}>
          Update how you join and know about this program.
        </p>
      </div>

      <div className={submissionTheme.helperPanelWrapper}>
        <div>
          <h3 className={submissionTheme.helperTitle}>About Participation Category</h3>
          <p className={submissionTheme.helperBodyText}>
            The participation category determines your placement group in the program. This selection affects:
          </p>
          <ul className={submissionTheme.helperList}>
            <li className={submissionTheme.helperListItem}>
              <Award className={submissionTheme.helperListIcon} />
              <span>Award eligibility and evaluation criteria.</span>
            </li>
            <li className={submissionTheme.helperListItem}>
              <Users className={submissionTheme.helperListIcon} />
              <span>Group-specific activities and opportunities.</span>
            </li>
            <li className={submissionTheme.helperListItem}>
              <Lock className={submissionTheme.helperListIcon} />
              <span>Specific requirements and expectations.</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={submissionTheme.helperTitle}>About Program Subtheme</h3>
          <p className={submissionTheme.helperBodyText}>
            The program subtheme helps align your work with the program's objectives:
          </p>
          <ul className={submissionTheme.helperList}>
            <li className={submissionTheme.helperListItem}>
              <Award className={submissionTheme.helperListIcon} />
              <span>Guides your essay content and approach.</span>
            </li>
            <li className={submissionTheme.helperListItem}>
              <Users className={submissionTheme.helperListIcon} />
              <span>Ensures relevance to program goals.</span>
            </li>
            <li className={submissionTheme.helperListItem}>
              <Lock className={submissionTheme.helperListIcon} />
              <span>Specific requirements and expectations.</span>
            </li>
          </ul>
        </div>

        <div>
          <p className={submissionTheme.helperBodyText}>
            Helps evaluators assess your submissions.
          </p>
        </div>
      </div>

      <div className={submissionTheme.formGrid}>
        <Field label="Participation Category">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <select
              className={`${base} pl-9 ${
                showErrors && !entry.participationCategory.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={entry.participationCategory}
              onChange={e =>
                onChangeEntry({
                  ...entry,
                  participationCategory: e.target.value,
                })
              }
            >
              <option value="">Select category</option>
              <option value="Future Innovators">Future Innovators</option>
              <option value="High School Innovators">High School Innovators</option>
            </select>
          </InputWrapper>
          {showErrors && !entry.participationCategory.trim() && (
            <p className={submissionTheme.errorText}>You must select a participation category.</p>
          )}
        </Field>

        <Field label="Program Subtheme">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <select
              className={`${base} pl-9 ${
                showErrors && !entry.programSubtheme.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={entry.programSubtheme}
              onChange={e =>
                onChangeEntry({
                  ...entry,
                  programSubtheme: e.target.value,
                })
              }
            >
              <option value="">Select subtheme</option>
              <option value="SDG 4 (Quality Education)">SDG 4 (Quality Education)</option>
              <option value="SDG 5 (Gender Equality)">SDG 5 (Gender Equality)</option>
              <option value="SDG 10 (Reduced Inequalities)">SDG 10 (Reduced Inequalities)</option>
              <option value="SDG 16 (Peace, Justice, and Strong Institutions)">
                SDG 16 (Peace, Justice, and Strong Institutions)
              </option>
              <option value="SDG 17 (Partnership for the Goals)">
                SDG 17 (Partnership for the Goals)
              </option>
            </select>
          </InputWrapper>
          {showErrors && !entry.programSubtheme.trim() && (
            <p className={submissionTheme.errorText}>You must select a program subtheme.</p>
          )}
        </Field>

        <Field label="Knowledge Source">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <select
              className={`${base} pl-9 ${
                showErrors && !entry.knowledgeSource.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={entry.knowledgeSource}
              onChange={e =>
                onChangeEntry({
                  ...entry,
                  knowledgeSource: e.target.value,
                })
              }
            >
              <option value="">Select source</option>
              <option value="Friends Recommendation">Friends Recommendation</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Website">Website</option>
            </select>
          </InputWrapper>
          {showErrors && !entry.knowledgeSource.trim() && (
            <p className={submissionTheme.errorText}>
              You must select how you know this program.
            </p>
          )}
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
          onClick={onGoToPreview}
        >
          Go to Preview
        </button>
      </div>
    </div>
  );
}
