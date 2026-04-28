"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, ImageIcon, Info, PencilLine } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  getCountryCallingCode,
  isSupportedCountry,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { componentsTheme } from "@/lib/theme/components";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
  resolveActiveProgramId,
  syncActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import { getEnvelopeData, getErrorMessage } from "@/lib/api/response";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
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
import { FieldAssetDrawer } from "@/components/dashboard/sections/FieldAssetDrawer";
import { FieldHelpText, plainTextFromRichText } from "@/components/dashboard/sections/FieldHelpText";
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

function fieldOptionDescription(option: PortalSubmissionFieldOption) {
  return typeof option === "string" ? undefined : option.description;
}

function getSelectedOptionDescription(field: PortalSubmissionField, value: string) {
  if (!value || !field.options || field.options.length === 0) return "";

  const selected = field.options.find(option => fieldOptionValue(option) === value);
  if (!selected) return "";

  const description = fieldOptionDescription(selected);
  return typeof description === "string" ? description : "";
}

function normalizeFieldKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isCategoryField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return normalized === "category" || normalized === "applicationcategory" || normalized === "participationcategory" || normalized === "participationcategoryid";
}

function getFieldInputType(field: PortalSubmissionField) {
  const rules = field.validationRules;
  if (!rules || typeof rules !== "object") return "";

  const inputType = (rules as Record<string, unknown>).inputType;
  return typeof inputType === "string" ? inputType.toLowerCase() : "";
}

function isCountrySelectorField(field: PortalSubmissionField) {
  if (field.type === "country") return true;

  const inputType = getFieldInputType(field);
  if (inputType === "country_select") return true;

  const normalized = normalizeFieldKey(field.name);
  return normalized === "nationality" || normalized === "nationalitycode" || normalized === "origincountry" || normalized === "currentcountry";
}

function isProfilePhotoField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return normalized === "pictureurl" || normalized === "profilephotourl" || normalized === "profilepictureurl";
}

function isEmailField(field: PortalSubmissionField) {
  if (field.type === "email") return true;

  const inputType = getFieldInputType(field);
  if (inputType === "email") return true;

  const normalized = normalizeFieldKey(field.name);
  return normalized === "email" || normalized === "emailaddress";
}

type PhonePairKind =
  | "primary_country"
  | "primary_number"
  | "emergency_country"
  | "emergency_number";

function getPhonePairKind(field: PortalSubmissionField): PhonePairKind | null {
  const normalized = normalizeFieldKey(field.name);
  const inputType = getFieldInputType(field);

  if (inputType === "phone_country_code") {
    return normalized.includes("emergency") ? "emergency_country" : "primary_country";
  }

  if (inputType === "phone_number") {
    return normalized.includes("emergency") ? "emergency_number" : "primary_number";
  }

  if (normalized === "phonecountrycode") return "primary_country";
  if (normalized === "phonenumber") return "primary_number";
  if (normalized === "emergencycountrycode" || normalized === "emergencycontactcountrycode") {
    return "emergency_country";
  }
  if (
    normalized === "emergencyphonenumber" ||
    normalized === "emergencycontactphone" ||
    normalized === "emergencycontactphonenumber"
  ) {
    return "emergency_number";
  }

  return null;
}

function getPairedPhoneField(section: PortalSubmissionSection, field: PortalSubmissionField) {
  const kind = getPhonePairKind(field);
  if (!kind) return null;

  const targetKind: PhonePairKind = kind === "primary_country"
    ? "primary_number"
    : kind === "primary_number"
      ? "primary_country"
      : kind === "emergency_country"
        ? "emergency_number"
        : "emergency_country";

  return (
    section.fields.find(candidate => candidate.id !== field.id && getPhonePairKind(candidate) === targetKind) ||
    null
  );
}

