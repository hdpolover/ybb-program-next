"use client";

// components/dashboard/layout/JoinEditionNotice.tsx
import { useState } from "react";
import { toast } from "sonner";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/button";
import {
  buildCategoryFallbackMessage,
  buildRegistrationClosedMessage,
  parseCategoryFallback,
} from "@/lib/auth/programRegistrationClosed";

export type JoinableProgram = { id: string; name: string };

type JoinResult = {
  status: "created" | "existing" | "closed";
  programId: string;
  programName: string;
  categoryFallback?: unknown;
};

/** Reads the BFF envelope defensively: `data` may or may not wrap the payload. */
export function parseJoinResult(json: unknown): JoinResult | null {
  if (!json || typeof json !== "object") return null;
  const envelope = json as { data?: unknown };
  const payload = (envelope.data && typeof envelope.data === "object" ? envelope.data : json) as Partial<JoinResult>;
  const { status, programId, programName } = payload;
  if (status !== "created" && status !== "existing" && status !== "closed") return null;
  if (typeof programId !== "string" || !programId) return null;
  return {
    status,
    programId,
    programName: typeof programName === "string" && programName ? programName : "this program",
    categoryFallback: payload.categoryFallback,
  };
}

const JOIN_ERROR_MESSAGE = "We couldn't add you to this program. Please try again.";

export default function JoinEditionNotice({
  program,
  onJoined,
}: {
  program: JoinableProgram;
  /** Resolves once the dashboard's registeredPrograms include the new application. */
  onJoined: (programId: string) => Promise<void>;
}) {
  const [isPending, setIsPending] = useState(false);

  async function handleJoin() {
    if (isPending) return;
    setIsPending(true);
    try {
      const res = await fetch("/api/portal/join-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programId: program.id }),
      });
      const json: unknown = await res.json().catch(() => null);
      const result = res.ok ? parseJoinResult(json) : null;
      if (!result) {
        const message = (json as { message?: unknown } | null)?.message;
        toast.error(!res.ok && typeof message === "string" && message ? message : JOIN_ERROR_MESSAGE);
        return;
      }

      if (result.status === "closed") {
        toast.warning(buildRegistrationClosedMessage({ status: "closed", programId: result.programId, programName: result.programName }));
        return;
      }

      await onJoined(result.programId);
      toast.success(`You're in. Continue your application for ${result.programName}.`);
      const fallback = parseCategoryFallback({ categoryFallback: result.categoryFallback, programName: result.programName });
      if (fallback) toast.warning(buildCategoryFallbackMessage(fallback));
    } catch {
      toast.error(JOIN_ERROR_MESSAGE);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Alert variant="info" className="flex-1">
        Registration for {program.name} is open.
      </Alert>
      <Button type="button" size="sm" onClick={handleJoin} disabled={isPending} aria-busy={isPending} className="disabled:opacity-60">
        Apply for {program.name}
      </Button>
    </div>
  );
}
