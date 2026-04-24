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
import { getEnvelopeData, getMessage } from "@/lib/api/response";
import { toPortalSubmissionDetail } from "@/lib/dashboard/submissionParser";
import { FieldHelpAssets } from "@/components/dashboard/sections/FieldHelpAssets";
import type {
  PortalSubmissionDetail,
  PortalSubmissionField,
  PortalSubmissionFieldOption,
} from "@/types/portal-submission";
import Breadcrumb from "@/components/dashboard/ui/Breadcrumb";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";
import { CountryDisplay } from "@/components/dashboard/fields/CountryDisplay";
import { PhoneDisplay } from "@/components/dashboard/fields/PhoneDisplay";

const submissionTheme = componentsTheme.dashboardSubmission;

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

function getFieldInputType(field: PortalSubmissionField) {
  const rules = field.validationRules;
  if (!rules || typeof rules !== "object") return "";

  const inputType = (rules as Record<string, unknown>).inputType;
  return typeof inputType === "string" ? inputType.toLowerCase() : "";
}

function isCountrySelectorField(field: PortalSubmissionField) {
  if (field.type === "country") return true;
  return getFieldInputType(field) === "country_select";
}

function isProfilePhotoField(field: PortalSubmissionField) {
  const normalized = normalizeFieldKey(field.name);
  return normalized === "pictureurl" || normalized === "profilephotourl" || normalized === "profilepictureurl";
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
  const isCountry = isCountrySelectorField(field);
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
      <FieldHelpAssets items={field.helpAssets} className="mt-2" />
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
                {activeSection.fields.filter(field => !isProfilePhotoField(field)).map(field => (
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
