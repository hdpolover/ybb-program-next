"use client";

import React from "react";
import Image from "next/image";
import {
  AlertTriangle,
  BookOpen,
  Download,
  FileText,
  ImageIcon,
  Info,
  Link2,
  PlayCircle,
  Share2,
  Sparkles,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import type { EntryInfo } from "../SubmissionEditSection";
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
  entry: EntryInfo;
  onChangeEntry: (value: EntryInfo) => void;
  showErrors: boolean;
  onBack: () => void;
  onGoToPreview: () => void;
};

export default function SubmissionEditMiscSection({
  entry,
  onChangeEntry,
  showErrors,
  onBack,
  onGoToPreview,
}: Props) {
  const base = inputBaseClass();
  const knowledgeSourceOptions = React.useMemo(
    () => [
      { value: "Instagram", label: "Instagram" },
      { value: "LinkedIn", label: "LinkedIn" },
      { value: "Website", label: "Website" },
      { value: "Friend Recommendation", label: "Friend Recommendation" },
    ],
    [],
  );

  return (
    <div className={submissionTheme.formSectionWrapper}>
      <div>
        <h2 className={submissionTheme.formSectionTitle}>Miscellaneous</h2>
        <p className={submissionTheme.formSectionSubtitle}>
          Provide additional information related to your social media and campaign.
        </p>
      </div>

      <div className={submissionTheme.formGrid}>
        <Field label="Instagram Account">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !entry.instagramAccount?.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={entry.instagramAccount ?? ""}
              onChange={e =>
                onChangeEntry({
                  ...entry,
                  instagramAccount: e.target.value,
                })
              }
              placeholder="@yourusername"
            />
          </InputWrapper>
          {showErrors && !entry.instagramAccount?.trim() && (
            <p className={submissionTheme.errorText}>Please provide your Instagram account.</p>
          )}
        </Field>

        <Field label="Knowledge Source">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <StyledSelect
              value={entry.miscKnowledgeSource ?? ""}
              onChange={value =>
                onChangeEntry({
                  ...entry,
                  miscKnowledgeSource: value,
                })
              }
              options={knowledgeSourceOptions}
              placeholder="Select source"
              className={`${base} pl-9 ${
                showErrors && !entry.miscKnowledgeSource?.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
            />
          </InputWrapper>
          {showErrors && !entry.miscKnowledgeSource?.trim() && (
            <p className={submissionTheme.errorText}>Please select a knowledge source.</p>
          )}
        </Field>

        <Field label="Source Account Name">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="text"
              className={`${base} pl-9 ${
                showErrors && !entry.sourceAccountName?.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={entry.sourceAccountName ?? ""}
              onChange={e =>
                onChangeEntry({
                  ...entry,
                  sourceAccountName: e.target.value,
                })
              }
              placeholder="Account, page, or friend name"
            />
          </InputWrapper>
          {showErrors && !entry.sourceAccountName?.trim() && (
            <p className={submissionTheme.errorText}>Please provide the source account name.</p>
          )}
        </Field>

        <Field label="Twibbon Link">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <input
              type="url"
              className={`${base} pl-9 ${
                showErrors && !entry.twibbonLink?.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              value={entry.twibbonLink ?? ""}
              onChange={e =>
                onChangeEntry({
                  ...entry,
                  twibbonLink: e.target.value,
                })
              }
              placeholder="https://twb.nz/..."
            />
          </InputWrapper>
          {showErrors && !entry.twibbonLink?.trim() && (
            <p className={submissionTheme.errorText}>Please provide your Twibbon link.</p>
          )}
        </Field>
      </div>

      {/* Miscellaneous guidebook helper, same pattern as Entry Information */}
      <div className={submissionTheme.essaySummaryWrapper}>

        {/* More Information + guidebook CTA with background image card */}
        <div className={submissionTheme.essayGuidebookCard}>
          <Image
            src="/img/essayguidliness.webp"
            alt="Essay guidelines illustration"
            fill={false}
            width={1200}
            height={400}
            className={submissionTheme.essayGuidebookBackgroundImage}
            priority
          />
          <div className={submissionTheme.essayGuidebookOverlay} />
          <div className={submissionTheme.essayGuidebookInner}>
            <div className={submissionTheme.essayGuidebookGrid}>
              {/* Left: title */}
              <div className={submissionTheme.essayGuidebookTitle}>
                <p className="text-sm font-semibold text-slate-900">
                  More Information? Check this Video!
                </p>
                <p className={submissionTheme.essaySummaryBodySmall}>
                  Follow these steps to use the twibbon:
                </p>
                <ul className={submissionTheme.helperList}>
                  <li className={submissionTheme.helperListItem}>
                    <Link2 className={submissionTheme.helperListIcon} />
                    <span className={submissionTheme.twibbonListText}>Visit the twibbon link here.</span>
                  </li>
                  <li className={submissionTheme.helperListItem}>
                    <ImageIcon className={submissionTheme.helperListIcon} />
                    <span className={submissionTheme.twibbonListText}>Upload your photo.</span>
                  </li>
                  <li className={submissionTheme.helperListItem}>
                    <Sparkles className={submissionTheme.helperListIcon} />
                    <span className={submissionTheme.twibbonListText}>Download the generated image.</span>
                  </li>
                  <li className={submissionTheme.helperListItem}>
                    <Share2 className={submissionTheme.helperListIcon} />
                    <span className={submissionTheme.twibbonListText}>Share it to your social media.</span>
                  </li>
                  <li className={submissionTheme.helperListItem}>
                    <FileText className={submissionTheme.helperListIcon} />
                    <span className={submissionTheme.twibbonListText}>Copy and paste your twibbon post.</span>
                  </li>
                  <li className={submissionTheme.helperListItem}>
                    <Link2 className={submissionTheme.helperListIcon} />
                    <span className={submissionTheme.twibbonListText}>Link to the provided input.</span>
                  </li>
                </ul>
              </div>

              {/* Center: buttons only */}
              <div className={submissionTheme.essayGuidebookButtonRow}>
                <button
                  type="button"
                  className={`${submissionTheme.primaryButton} inline-flex w-full items-center justify-center gap-2 px-6 py-2 text-xs`}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Twibbon</span>
                </button>
                <button
                  type="button"
                  className={`${submissionTheme.primaryButton} inline-flex w-full items-center justify-center gap-2 px-6 py-2 text-xs`}
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Watch Tutorial</span>
                </button>
              </div>

              {/* Right: reserved (empty) */}
              <div className="hidden md:block" />
            </div>
          </div>
        </div>
        {/* Info note */}
        <div className={submissionTheme.essayNoteBanner}>
          <span className={submissionTheme.essayNoteIconCircle}>
            <AlertTriangle className="h-4 w-4" />
          </span>
          <p>
            <span className="font-semibold">Note:</span> As mentioned in the Registration Guidelines,
            you need to complete the following steps:
          </p>
        </div>

        {/* Twibbon action steps */}
        <ul className={submissionTheme.twibbonStepsList}>
          <li className={submissionTheme.twibbonStepItem}>
            <span className={submissionTheme.twibbonStepBadge}>1</span>
            <p className={submissionTheme.twibbonStepText}>
              Follow our official Instagram accounts for Youth Break the Boundaries and Japan Youth
              Summit.
            </p>
          </li>
          <li className={submissionTheme.twibbonStepItem}>
            <span className={submissionTheme.twibbonStepBadge}>2</span>
            <p className={submissionTheme.twibbonStepText}>
              Join our official Telegram channels and subscribe to the YBB YouTube channel to stay
              updated about the program.
            </p>
          </li>
          <li className={submissionTheme.twibbonStepItem}>
            <span className={submissionTheme.twibbonStepBadge}>3</span>
            <p className={submissionTheme.twibbonStepText}>
              Tag at least 5 friends and @youthbreaktheboundaries on your twibbon
              post on Instagram or other social media platforms.
            </p>
          </li>
          <li className={submissionTheme.twibbonStepItem}>
            <span className={submissionTheme.twibbonStepBadge}>4</span>
            <p className={submissionTheme.twibbonStepText}>
              Share the program poster in a minimum of 3 WhatsApp or other social
              media groups.
            </p>
          </li>
          <li className={submissionTheme.twibbonStepItem}>
            <span className={submissionTheme.twibbonStepBadge}>5</span>
            <p className={submissionTheme.twibbonStepText}>
              Take screenshots of each completed action, upload them to your storage drive, then copy the
              folder link and paste it into the input provided above.
            </p>
          </li>
        </ul>

        {/* Additional requirement fields */}
        <div className="mt-6 space-y-4">
          <div>
            <Field label="Requirement Link">
              <InputWrapper icon={<Link2 className="h-4 w-4" />}>
                <input
                  type="url"
                  className={`${base} pl-9 ${
                    showErrors && !(entry.requirementLink ?? "").trim()
                      ? submissionTheme.editInputError
                      : ""
                  }`}
                  value={entry.requirementLink ?? ""}
                  onChange={e =>
                    onChangeEntry({
                      ...entry,
                      requirementLink: e.target.value,
                    })
                  }
                  placeholder="https://drive.google.com/your-requirements-folder"
                />
              </InputWrapper>
              {showErrors && !(entry.requirementLink ?? "").trim() && (
                <p className={submissionTheme.errorText}>Please provide your requirement folder link.</p>
              )}
            </Field>
          </div>

          <div>
            <Field label="Ambassador Referral Code (Optional)">
              <div className="flex w-full items-center gap-2">
                <div className="flex-1">
                  <InputWrapper icon={<BadgeCheck className="h-4 w-4" />}>
                    <input
                      type="text"
                      className={`${base} pl-9`}
                      value={entry.ambassadorReferralCode ?? ""}
                      onChange={e =>
                        onChangeEntry({
                          ...entry,
                          ambassadorReferralCode: e.target.value,
                        })
                      }
                      placeholder="e.g. YBBJYS-AMB01"
                    />
                  </InputWrapper>
                </div>
                <button type="button" className={submissionTheme.twibbonValidateButton}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Validate</span>
                </button>
              </div>
            </Field>
          </div>
        </div>

        {/* Spacer to separate validate action from navigation buttons */}
        <div className="h-4" />
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
