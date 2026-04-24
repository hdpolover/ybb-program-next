"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import type { PortalSubmissionProgress } from "@/types/portal-submission";

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

function toPortalSubmissionProgress(payload: unknown): PortalSubmissionProgress | null {
  if (!isRecord(payload)) return null;

  const applicationId = typeof payload.applicationId === "string" ? payload.applicationId : null;
  const programName = typeof payload.programName === "string" ? payload.programName : null;
  const status = typeof payload.status === "string" ? payload.status : null;
  const overallProgress =
    typeof payload.overallProgress === "number" && Number.isFinite(payload.overallProgress)
      ? payload.overallProgress
      : 0;

  if (!applicationId || !programName || !status) {
    return null;
  }

  const sections = (Array.isArray(payload.sections) ? payload.sections : [])
    .filter(isRecord)
    .map((section) => {
      const id = typeof section.id === "string" ? section.id : "";
      const title = typeof section.title === "string" ? section.title : "";

      if (!id || !title) return null;

      return {
        id,
        title,
        description: typeof section.description === "string" ? section.description : undefined,
        status: typeof section.status === "string" ? section.status : "pending",
        isRequired: typeof section.isRequired === "boolean" ? section.isRequired : true,
        updatedAt: typeof section.updatedAt === "string" ? section.updatedAt : undefined,
      };
    })
    .filter((section): section is NonNullable<typeof section> => section !== null);

  return {
    applicationId,
    programName,
    status,
    overallProgress,
    sections,
  };
}

export function usePortalSubmissionProgress() {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState<PortalSubmissionProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncSelectedProgram = () => {
      setSelectedProgramId(readActiveProgramId());
      setReady(true);
    };

    syncSelectedProgram();
    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);

    return () => {
      window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, syncSelectedProgram as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(appendProgramId("/api/portal/submissions", selectedProgramId), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await response.json().catch(() => null)) as unknown;
        if (!response.ok) {
          throw new Error(getMessage(json) ?? "Failed to load submission progress");
        }

        if (!cancelled) {
          setSubmissionProgress(toPortalSubmissionProgress(getEnvelopeData(json)));
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load submission progress");
          setSubmissionProgress(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, selectedProgramId]);

  const currentStepIndex = useMemo(() => {
    if (!submissionProgress?.sections?.length) return 0;

    const inProgressIndex = submissionProgress.sections.findIndex((section) => section.status === "in_progress");
    if (inProgressIndex >= 0) return inProgressIndex;

    const pendingIndex = submissionProgress.sections.findIndex((section) => section.status === "pending");
    if (pendingIndex >= 0) return pendingIndex;

    const completedIndex = submissionProgress.sections.findLastIndex((section) => section.status === "completed");
    return completedIndex >= 0 ? completedIndex : 0;
  }, [submissionProgress?.sections]);

  return {
    submissionProgress,
    currentStepIndex,
    loading,
    error,
  };
}