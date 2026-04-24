"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, FileText, Info, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { componentsTheme } from "@/lib/theme/components";
import SubmissionReadProfileHeaderSection from "./submission/SubmissionReadProfileHeaderSection";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import type {
  PortalSubmissionDetail,
  PortalProgramOption,
  PortalSubmissionEssay,
  PortalSubmissionField,
  PortalSubmissionFieldOption,
  PortalSubmissionRequirement,
  PortalSubmissionSection,
} from "@/types/portal-submission";
import Breadcrumb from "@/components/dashboard/ui/Breadcrumb";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";
import { CountryDisplay } from "@/components/dashboard/fields/CountryDisplay";
import { PhoneDisplay } from "@/components/dashboard/fields/PhoneDisplay";

const submissionTheme = componentsTheme.dashboardSubmission;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function getMessage(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  return typeof payload.message === "string" ? payload.message : null;
}

function getEnvelopeData(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  return "data" in payload ? payload.data ?? null : payload;
}

function toSubmissionFieldOption(value: unknown): PortalSubmissionFieldOption | null {
  if (typeof value === "string") return value;
  if (!isRecord(value)) return null;

  const label = typeof value.label === "string" ? value.label : null;
  const optionValue = typeof value.value === "string" ? value.value : null;
  if (!label || !optionValue) return null;

  return {
    label,
    value: optionValue,
    description: typeof value.description === "string" ? value.description : undefined,
  };
}

function toSubmissionField(value: unknown): PortalSubmissionField | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const name = typeof value.name === "string" ? value.name : null;
  const label = typeof value.label === "string" ? value.label : null;

  if (!id || !name || !label) return null;

  const options = (Array.isArray(value.options) ? value.options : [])
    .map(toSubmissionFieldOption)
    .filter((option): option is PortalSubmissionFieldOption => option !== null);

  return {
    id,
    name,
    label,
    type: typeof value.type === "string" ? value.type : "text",
    placeholder: typeof value.placeholder === "string" ? value.placeholder : undefined,
    helpText: typeof value.helpText === "string" ? value.helpText : undefined,
    mediaUrl: typeof value.mediaUrl === "string" ? value.mediaUrl : undefined,
    mediaAlt: typeof value.mediaAlt === "string" ? value.mediaAlt : undefined,
    options: options.length > 0 ? options : undefined,
    validationRules: isRecord(value.validationRules) ? value.validationRules : undefined,
    isRequired: typeof value.isRequired === "boolean" ? value.isRequired : false,
    order: typeof value.order === "number" && Number.isFinite(value.order) ? value.order : 0,
  };
}

function toSubmissionSection(value: unknown): PortalSubmissionSection | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const title = typeof value.title === "string" ? value.title : null;
  if (!id || !title) return null;

  const fields = (Array.isArray(value.fields) ? value.fields : [])
    .map(toSubmissionField)
    .filter((field): field is PortalSubmissionField => field !== null);

  return {
    id,
    title,
    description: typeof value.description === "string" ? value.description : undefined,
    fields,
    values: isRecord(value.values) ? value.values : {},
    status: typeof value.status === "string" ? value.status : "pending",
  };
}

function toSubmissionEssay(value: unknown): PortalSubmissionEssay | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const question = typeof value.question === "string" ? value.question : null;
  if (!id || !question) return null;

  return {
    id,
    question,
    isRequired: typeof value.isRequired === "boolean" ? value.isRequired : false,
    wordLimit: typeof value.wordLimit === "number" && Number.isFinite(value.wordLimit) ? value.wordLimit : undefined,
    order: typeof value.order === "number" && Number.isFinite(value.order) ? value.order : 0,
    answer: typeof value.answer === "string" ? value.answer : undefined,
  };
}

function toSubmissionRequirement(value: unknown): PortalSubmissionRequirement | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const name = typeof value.name === "string" ? value.name : null;
  if (!id || !name) return null;

  return {
    id,
    name,
    description: typeof value.description === "string" ? value.description : undefined,
    type: typeof value.type === "string" ? value.type : "document",
    isRequired: typeof value.isRequired === "boolean" ? value.isRequired : false,
    order: typeof value.order === "number" && Number.isFinite(value.order) ? value.order : 0,
    uploadedFile: isRecord(value.uploadedFile) ? value.uploadedFile : undefined,
  };
}

function toProgramOption(value: unknown): PortalProgramOption | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === "string" ? value.id : null;
  const name = typeof value.name === "string" ? value.name : null;
  if (!id || !name) return null;

  return { id, name };
}

