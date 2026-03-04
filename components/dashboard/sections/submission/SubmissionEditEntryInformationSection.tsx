"use client";

import React from "react";
import Image from "next/image";
import { AlertTriangle, Award, BookOpen, Info, Lock, Users } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import type { EntryInfo } from "../SubmissionEditSection";
import StyledSelect from "@/components/ui/StyledSelect";

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
  showEssayFields?: boolean;
};

export default function SubmissionEditEntryInformationSection({
  entry,
  onChangeEntry,
  showErrors,
  onBack,
  onGoToPreview,
  showEssayFields = true,
}: Props) {
  const base = inputBaseClass();
  const [keywordInput, setKeywordInput] = React.useState("");
  const [keywordDropdownOpen, setKeywordDropdownOpen] = React.useState(false);
  const participationCategoryOptions = React.useMemo(
    () => [
      { value: "Future Innovators", label: "Future Innovators" },
      { value: "High School Innovators", label: "High School Innovators" },
    ],
    [],
  );

  const programSubthemeOptions = React.useMemo(
    () => [
      { value: "SDG 4 (Quality Education)", label: "SDG 4 (Quality Education)" },
      { value: "SDG 5 (Gender Equality)", label: "SDG 5 (Gender Equality)" },
      { value: "SDG 10 (Reduced Inequalities)", label: "SDG 10 (Reduced Inequalities)" },
      {
        value: "SDG 16 (Peace, Justice, and Strong Institutions)",
        label: "SDG 16 (Peace, Justice, and Strong Institutions)",
      },
      {
        value: "SDG 17 (Partnership for the Goals)",
        label: "SDG 17 (Partnership for the Goals)",
      },
    ],
    [],
  );

  const knowledgeSourceOptions = React.useMemo(
    () => [
      { value: "Friends Recommendation", label: "Friends Recommendation" },
      { value: "Instagram", label: "Instagram" },
      { value: "LinkedIn", label: "LinkedIn" },
      { value: "Website", label: "Website" },
    ],
    [],
  );
  const countWords = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

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
            <StyledSelect
              value={entry.participationCategory}
              onChange={value =>
                onChangeEntry({
                  ...entry,
                  participationCategory: value,
                })
              }
              options={participationCategoryOptions}
              placeholder="Select category"
              className={`${base} pl-9 ${
                showErrors && !entry.participationCategory.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
            />
          </InputWrapper>
          {showErrors && !entry.participationCategory.trim() && (
            <p className={submissionTheme.errorText}>You must select a participation category.</p>
          )}
        </Field>

        <Field label="Program Subtheme">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <StyledSelect
              value={entry.programSubtheme}
              onChange={value =>
                onChangeEntry({
                  ...entry,
                  programSubtheme: value,
                })
              }
              options={programSubthemeOptions}
              placeholder="Select subtheme"
              className={`${base} pl-9 ${
                showErrors && !entry.programSubtheme.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
              searchable
            />
          </InputWrapper>
          {showErrors && !entry.programSubtheme.trim() && (
            <p className={submissionTheme.errorText}>You must select a program subtheme.</p>
          )}
        </Field>

        <Field label="Knowledge Source">
          <InputWrapper icon={<Info className="h-4 w-4" />}>
            <StyledSelect
              value={entry.knowledgeSource}
              onChange={value =>
                onChangeEntry({
                  ...entry,
                  knowledgeSource: value,
                })
              }
              options={knowledgeSourceOptions}
              placeholder="Select source"
              className={`${base} pl-9 ${
                showErrors && !entry.knowledgeSource.trim()
                  ? submissionTheme.editInputError
                  : ""
              }`}
            />
          </InputWrapper>
          {showErrors && !entry.knowledgeSource.trim() && (
            <p className={submissionTheme.errorText}>
              You must select how you know this program.
            </p>
          )}
        </Field>
      </div>

      {showEssayFields ? (
        <>
          {/* Essay Guidelines summary + note + guidebook CTA (below all form fields) */}
          <div className={submissionTheme.essaySummaryWrapper}>
            {/* Title + description */}
            <div>
              <h3 className={submissionTheme.essaySummaryTitle}>Essay Guidelines</h3>
              <p className={submissionTheme.essaySummaryBody}>
                Please carefully review the essay guidelines before preparing your submission. The guidelines
                contain important information about formatting requirements, word limits, evaluation criteria,
                and other essential details.
              </p>
            </div>

            {/* Info note */}
            <div className={submissionTheme.essayNoteBanner}>
              <span className={submissionTheme.essayNoteIconCircle}>
                <AlertTriangle className="h-4 w-4" />
              </span>
              <p>
                <span className="font-semibold">Note:</span> Submissions that do not follow the guidelines may
                receive lower credit scores which can lower the possibility to be selected as a fully funded
                participant.
              </p>
            </div>

            {/* More Information + guidebook CTA with background image card */}
            <div className={submissionTheme.essayGuidebookCard}>
              <Image
                src="/img/essayguidliness.webp"
                alt="Essay guidelines illustration"
                fill={false}
                width={1200}
                height={1200}
                className={submissionTheme.essayGuidebookBackgroundImage}
                priority
              />
              <div className={submissionTheme.essayGuidebookOverlay} />
              <div className={submissionTheme.essayGuidebookInner}>
                <div className={submissionTheme.essayGuidebookGrid}>
                  {/* Left: title */}
                  <div className={submissionTheme.essayGuidebookTitle}>
                    <p>More Information?</p>
                    <p className="text-primary">Check this Guidebook!</p>
                  </div>

                  {/* Center: description + button */}
                  <div className="text-center md:text-left">
                    <p className={submissionTheme.essayGuidebookSubtitle}>
                      The complete information regarding this program can be seen <br/>in the guidebook below.
                    </p>
                    <button
                      type="button"
                      className={`${submissionTheme.primaryButton} mt-3 inline-flex items-center gap-2 px-6 py-2 text-xs`}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>View Essay Guidebook</span>
                    </button>
                  </div>

                  {/* Right: reserved (empty) */}
                  <div className="hidden md:block" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Essay Question section */}
          <div className={submissionTheme.mainEssaySectionWrapper}>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Main Essay Question</h3>
              <p className="mt-1 text-[13px] text-slate-700">
                Please answer the following questions carefully. Your responses will be evaluated based on
                clarity, depth of insight, and relevance to your selected program subtheme.
              </p>
            </div>

            {/* Essay Title (max 15 words) */}
            <div>
              <Field label="Essay Title (Max 15 Words)">
                <InputWrapper icon={<Info className="h-4 w-4" />}>
                  <input
                    type="text"
                    className={`${base} pl-9 ${
                      showErrors && !entry.essayTitle.trim() ? submissionTheme.editInputError : ""
                    }`}
                    value={entry.essayTitle}
                    onChange={e =>
                      onChangeEntry({
                        ...entry,
                        essayTitle: e.target.value,
                      })
                    }
                    placeholder="Write a strong, concise essay title"
                  />
                </InputWrapper>
                <p className={submissionTheme.mainEssayCounterText}>
                  {countWords(entry.essayTitle)} / 15 words
                </p>
                {showErrors && !entry.essayTitle.trim() && (
                  <p className={submissionTheme.errorText}>You must provide an essay title.</p>
                )}
              </Field>
            </div>

            {/* Essay (max 800 words) */}
            <div>
              <Field label="Essay (Max 800 Words)">
                <textarea
                  className={`${submissionTheme.essayTextarea} w-full`}
                  value={entry.mainEssay}
                  onChange={e =>
                    onChangeEntry({
                      ...entry,
                      mainEssay: e.target.value,
                    })
                  }
                  placeholder="Explain your ideas, experiences, and impact related to your chosen subtheme."
                />
                <p className={submissionTheme.mainEssayCounterText}>
                  {countWords(entry.mainEssay)} / 800 words
                </p>
              </Field>
            </div>

            {/* Keyword (max 8 words) */}
            <div>
              <Field label="Keyword (Max 8 Words)">
                <div className={submissionTheme.keywordFieldWrapper}>
                  <button
                    type="button"
                    className={submissionTheme.keywordTriggerButton}
                    onClick={() => setKeywordDropdownOpen(prev => !prev)}
                  >
                    <span className={submissionTheme.keywordIconCircle}>
                      <Info className="h-3 w-3" />
                    </span>
                    <div className="flex-1">
                      <div className={submissionTheme.keywordChipsRow}>
                        {entry.keywords.map((kw, idx) => (
                          <span
                            key={`${kw}-${idx}`}
                            className={submissionTheme.keywordChip}
                          >
                            <span>{kw}</span>
                            <span
                              className={submissionTheme.keywordChipRemove}
                              onClick={e => {
                                e.stopPropagation();
                                onChangeEntry({
                                  ...entry,
                                  keywords: entry.keywords.filter((_, i) => i !== idx),
                                });
                              }}
                            >
                              ×
                            </span>
                          </span>
                        ))}
                        {entry.keywords.length === 0 && (
                          <span className="text-[11px] text-slate-400">
                            Write or select main keywords that represent your essay
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={submissionTheme.keywordChevron}>
                      {keywordDropdownOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  {keywordDropdownOpen && (
                    <div className={submissionTheme.keywordDropdownWrapper}>
                      <input
                        type="text"
                        className={submissionTheme.keywordSearchInput}
                        placeholder="Type to search or add keyword, then press Enter"
                        value={keywordInput}
                        onChange={e => setKeywordInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            const value = keywordInput.trim();
                            if (!value) return;
                            if (entry.keywords.length >= 8) return;
                            if (entry.keywords.includes(value)) {
                              setKeywordInput("");
                              return;
                            }
                            onChangeEntry({
                              ...entry,
                              keywords: [...entry.keywords, value],
                            });
                            setKeywordInput("");
                          }
                        }}
                      />

                      <div className={submissionTheme.keywordOptionsList}>
                        {[
                          "User Experience",
                          "User Interface",
                          "Muslims",
                          "Society",
                          "Sustainability",
                          "Leadership",
                          "Community Development",
                          "Education",
                        ]
                          .filter(option =>
                            keywordInput.trim().length === 0
                              ? !entry.keywords.includes(option)
                              : option.toLowerCase().includes(keywordInput.toLowerCase()) &&
                                !entry.keywords.includes(option)
                          )
                          .map(option => (
                            <button
                              key={option}
                              type="button"
                              className={submissionTheme.keywordOptionItem}
                              onClick={() => {
                                if (entry.keywords.length >= 8) return;
                                onChangeEntry({
                                  ...entry,
                                  keywords: [...entry.keywords, option],
                                });
                              }}
                            >
                              <span>{option}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </Field>
              <p className={submissionTheme.keywordCounterText}>
                {entry.keywords.length} / 8 keywords
              </p>
            </div>

            {/* Reference (max 100 words) */}
            <div>
              <Field label="Reference (Max 100 Words)">
                <textarea
                  className={`${submissionTheme.essayTextarea} w-full`}
                  value={entry.reference}
                  onChange={e =>
                    onChangeEntry({
                      ...entry,
                      reference: e.target.value,
                    })
                  }
                  placeholder="Mention any reference or source that supports your essay (optional)."
                />
                <p className={submissionTheme.mainEssayCounterText}>
                  {countWords(entry.reference)} / 100 words
                </p>
              </Field>
            </div>
          </div>
        </>
      ) : null}

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