function normalizeDialCode(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const plusPrefixed = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D+/g, "");
  if (digits.length > 0) return `${plusPrefixed ? "+" : "+"}${digits}`;

  const countryCode = trimmed.toUpperCase();
  if (/^[A-Z]{2}$/.test(countryCode) && isSupportedCountry(countryCode as CountryCode)) {
    return `+${getCountryCallingCode(countryCode as CountryCode)}`;
  }

  return "";
}

function buildE164FromDialAndNumber(countryCode: string, phoneNumber: string) {
  const rawNumber = phoneNumber.trim();
  if (!rawNumber) return "";
  if (rawNumber.startsWith("+")) return rawNumber;

  const digits = rawNumber.replace(/\D+/g, "");
  if (!digits) return "";

  const dialCode = normalizeDialCode(countryCode);
  if (!dialCode) return `+${digits}`;

  const normalizedNumber = digits.replace(/^0+/, "") || digits;
  return `${dialCode}${normalizedNumber}`;
}

function splitE164ToDialAndNumber(value: string) {
  if (!value) {
    return { countryCode: "", phoneNumber: "" };
  }

  const parsed = parsePhoneNumberFromString(value);
  if (parsed) {
    return {
      countryCode: parsed.countryCallingCode ? `+${parsed.countryCallingCode}` : "",
      phoneNumber: parsed.nationalNumber,
    };
  }

  return {
    countryCode: "",
    phoneNumber: value.replace(/\D+/g, ""),
  };
}

function shouldRenderField(section: PortalSubmissionSection, field: PortalSubmissionField) {
  if (isProfilePhotoField(field)) return false;
  if (isEmailField(field)) return false;

  const kind = getPhonePairKind(field);
  if (kind === "primary_country" || kind === "emergency_country") {
    return getPairedPhoneField(section, field) === null;
  }

  return true;
}

const PREVIEW_STEP_ID = "__preview__";

function getPreviewDisplayValue(
  section: PortalSubmissionSection,
  field: PortalSubmissionField,
  value: string,
  sectionVals: Record<string, string>,
) {
  if (!value) return "";

  const kind = getPhonePairKind(field);
  if (kind === "primary_number" || kind === "emergency_number") {
    const pairedCountryField = getPairedPhoneField(section, field);
    if (pairedCountryField) {
      const countryCode = sectionVals[pairedCountryField.name] ?? "";
      return buildE164FromDialAndNumber(countryCode, value);
    }
  }

  if ((field.options?.length ?? 0) > 0) {
    const option = field.options!.find(o => fieldOptionValue(o) === value);
    if (option) return fieldOptionLabel(option);
  }

  return value;
}

function shouldSpanFullWidth(field: PortalSubmissionField) {
  if (field.type === "textarea" || field.type === "file") return true;

  const normalized = normalizeFieldKey(field.name);
  const isAddressField = normalized.endsWith("address") && !normalized.includes("email");
  return isAddressField || /(experience|achievement|organization|portfolio|resume|medical|disease|specialneed|essay|twibbon|requirement|originaddress|currentaddress)/.test(normalized);
}

function FieldMedia({ field }: { field: PortalSubmissionField }) {
  if (!field.mediaUrl) return null;
  const [assetDrawerOpen, setAssetDrawerOpen] = useState(false);
  const assetLabel = field.mediaAlt?.trim() || `${field.label} reference`;

  return (
    <>
      <button
        type="button"
        onClick={() => setAssetDrawerOpen(true)}
        className="border-primary/30 bg-primary/5 hover:bg-primary/10 mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium text-primary transition"
      >
        <ImageIcon className="h-3.5 w-3.5" />
        <span>View Reference</span>
      </button>
      <FieldAssetDrawer
        open={assetDrawerOpen}
        onClose={() => setAssetDrawerOpen(false)}
        src={field.mediaUrl}
        alt={assetLabel}
      />
    </>
  );
}