function toPortalSubmissionDetail(payload: unknown): PortalSubmissionDetail | null {
  if (!isRecord(payload)) return null;

  const applicationId = typeof payload.applicationId === "string" ? payload.applicationId : null;
  const programId = typeof payload.programId === "string" ? payload.programId : null;
  const programName = typeof payload.programName === "string" ? payload.programName : null;
  const status = typeof payload.status === "string" ? payload.status : null;

  if (!applicationId || !programId || !programName || !status) {
    return null;
  }

  const sections = (Array.isArray(payload.sections) ? payload.sections : [])
    .map(toSubmissionSection)
    .filter((section): section is PortalSubmissionSection => section !== null);
  const essays = (Array.isArray(payload.essays) ? payload.essays : [])
    .map(toSubmissionEssay)
    .filter((essay): essay is PortalSubmissionEssay => essay !== null);
  const requirements = (Array.isArray(payload.requirements) ? payload.requirements : [])
    .map(toSubmissionRequirement)
    .filter((requirement): requirement is PortalSubmissionRequirement => requirement !== null);
  const programs = (Array.isArray(payload.programs) ? payload.programs : [])
    .map(toProgramOption)
    .filter((program): program is PortalProgramOption => program !== null);

  return {
    applicationId,
    programId,
    programName,
    status,
    overallProgress:
      typeof payload.overallProgress === "number" && Number.isFinite(payload.overallProgress)
        ? payload.overallProgress
        : 0,
    sections,
    essays,
    requirements,
    programs: programs.length > 0 ? programs : undefined,
    participantName: typeof payload.participantName === "string" ? payload.participantName : undefined,
    participantId: typeof payload.participantId === "string" ? payload.participantId : undefined,
    participantAccountId:
      typeof payload.participantAccountId === "string" ? payload.participantAccountId : undefined,
    participantLocation:
      typeof payload.participantLocation === "string" ? payload.participantLocation : undefined,
    participantAvatarUrl:
      typeof payload.participantAvatarUrl === "string" ? payload.participantAvatarUrl : undefined,
  };
}

function getOptionLabel(options: PortalSubmissionFieldOption[] | undefined, value: unknown) {
  if (value === null || value === undefined || value === "") return "-";

  const match = options?.find(option => {
    if (typeof option === "string") return option === value;
    return option.value === value;
  });

  if (!match) return String(value);
  return typeof match === "string" ? match : match.label;
}

function normalizeFieldKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isCategoryField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return normalized === "category" || normalized === "applicationcategory" || normalized === "participationcategory" || normalized === "participationcategoryid";
}

function renderFieldValue(field: PortalSubmissionField, value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  const treatAsOptionField = field.type === "select" || field.type === "radio" || isCategoryField(field);

  if (treatAsOptionField) {
    return getOptionLabel(field.options, value);
  }

  if (field.type === "checkbox") {
    const arr = Array.isArray(value) ? value : [value];
    if (arr.length === 0) return "-";
    return arr
      .map((v) => getOptionLabel(field.options, v))
      .filter(Boolean)
      .join(", ");
  }

  return String(value);
}

function isLongFormField(field: PortalSubmissionField) {
  return field.type === "textarea";
}

function shouldSpanFullWidth(field: PortalSubmissionField) {
  if (field.mediaUrl) return true;
  if (isLongFormField(field)) return true;

  const normalized = normalizeFieldKey(field.name);
  const isAddressField = normalized.endsWith("address") && !normalized.includes("email");
  return isAddressField || /(experience|achievement|organization|portfolio|resume|medical|disease|specialneed|essay|twibbon|requirement)/.test(normalized);
}

function FieldRow({
  field,
  value,
  className,
}: {
  field: PortalSubmissionField;
  value: unknown;
  className?: string;
}) {
  const rendered = renderFieldValue(field, value);
  const isLong = isLongFormField(field) || rendered.length > 120;
  const isRemote = field.mediaUrl ? /^https?:\/\//.test(field.mediaUrl) : false;
  const stringValue = value === null || value === undefined ? "" : String(value);
  const isCountry = field.type === "country";
  const isPhone = field.type === "phone";

  return (
    <label className={`${submissionTheme.readFieldLabelWrapper} rounded-xl border border-slate-200 bg-white p-3 shadow-sm ${className ?? ""}`}>
      <span className={submissionTheme.readFieldLabelText}>{field.label}</span>
      {isCountry ? (
        <div className={submissionTheme.readInputBase}>
          <CountryDisplay value={stringValue} />
        </div>
      ) : isPhone ? (
        <div className={submissionTheme.readInputBase}>
          <PhoneDisplay value={stringValue} />
        </div>
      ) : isLong ? (
        <textarea
          readOnly
          className={`${submissionTheme.essayTextarea} ${submissionTheme.readEssayTextarea} min-h-[140px]`}
          value={rendered}
        />
      ) : (
        <input
          readOnly
          className={submissionTheme.readInputBase}
          value={rendered}
        />
      )}
      {field.helpText ? <p className={submissionTheme.readSectionSubtitle}>{field.helpText}</p> : null}
      {field.mediaUrl ? (
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
      ) : null}
    </label>
  );
}

