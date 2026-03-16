"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, FileText, Info } from "lucide-react";
import Image from "next/image";
import { componentsTheme } from "@/lib/theme/components";
import SubmissionReadProfileHeaderSection from "./submission/SubmissionReadProfileHeaderSection";
import type {
  PortalSubmissionDetail,
  PortalSubmissionField,
  PortalSubmissionFieldOption,
  PortalSubmissionSection,
} from "@/types/portal-submission";

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

function renderFieldValue(field: PortalSubmissionField, value: unknown) {
  if (value === null || value === undefined || value === "") return "-";

  if (field.type === "select") {
    return getOptionLabel(field.options, value);
  }

  return String(value);
}

function FieldRow({ field, value }: { field: PortalSubmissionField; value: unknown }) {
  const rendered = renderFieldValue(field, value);
  const isLong = field.type === "textarea" || rendered.length > 120;
  const isRemote = field.mediaUrl ? /^https?:\/\//.test(field.mediaUrl) : false;

  return (
    <label className={submissionTheme.readFieldLabelWrapper}>
      <span className={submissionTheme.readFieldLabelText}>{field.label}</span>
      {isLong ? (
        <textarea
          readOnly
          className={`${submissionTheme.essayTextarea} ${submissionTheme.readEssayTextarea}`}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/portal/submissions/detail", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await res.json().catch(() => ({}))) as any;
        if (!res.ok) throw new Error(json?.message || "Failed to load submission detail");

        const nextDetail = (json?.data ?? null) as PortalSubmissionDetail | null;
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
  }, []);

  const activeSection = useMemo(() => {
    return detail?.sections.find(section => section.id === activeSectionId) ?? detail?.sections[0] ?? null;
  }, [activeSectionId, detail?.sections]);

  const sectionEssays = useMemo(() => {
    if (!activeSection || activeSection.id !== "entry_information") return [];
    return [...(detail?.essays ?? [])].sort((left, right) => left.order - right.order);
  }, [activeSection, detail?.essays]);

  return (
    <section className={submissionTheme.sectionWrapper}>
      <SubmissionReadProfileHeaderSection />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 shadow-sm">
          Loading submission form...
        </div>
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

          <div className={submissionTheme.tabsWrapper}>
            {detail.sections.map(section => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSectionId(section.id)}
                className={`${submissionTheme.tabButtonBase} ${
                  activeSection?.id === section.id
                    ? submissionTheme.tabButtonActive
                    : submissionTheme.tabButtonInactive
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

              <div className={submissionTheme.readGrid}>
                {activeSection.fields.map(field => (
                  <FieldRow
                    key={field.id}
                    field={field}
                    value={activeSection.values[field.name]}
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
