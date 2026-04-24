"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import Image from "next/image";
import { componentsTheme } from "@/lib/theme/components";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import { getEnvelopeData, getErrorMessage } from "@/lib/api/response";
import type {
  PortalSubmissionDetail,
  PortalSubmissionEssay,
  PortalSubmissionField,
  PortalSubmissionFieldOption,
  PortalSubmissionSection,
} from "@/types/portal-submission";
import Breadcrumb from "@/components/dashboard/ui/Breadcrumb";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";
import { CountryField } from "@/components/dashboard/fields/CountryField";
import { PhoneField } from "@/components/dashboard/fields/PhoneField";
import { FieldHelpAssets } from "@/components/dashboard/sections/FieldHelpAssets";
import { toPortalSubmissionDetail } from "@/lib/dashboard/submissionParser";

const submissionTheme = componentsTheme.dashboardSubmission;

export type PersonalDetails = {
  fullName: string;
  nickName: string;
  gender: string;
  birthdate: string;
  nationality: string;
  originState: string;
  originCity: string;
  currentState: string;
  currentCity: string;
  phoneNumber: string;
  emergencyPhoneNumber: string;
  emergencyRelationship: string;
  tshirtSize: string;
  diseaseHistory: string;
};

export type ProfessionalProfile = {
  educationLevel: string;
  institution: string;
  major: string;
  occupation: string;
  organization: string;
  experiences: string;
  achievements: string;
  resumeName: string;
};

export type EntryInfo = {
  participationCategory: string;
  programSubtheme: string;
  knowledgeSource: string;
  essayTitle: string;
  mainEssay: string;
  keywords: string[];
  reference: string;
  instagramAccount?: string;
  miscKnowledgeSource?: string;
  sourceAccountName?: string;
  twibbonLink?: string;
  requirementLink?: string;
  ambassadorReferralCode?: string;
};

export const DUMMY_PERSONAL_DETAILS: PersonalDetails = {
  fullName: "",
  nickName: "",
  gender: "",
  birthdate: "",
  nationality: "",
  originState: "",
  originCity: "",
  currentState: "",
  currentCity: "",
  phoneNumber: "",
  emergencyPhoneNumber: "",
  emergencyRelationship: "",
  tshirtSize: "",
  diseaseHistory: "",
};

export const DUMMY_PROFESSIONAL_PROFILE: ProfessionalProfile = {
  educationLevel: "",
  institution: "",
  major: "",
  occupation: "",
  organization: "",
  experiences: "",
  achievements: "",
  resumeName: "",
};

export const DUMMY_ENTRY_INFO: EntryInfo = {
  participationCategory: "",
  programSubtheme: "",
  knowledgeSource: "",
  essayTitle: "",
  mainEssay: "",
  keywords: [],
  reference: "",
  instagramAccount: "",
  miscKnowledgeSource: "",
  sourceAccountName: "",
  twibbonLink: "",
  requirementLink: "",
  ambassadorReferralCode: "",
};

function normalizeInputValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function fieldOptionValue(option: PortalSubmissionFieldOption) {
  return typeof option === "string" ? option : option.value;
}

function fieldOptionLabel(option: PortalSubmissionFieldOption) {
  return typeof option === "string" ? option : option.label;
}

function normalizeFieldKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isCategoryField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return normalized === "category" || normalized === "applicationcategory" || normalized === "participationcategory" || normalized === "participationcategoryid";
}

function shouldSpanFullWidth(field: PortalSubmissionField) {
  if (field.mediaUrl) return true;
  if (field.type === "textarea" || field.type === "file") return true;

  const normalized = normalizeFieldKey(field.name);
  const isAddressField = normalized.endsWith("address") && !normalized.includes("email");
  return isAddressField || /(experience|achievement|organization|portfolio|resume|medical|disease|specialneed|essay|twibbon|requirement|originaddress|currentaddress)/.test(normalized);
}

function FieldMedia({ field }: { field: PortalSubmissionField }) {
  if (!field.mediaUrl) return null;

  const isRemote = /^https?:\/\//.test(field.mediaUrl);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <div className="relative aspect-[4/3] w-full bg-white">
        <Image
          src={field.mediaUrl}
          alt={field.mediaAlt || field.label}
          fill
          sizes="(min-width: 1024px) 420px, 100vw"
          className="object-contain p-4"
          unoptimized={isRemote}
        />
      </div>
      <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-600">
        {field.mediaAlt || `${field.label} guide`}
      </div>
    </div>
  );
}