export default function SubmissionReadSection() {
  const [detail, setDetail] = useState<PortalSubmissionDetail | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [programSelectionReady, setProgramSelectionReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (!res.ok) throw new Error(getMessage(json) ?? "Failed to load submission detail");

        const nextDetail = toPortalSubmissionDetail(getEnvelopeData(json));
        if (!cancelled) {
          setDetail(nextDetail);
          setActiveSectionId(nextDetail?.sections?.[0]?.id ?? null);
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

  const sectionEssays = useMemo(() => {
    if (!activeSection || activeSection.id !== "entry_information") return [];
    return [...(detail?.essays ?? [])].sort((left, right) => left.order - right.order);
  }, [activeSection, detail?.essays]);

  if (loading) {
    return <DashboardPageSkeleton variant="submission-read" className={submissionTheme.sectionWrapper} />;
  }

  return (
    <section className={submissionTheme.sectionWrapper}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Submissions", href: "/dashboard/submission" },
          { label: "Registration Form" },
        ]}
      />

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Registration Form</h1>
        <Link
          href="/dashboard/submission/edit"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Pencil className="h-4 w-4" />
          Fill Form
        </Link>
      </div>

      <SubmissionReadProfileHeaderSection />

      {error ? (
        /no active application/i.test(error) ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-base font-semibold text-slate-800">No submission yet</p>
            <p className="mt-1 text-sm text-slate-500">
              You haven&apos;t started your application form. Click <strong>Fill Form</strong> to begin.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )
      ) : null}

      {!loading && detail ? (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Submission Overview</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{detail.programName}</h2>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">Progress:</span> {detail.overallProgress}%
              </div>
            </div>
          </div>

          {/* Tab Buttons - Pill shaped using theme */}
          <div className="flex flex-wrap gap-2">
            {detail.sections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSectionId(section.id)}
                className={`rounded-full border-2 px-8 py-2 text-base font-medium transition-colors ${
                  activeSection?.id === section.id
                    ? "border-primary bg-primary text-white"
                    : "border-primary bg-transparent text-primary hover:bg-primary/10"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {activeSection ? (
            <section className={submissionTheme.readSectionWrapper}>
              <div>
                <h2 className={submissionTheme.readSectionHeader}>
                  <span className={submissionTheme.readSectionIconCircle}>
                    <Info className="h-3.5 w-3.5" />
                  </span>
                  <span>{activeSection.title}</span>
                </h2>
                {activeSection.description ? (
                  <p className={submissionTheme.readSectionSubtitle}>{activeSection.description}</p>
                ) : null}
              </div>

              <div className={`${submissionTheme.readGrid} items-start`}>
                {activeSection.fields.map(field => (
                  <FieldRow
                    key={field.id}
                    field={field}
                    value={activeSection.values[field.name]}
                    className={shouldSpanFullWidth(field) ? "md:col-span-2" : undefined}
                  />
                ))}
              </div>

              {sectionEssays.length > 0 ? (
                <div className={submissionTheme.readEssaySectionWrapper}>
                  <div>
                    <h3 className={submissionTheme.readEssaySectionTitle}>Essay Questions</h3>
                  </div>
                  {sectionEssays.map(essay => (
                    <div key={essay.id} className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800">{essay.question}</p>
                      {essay.wordLimit ? (
                        <p className="text-[11px] text-slate-500">Word limit: {essay.wordLimit}</p>
                      ) : null}
                      <textarea
                        readOnly
                        className={`${submissionTheme.essayTextarea} ${submissionTheme.readEssayTextarea}`}
                        value={essay.answer || "-"}
                      />
                    </div>
                  ))}
                </div>
              ) : null}

              {detail.requirements.length > 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-semibold">Document uploads are handled in a separate flow.</p>
                      <p className="mt-1 text-xs text-amber-800">
                        Required documents: {detail.requirements.map(requirement => requirement.name).join(", ")}.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </section>
          ) : null}
        </>
      ) : null}
    </section>
  );
}
