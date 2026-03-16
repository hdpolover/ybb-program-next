"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";
import type { PortalSubmissionProgress } from "@/types/portal-submission";

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

        const json = (await response.json().catch(() => ({}))) as any;
        if (!response.ok) {
          throw new Error(json?.message || "Failed to load submission progress");
        }

        if (!cancelled) {
          setSubmissionProgress((json?.data ?? null) as PortalSubmissionProgress | null);
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