export default function SubmissionEditSection() {
  const { me } = useDashboardData();
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
  const [expandedPreviewSections, setExpandedPreviewSections] = useState<Set<string>>(new Set());
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const syncSelectedProgram = () => {
      setSelectedProgramId(
        resolveActiveProgramId(me?.registeredPrograms ?? [], readActiveProgramId()),
      );
      setProgramSelectionReady(true);
    };

    syncSelectedProgram();
    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);

    return () => {
      window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);
    };
  }, [me?.registeredPrograms]);

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
          if (nextDetail.programId && nextDetail.programId !== selectedProgramId) {
            syncActiveProgramId(nextDetail.programId);
            setSelectedProgramId(nextDetail.programId);
          }
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
    if (activeSectionId === PREVIEW_STEP_ID) return null;
    return detail?.sections.find(section => section.id === activeSectionId) ?? null;
  }, [activeSectionId, detail?.sections]);

  const stepperItems = useMemo(() => {
    if (!detail) return [] as Array<{ id: string; title: string; status: string | null | undefined }>;
    return [
      ...detail.sections.map(s => ({ id: s.id, title: s.title, status: s.status })),
      { id: PREVIEW_STEP_ID, title: "Preview", status: undefined },
    ];
  }, [detail]);

  const activeSectionIndex = useMemo(() => {
    return stepperItems.findIndex(step => step.id === activeSectionId);
  }, [activeSectionId, stepperItems]);

  const sectionEssays = useMemo(() => {
    if (!activeSection || activeSection.id !== "entry_information") return [];
    return [...(detail?.essays ?? [])].sort((left, right) => left.order - right.order);
  }, [activeSection, detail?.essays]);

  const sectionEssayGuideline = useMemo(() => {
    if (!detail) return null;
    const text = detail.essayGuidelineText?.trim() || "";
    const url = detail.essayGuidelineUrl?.trim() || "";
    if (!text && !url) return null;

    return {
      text,
      url,
    };
  }, [detail]);

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
    if (activeSectionIndex < 0) return;
    const next = stepperItems[activeSectionIndex + direction];
    if (next) setActiveSectionId(next.id);
  };

  const renderFieldInput = (section: PortalSubmissionSection, field: PortalSubmissionField) => {
    const value = sectionValues[section.id]?.[field.name] ?? "";
    const fieldType = field.type.toLowerCase();
    const isRadioField = fieldType === "radio";
    const treatAsSelect = field.type === "select" || isCategoryField(field);
    const phonePairKind = getPhonePairKind(field);

    if (phonePairKind === "primary_number" || phonePairKind === "emergency_number") {
      const pairedCountryField = getPairedPhoneField(section, field);

      if (pairedCountryField) {
        const countryCodeValue = sectionValues[section.id]?.[pairedCountryField.name] ?? "";
        const e164 = buildE164FromDialAndNumber(countryCodeValue, value);

        return (
          <PhoneField
            value={e164}
            onChange={nextE164 => {
              const normalized = splitE164ToDialAndNumber(nextE164);
              updateFieldValue(section.id, pairedCountryField.name, normalized.countryCode);
              updateFieldValue(section.id, field.name, normalized.phoneNumber);
            }}
          />
        );
      }
    }

    if (field.type === "textarea") {
      return (
        <textarea
          className={`${submissionTheme.essayTextarea} min-h-[140px]`}
          value={value}
          onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
          placeholder={field.placeholder || plainTextFromRichText(field.helpText) || ""}
        />
      );
    }

    if (isRadioField && (field.options?.length ?? 0) > 0) {
      return (
        <div className="space-y-2">
          {(field.options || []).map(option => {
            const optionValue = fieldOptionValue(option);

            return (
              <div key={optionValue} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name={`field-${field.id}`}
                  value={optionValue}
                  checked={value === optionValue}
                  onChange={event => updateFieldValue(section.id, field.name, event.target.value)}
                  className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{fieldOptionLabel(option)}</span>
              </div>
            );
          })}
        </div>
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

    if (isCountrySelectorField(field)) {
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
        placeholder={field.placeholder || plainTextFromRichText(field.helpText) || ""}
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
              {stepperItems.map((step, index) => {
                const sectionStatus = String(step.status || "pending").toLowerCase();
                const isDone = sectionStatus === "completed";
                const isSectionInProgress = sectionStatus === "in_progress";
                const isActive = index === activeSectionIndex;
                const isLast = index === stepperItems.length - 1;

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
                  <div key={step.id} className={submissionTheme.stepperPillRow}>
                    <button
                      type="button"
                      className={submissionTheme.stepperButtonBase}
                      onClick={() => setActiveSectionId(step.id)}
                    >
                      <div className={`${submissionTheme.stepperCircle} ${circleClass}`}>
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className={submissionTheme.stepperTextWrapper}>
                        <p className={submissionTheme.stepperStepTitle}>{step.title}</p>
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

          {activeSectionId === PREVIEW_STEP_ID ? (() => {
            const checklistItems = detail.previewChecklistItems ?? [];
            const allChecked = checklistItems.every(item => checkedItems.has(item));
            const isPaymentSettled = detail.isRegistrationPaymentSettled ?? true;
            const canSubmit = allChecked && isPaymentSettled;

            const toggleSection = (id: string) =>
              setExpandedPreviewSections(prev => {
                const next = new Set(prev);
                if (next.has(id)) next.delete(id); else next.add(id);
                return next;
              });

            const toggleItem = (item: string) =>
              setCheckedItems(prev => {
                const next = new Set(prev);
                if (next.has(item)) next.delete(item); else next.add(item);
                return next;
              });

            const handleSubmit = async () => {
              setSubmitting(true);
              setError(null);
              try {
                const res = await fetch(appendProgramId("/api/portal/submissions/submit", selectedProgramId), {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                });
                const json = (await res.json().catch(() => null)) as unknown;
                if (!res.ok) throw new Error(getErrorMessage(json, "Failed to submit application"));
                setSuccessMessage("Application submitted successfully.");
              } catch (submitError) {
                setError(submitError instanceof Error ? submitError.message : "Failed to submit application");
              } finally {
                setSubmitting(false);
              }
            };

            return (
              <div className={submissionTheme.formCard}>
                <div className={submissionTheme.formSectionWrapper}>
                  <div>
                    <h2 className={submissionTheme.formSectionTitle}>Preview</h2>
                    <p className={submissionTheme.formSectionSubtitle}>
                      Review all your information before submitting.
                    </p>
                  </div>

                  <div className={submissionTheme.previewWrapper}>
                    {detail.sections.map(section => {
                      const isExpanded = expandedPreviewSections.has(section.id);
                      return (
                        <div key={section.id} className={submissionTheme.previewCard}>
                          <button
                            type="button"
                            className="flex w-full items-center justify-between gap-2"
                            onClick={() => toggleSection(section.id)}
                          >
                            <h3 className={submissionTheme.previewCardTitle}>{section.title}</h3>
                            <div className="flex items-center gap-3">
                              <span
                                className={submissionTheme.previewEditButton}
                                onClick={e => { e.stopPropagation(); setActiveSectionId(section.id); }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => { if (e.key === "Enter") { e.stopPropagation(); setActiveSectionId(section.id); } }}
                              >
                                <PencilLine className={submissionTheme.previewEditIcon} />
                                <span>Edit</span>
                              </span>
                              <ChevronDown
                                className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </div>
                          </button>

                          {isExpanded ? (
                            <dl className={`${submissionTheme.previewDefinitionList} mt-3`}>
                              {section.fields
                                .filter(field => shouldRenderField(section, field))
                                .map(field => {
                                  const rawValue = sectionValues[section.id]?.[field.name] ?? "";
                                  const displayValue = getPreviewDisplayValue(section, field, rawValue, sectionValues[section.id] ?? {});
                                  return (
                                    <div key={field.id}>
                                      <dt className={submissionTheme.previewDt}>{field.label}</dt>
                                      <dd className={submissionTheme.previewDd}>{displayValue || "-"}</dd>
                                    </div>
                                  );
                                })}
                              {section.id === "entry_information" && detail.essays.length > 0
                                ? [...detail.essays]
                                    .sort((a, b) => a.order - b.order)
                                    .map(essay => (
                                      <div key={essay.id} className="md:col-span-2">
                                        <dt className={submissionTheme.previewDt}>{essay.question}</dt>
                                        <dd className={submissionTheme.previewDdMultiline}>{essayValues[essay.id] || "-"}</dd>
                                      </div>
                                    ))
                                : null}
                            </dl>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  {detail.termsAndConditions ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Disclaimer
                      </p>
                      <div
                        className="prose prose-sm max-w-none text-slate-700"
                        dangerouslySetInnerHTML={{ __html: detail.termsAndConditions }}
                      />
                    </div>
                  ) : null}

                  {checklistItems.length > 0 ? (
                    <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Please confirm the following
                      </p>
                      {checklistItems.map(item => (
                        <label key={item} className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            checked={checkedItems.has(item)}
                            onChange={() => toggleItem(item)}
                          />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      className={submissionTheme.secondaryButton}
                      onClick={() => goToAdjacentSection(-1)}
                    >
                      Previous
                    </button>
                    {isPaymentSettled ? (
                      <button
                        type="button"
                        className={submissionTheme.primaryButton}
                        disabled={!canSubmit || submitting}
                        onClick={() => void handleSubmit()}
                      >
                        {submitting ? "Submitting..." : "Submit Application"}
                      </button>
                    ) : (
                      <Link
                        href="/dashboard/payments"
                        className={submissionTheme.primaryButton}
                      >
                        Complete Payment
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })() : activeSection ? (
            <div className={submissionTheme.formCard}>
              <div className={submissionTheme.formSectionWrapper}>
                <div>
                  <h2 className={submissionTheme.formSectionTitle}>{activeSection.title}</h2>
                  {activeSection.description ? (
                    <p className={submissionTheme.formSectionSubtitle}>{activeSection.description}</p>
                  ) : null}
                </div>

                <div className={`${submissionTheme.formGrid} items-start`}>
                  {activeSection.fields.filter(field => shouldRenderField(activeSection, field)).map(field => {
                    const currentValue = sectionValues[activeSection.id]?.[field.name] ?? "";
                    const selectedDescription = getSelectedOptionDescription(field, currentValue);

                    return (
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
                        {selectedDescription ? (
                          <p className={submissionTheme.readSectionSubtitle}>{selectedDescription}</p>
                        ) : null}
                        <FieldHelpText html={field.helpText} className="mt-1" />
                        <FieldMedia field={field} />
                        <FieldHelpAssets items={field.helpAssets} className="mt-2" />
                      </label>
                    );
                  })}
                </div>

                {sectionEssays.length > 0 ? (
                  <div className={submissionTheme.mainEssaySectionWrapper}>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">Essay Questions</h3>
                      <p className="mt-1 text-[13px] text-slate-700">
                        Answer the program essay prompts below. These responses are saved separately from the form fields.
                      </p>
                    </div>

                    {sectionEssayGuideline ? (
                      <div className="flex flex-col gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-[13px] text-blue-800">
                        {sectionEssayGuideline.text ? <p>{sectionEssayGuideline.text}</p> : null}
                        {sectionEssayGuideline.url ? (
                          <a
                            href={sectionEssayGuideline.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-semibold text-blue-600 underline-offset-2 hover:underline"
                          >
                            View Essay Guidelines →
                          </a>
                        ) : null}
                      </div>
                    ) : null}

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
                      disabled={activeSectionIndex >= stepperItems.length - 1}
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
