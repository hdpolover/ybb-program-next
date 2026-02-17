"use client";

import { useEffect, useMemo, useState } from "react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import SubmissionReadProfileHeaderSection from "./submission/SubmissionReadProfileHeaderSection";
import SubmissionReadPersonalDetailsSection from "./submission/SubmissionReadPersonalDetailsSection";
import SubmissionReadProfessionalProfileSection from "./submission/SubmissionReadProfessionalProfileSection";
import SubmissionReadEntryInformationSection from "./submission/SubmissionReadEntryInformationSection";
import SubmissionReadMiscSection from "./submission/SubmissionReadMiscSection";

const submissionTheme = jysSectionTheme.dashboardSubmission;

const tabs = ["Personal Details", "Professional Profile", "Entry Information", "Miscellaneous"] as const;

type TabKey = (typeof tabs)[number];

type SubmissionProgressSection = {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "pending" | string;
  isRequired?: boolean;
};

type SubmissionProgressData = {
  applicationId?: string;
  programName?: string;
  status?: string;
  overallProgress?: number;
  sections?: SubmissionProgressSection[];
};

export default function SubmissionReadSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("Personal Details");
  const [submissionProgress, setSubmissionProgress] = useState<SubmissionProgressData | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSubmissionLoading(true);
    setSubmissionError(null);

    (async () => {
      try {
        const res = await fetch("/api/portal/submissions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const json = (await res.json().catch(() => ({}))) as any;
        if (!res.ok) {
          throw new Error(json?.message || "Failed to fetch submissions");
        }

        if (!cancelled) {
          const data = (json?.data ?? null) as SubmissionProgressData | null;
          setSubmissionProgress(data);
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to fetch submissions";
        if (!cancelled) setSubmissionError(msg);
      } finally {
        if (!cancelled) setSubmissionLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const progressPercentage = useMemo(() => {
    const pct = submissionProgress?.overallProgress;
    if (typeof pct !== "number" || Number.isNaN(pct)) return 0;
    return Math.min(100, Math.max(0, Math.round(pct)));
  }, [submissionProgress?.overallProgress]);

  const sections = submissionProgress?.sections ?? [];
  const requiredPendingCount = useMemo(() => {
    return sections.filter(s => s?.isRequired && String(s?.status).toLowerCase() !== "completed").length;
  }, [sections]);

  return (
    <section className={submissionTheme.sectionWrapper}>
      <SubmissionReadProfileHeaderSection />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Submission Progress</p>
            <p className="mt-1 text-sm font-extrabold text-slate-900">
              {submissionProgress?.programName || "Your Application"}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Status: <span className="font-semibold text-slate-800">{submissionProgress?.status || "-"}</span>
              {requiredPendingCount > 0 ? (
                <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                  {requiredPendingCount} required section(s) pending
                </span>
              ) : null}
            </p>
          </div>

          <div className="min-w-[220px]">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>Overall</span>
              <span className="text-slate-900">{progressPercentage}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
              <div className="h-full rounded-full bg-pink-600" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        </div>

        {submissionLoading ? (
          <div className="mt-4 text-xs font-semibold text-slate-500">Loading sections...</div>
        ) : submissionError ? (
          <div className="mt-4 text-xs font-semibold text-red-600">{submissionError}</div>
        ) : sections.length > 0 ? (
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {sections.map(section => {
              const status = String(section?.status || "").toLowerCase();
              const isCompleted = status === "completed";
              const pillCls = isCompleted
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : "bg-slate-100 text-slate-600 ring-slate-200";

              return (
                <div
                  key={section.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{section.title}</p>
                      {section.description ? (
                        <p className="mt-1 text-xs text-slate-600">{section.description}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${pillCls}`}>
                        {isCompleted ? "Completed" : "Pending"}
                      </span>
                      {section.isRequired ? (
                        <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-pink-700 ring-1 ring-pink-200">
                          Required
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 text-xs font-semibold text-slate-500">No sections available.</div>
        )}
      </div>

      {/* Tabs */}
      <div className={submissionTheme.tabsWrapper}>
        {tabs.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`${submissionTheme.tabButtonBase} ${
              activeTab === tab
                ? submissionTheme.tabButtonActive
                : submissionTheme.tabButtonInactive
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Personal Details" && <SubmissionReadPersonalDetailsSection />}
      {activeTab === "Professional Profile" && <SubmissionReadProfessionalProfileSection />}
      {activeTab === "Entry Information" && <SubmissionReadEntryInformationSection />}
      {activeTab === "Miscellaneous" && <SubmissionReadMiscSection />}
    </section>
  );
}
