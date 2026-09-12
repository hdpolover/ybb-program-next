export const ACTIVE_PROGRAM_STORAGE_KEY = "ybb_active_program_id";
export const ACTIVE_PROGRAM_CHANGED_EVENT = "ybb:active-program-changed";

type ProgramReference = {
  id?: string | null;
  programId?: string | null;
  applicationStatus?: string | null;
};

/**
 * How much of a stake the participant actually has in an application.
 *
 * Every source of registeredPrograms orders by createdAt DESC, so array order
 * means "newest application first". That is the wrong default the moment a
 * brand runs two editions at once: a MEYS 2026 participant who had submitted
 * and paid was landed on an untouched MEYS 2027 draft, where their invitation
 * letter and documents simply do not exist. 1,040 participants were holding
 * such a second application when this was reported.
 *
 * Ranking by stake instead of recency puts them back on the application they
 * are actually invested in, and it needs no registration-window data - only
 * the applicationStatus every caller already receives.
 *
 * Withdrawn and rejected rank BELOW a draft on purpose: a dead application is
 * not somewhere to land someone when they have a live one elsewhere.
 */
const DEAD_STATUSES = new Set(["withdrawn", "rejected"]);
const ENGAGED_STATUSES = new Set([
  "submitted",
  "under_review",
  "interview_scheduled",
  "waitlisted",
  "accepted",
]);

function getEngagementRank(program: ProgramReference): number {
  const status = (program.applicationStatus ?? "").trim().toLowerCase();
  if (DEAD_STATUSES.has(status)) return 0;
  if (ENGAGED_STATUSES.has(status)) return 2;
  // draft, unknown, or absent: live but uninvested.
  return 1;
}

export function readActiveProgramId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

function getProgramReferenceId(program: ProgramReference): string | null {
  if (typeof program.programId === "string" && program.programId.trim().length > 0) {
    return program.programId;
  }

  if (typeof program.id === "string" && program.id.trim().length > 0) {
    return program.id;
  }

  return null;
}

export function resolveActiveProgramId<T extends ProgramReference>(
  programs: T[],
  candidateProgramId?: string | null,
): string | null {
  const availableIds = programs
    .map(getProgramReferenceId)
    .filter((programId): programId is string => Boolean(programId));

  if (availableIds.length === 0) {
    return candidateProgramId?.trim() || null;
  }

  if (candidateProgramId && availableIds.includes(candidateProgramId)) {
    return candidateProgramId;
  }

  // No stored choice (or a stale one): pick the application the participant has
  // the most stake in, NOT simply the newest. `>` rather than `>=` keeps the
  // first of equals, so within one rank this still falls back to array order.
  const best = programs
    .filter((program) => getProgramReferenceId(program) !== null)
    .reduce<T | null>(
      (winner, program) =>
        winner === null || getEngagementRank(program) > getEngagementRank(winner) ? program : winner,
      null,
    );

  return (best && getProgramReferenceId(best)) ?? availableIds[0] ?? null;
}

export function appendProgramId(path: string, programId?: string | null): string {
  if (!programId) return path;

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}programId=${encodeURIComponent(programId)}`;
}

export function syncActiveProgramId(programId: string): void {
  if (typeof window === "undefined") return;

  // Only announce a real change. Announcing unconditionally let two components
  // syncing different editions ping-pong: each dispatch made the other re-sync
  // and dispatch back, and every bounce refetched
  // usePortalSubmissionProgress. Harmless while a brand had one open edition;
  // once MEYS ran its 6th and 7th concurrently it became a request storm that
  // the API rate limiter had to absorb.
  let changed = true;
  try {
    changed = window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY) !== programId;
    if (changed) {
      window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, programId);
    }
  } catch {
    // Storage unavailable (private mode, blocked cookies): fall back to
    // announcing, since we cannot tell whether this is a repeat.
    changed = true;
  }

  if (!changed) return;

  announceActiveProgramChange(programId);
}

export function announceActiveProgramChange(programId: string): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(ACTIVE_PROGRAM_CHANGED_EVENT, {
      detail: { programId },
    }),
  );
}