export default function SubmissionEditSection() {
  const [detail, setDetail] = useState<PortalSubmissionDetail | null>(null);
  const [sectionValues, setSectionValues] = useState<Record<string, Record<string, string>>>({});
  const [essayValues, setEssayValues] = useState<Record<string, string>>({});
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [programSelectionReady, setProgramSelectionReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSectionId, setSavingSectionId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const syncSelectedProgram = () => {
      setSelectedProgramId(readActiveProgramId());
      setProgramSelectionReady(true);
    };

    syncSelectedProgram();
    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);

    return () => {
      window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!programSelectionReady) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(appendProgramId("/api/portal/submissions/detail", selectedProgramId), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await res.json().catch(() => null)) as unknown;
        if (!res.ok) throw new Error(getErrorMessage(json, "Failed to load submission detail"));

        const nextDetail = toPortalSubmissionDetail(getEnvelopeData(json));
        if (!cancelled && nextDetail) {
          setDetail(nextDetail);
          setActiveSectionId(nextDetail.sections[0]?.id ?? null);
          setSectionValues(
            Object.fromEntries(
              nextDetail.sections.map(section => [
                section.id,
                Object.fromEntries(
                  section.fields.map(field => [field.name, normalizeInputValue(section.values[field.name])]),
                ),
              ]),
            ),
          );
          setEssayValues(
            Object.fromEntries(nextDetail.essays.map(essay => [essay.id, normalizeInputValue(essay.answer)])),
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load submission detail");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [programSelectionReady, selectedProgramId]);

  const activeSection = useMemo(() => {
    return detail?.sections.find(section => section.id === activeSectionId) ?? detail?.sections[0] ?? null;
  }, [activeSectionId, detail?.sections]);

  const activeSectionIndex = useMemo(() => {
    return detail?.sections.findIndex(section => section.id === activeSection?.id) ?? -1;
  }, [activeSection?.id, detail?.sections]);

  const sectionEssays = useMemo(() => {
    if (!activeSection || activeSection.id !== "entry_information") return [];
    return [...(detail?.essays ?? [])].sort((left, right) => left.order - right.order);
  }, [activeSection, detail?.essays]);

  const updateFieldValue = (sectionId: string, fieldName: string, value: string) => {
    setSectionValues(current => ({
      ...current,
      [sectionId]: {
        ...(current[sectionId] || {}),
        [fieldName]: value,
      },
    }));
  };

  const saveActiveSection = async () => {
    if (!activeSection) return;

    setSavingSectionId(activeSection.id);
    setError(null);
    setSuccessMessage(null);

    try {
      const sectionPayload = sectionValues[activeSection.id] || {};
      const requests: Promise<Response>[] = [
        fetch(appendProgramId(`/api/portal/submissions/sections/${activeSection.id}`, selectedProgramId), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: sectionPayload }),
        }),
      ];

      if (activeSection.id === "entry_information" && sectionEssays.length > 0) {
        requests.push(
          fetch(appendProgramId("/api/portal/submissions/sections/essays", selectedProgramId), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: Object.fromEntries(sectionEssays.map(essay => [essay.id, essayValues[essay.id] || ""])) }),
          }),
        );
      }

      const responses = await Promise.all(requests);
      const results = await Promise.all(responses.map(response => response.json().catch(() => null)));
      const failed = responses.findIndex(response => !response.ok);

      if (failed >= 0) {
        throw new Error(getErrorMessage(results[failed], "Failed to save submission section"));
      }

      setSuccessMessage(`${activeSection.title} saved successfully.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save submission section");
    } finally {
      setSavingSectionId(null);
    }
  };

  const goToAdjacentSection = (direction: -1 | 1) => {
    if (!detail || activeSectionIndex < 0) return;
    const next = detail.sections[activeSectionIndex + direction];
    if (next) setActiveSectionId(next.id);
  };

  const renderFieldInput = (section: PortalSubmissionSection, field: PortalSubmissionField) => {
    const value = sectionValues[section.id]?.[field.name] ?? "";
    const treatAsSelect = field.type === "select" || isCategoryField(field);

    if (field.type === "textarea") {
      return (
        <textarea
          className={`${submissionTheme.essayTextarea} min-h-[140px]`}
          value={value}
          onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
          placeholder={field.placeholder || field.helpText || ""}
        />
      );
    }

    if (treatAsSelect) {
      return (
        <select
          className={submissionTheme.editInputBase}
          value={value}
          onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
        >
          <option value="">Select an option</option>
          {(field.options || []).map(option => (
            <option key={fieldOptionValue(option)} value={fieldOptionValue(option)}>
              {fieldOptionLabel(option)}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "country") {
      return (
        <CountryField
          value={value}
          onChange={code => updateFieldValue(section.id, field.name, code)}
          placeholder={field.placeholder}
        />
      );
    }

    if (field.type === "phone") {
      return (
        <PhoneField
          value={value}
          onChange={e164 => updateFieldValue(section.id, field.name, e164)}
        />
      );
    }

    const inputType = field.type === "date" || field.type === "url" ? field.type : "text";
    return (
      <input
        type={inputType}
        className={submissionTheme.editInputBase}
        value={value}
        onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
        placeholder={field.placeholder || field.helpText || ""}
      />
    );
  };

  if (loading) {
    return <DashboardPageSkeleton variant="submission-edit" className={submissionTheme.editSectionWrapper} />;
  }

  return (
    <section className={submissionTheme.editSectionWrapper}>
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {!loading && detail ? (
        <>
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Submissions", href: "/dashboard/submission" },
              { label: "Registration Form", href: "/dashboard/submission" },
              { label: "Edit Form" },
            ]}
          />

          {/* Page Title */}
          <h1 className="text-2xl font-bold text-slate-900">
            Registration Form
          </h1>

          {/* Stepper */}
          <div className={submissionTheme.stepperCard}>
            <div className={submissionTheme.stepperRow}>
              {detail.sections.map((section, index) => {
                const sectionStatus = String(section.status || "pending").toLowerCase();
                const isDone = sectionStatus === "completed";
                const isSectionInProgress = sectionStatus === "in_progress";
                const isActive = index === activeSectionIndex;
                const isLast = index === detail.sections.length - 1;

                const circleClass = isDone
                  ? submissionTheme.stepperCircleDone
                  : isActive || isSectionInProgress
                    ? submissionTheme.stepperCircleActive
                    : submissionTheme.stepperCircleIdle;

                const statusClass = isDone
                  ? submissionTheme.stepperStatusDone
                  : isSectionInProgress
                    ? submissionTheme.stepperStatusActive
                    : submissionTheme.stepperStatusIdle;

                const statusLabel = isDone ? "Done" : isSectionInProgress ? "In Progress" : "Not yet";

                const connectorBarClass = isDone
                  ? submissionTheme.stepperConnectorDone
                  : isSectionInProgress || isActive
                    ? submissionTheme.stepperConnectorActive
                    : submissionTheme.stepperConnectorIdle;

                return (
                  <div key={section.id} className={submissionTheme.stepperPillRow}>
                    <button
                      type="button"
                      className={submissionTheme.stepperButtonBase}
                      onClick={() => setActiveSectionId(section.id)}
                    >
                      <div className={`${submissionTheme.stepperCircle} ${circleClass}`}>
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className={submissionTheme.stepperTextWrapper}>
                        <p className={submissionTheme.stepperStepTitle}>{section.title}</p>
                        <span className={`${submissionTheme.stepperStatusPill} ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </button>
                    {!isLast && (
                      <div className={submissionTheme.stepperConnectorWrapper}>
                        <div className={`${submissionTheme.stepperConnectorBar} ${connectorBarClass}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {activeSection ? (
            <div className={submissionTheme.formCard}>
              <div className={submissionTheme.formSectionWrapper}>
                <div>
                  <h2 className={submissionTheme.formSectionTitle}>{activeSection.title}</h2>
                  {activeSection.description ? (
                    <p className={submissionTheme.formSectionSubtitle}>{activeSection.description}</p>
                  ) : null}
                </div>

                <div className={`${submissionTheme.formGrid} items-start`}>
                  {activeSection.fields.map(field => (
                    <label
                      key={field.id}
                      className={`${submissionTheme.editFieldLabelWrapper} rounded-xl border border-slate-200 bg-white p-3 shadow-sm ${
                        shouldSpanFullWidth(field) ? "md:col-span-2" : ""
                      }`}
                    >
                      <span className={submissionTheme.editFieldLabelText}>
                        {field.label}
                        {field.isRequired ? " *" : ""}
                      </span>
                      {renderFieldInput(activeSection, field)}
                      {field.helpText ? (
                        <p className={submissionTheme.readSectionSubtitle}>{field.helpText}</p>
                      ) : null}
                      <FieldMedia field={field} />
                      <FieldHelpAssets items={field.helpAssets} className="mt-2" />
                    </label>
                  ))}
                </div>

                {sectionEssays.length > 0 ? (
                  <div className={submissionTheme.mainEssaySectionWrapper}>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Essay Questions</h3>
                      <p className="mt-1 text-[13px] text-slate-700">
                        Answer the program essay prompts below. These responses are saved separately from the form fields.
                      </p>
                    </div>

                    {sectionEssays.map((essay: PortalSubmissionEssay) => (
                      <div key={essay.id} className="space-y-2">
                        <label className={submissionTheme.editFieldLabelWrapper}>
                          <span className={submissionTheme.editFieldLabelText}>{essay.question}</span>
                          <textarea
                            className={submissionTheme.essayTextarea}
                            value={essayValues[essay.id] || ""}
                            onChange={event =>
                              setEssayValues(current => ({
                                ...current,
                                [essay.id]: event.target.value,
                              }))
                            }
                            placeholder={essay.wordLimit ? `Word limit: ${essay.wordLimit}` : "Write your answer"}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                ) : null}

                {detail.requirements.length > 0 ? (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="font-semibold">Documents are handled in a separate submission flow.</p>
                        <p className="mt-1 text-xs text-amber-800">
                          Required documents: {detail.requirements.map(requirement => requirement.name).join(", ")}.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className={submissionTheme.secondaryButton}
                    onClick={() => goToAdjacentSection(-1)}
                    disabled={activeSectionIndex <= 0}
                  >
                    Previous
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className={submissionTheme.primaryButton}
                      onClick={saveActiveSection}
                      disabled={savingSectionId === activeSection.id}
                    >
                      {savingSectionId === activeSection.id ? "Saving..." : "Save Section"}
                    </button>
                    <button
                      type="button"
                      className={submissionTheme.secondaryButton}
                      onClick={() => goToAdjacentSection(1)}
                      disabled={!detail.sections[activeSectionIndex + 1]}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 shadow-sm">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                No submission fields are configured for this program yet.
              </div>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}