export const ACTIVE_PROGRAM_STORAGE_KEY = "ybb_active_program_id";
/**
 * sessionStorage, not localStorage: marks the program the participant PICKED in
 * the switcher during this tab session, as opposed to one some code path synced
 * automatically. See resolveActiveProgramId for why the difference matters.
 */
export const EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY = "ybb_active_program_explicit";
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

/**
 * The program the participant deliberately switched to in this tab, if any.
 * Session-scoped on purpose: it should outlive navigation and reloads, but a new
 * login (or a new tab) re-derives the landing program from engagement.
 */
export function readExplicitProgramChoice(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage.getItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function clearExplicitProgramChoice(): void {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY);
  } catch {
    // Storage unavailable: there is nothing stored to clear either.
  }
}

/**
 * The effective selection. A choice made in THIS tab's switcher wins over the
 * shared localStorage value, which another tab may have re-resolved since.
 */
export function readActiveProgramId(): string | null {
  if (typeof window === "undefined") return null;

  const explicit = readExplicitProgramChoice();
  if (explicit) return explicit;

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

/**
 * Which of the participant's applications the dashboard should show.
 *
 * A stored id only wins when it ranks at least as high as the best application
 * available, or when the participant explicitly picked it in this session.
 *
 * Why a stored id cannot simply win: before the login fix, every login pinned
 * ybb_active_program_id to the edition the BFF happened to request - for MEYS
 * participants that was a phantom 2027 draft - and localStorage outlives the
 * fix. Honouring any stored id would keep those participants on the empty draft
 * forever, away from their submitted 2026 application and its invitation letter.
 * Nothing in storage records whether the value was chosen or synced, so rank is
 * the tiebreaker, and the explicit, session-scoped marker (written only by the
 * switcher, see chooseActiveProgramId) is what lets a deliberate switch to a
 * lower-ranked draft still stick.
 *
 * `explicitProgramId` defaults to this tab's marker; tests pass it directly.
 */
export function resolveActiveProgramId<T extends ProgramReference>(
  programs: T[],
  candidateProgramId?: string | null,
  explicitProgramId: string | null = readExplicitProgramChoice(),
): string | null {
  const availableIds = programs
    .map(getProgramReferenceId)
    .filter((programId): programId is string => Boolean(programId));

  if (availableIds.length === 0) {
    return candidateProgramId?.trim() || null;
  }

  // Pick the application the participant has the most stake in, NOT simply the
  // newest. `>` rather than `>=` keeps the first of equals, so within one rank
  // this still falls back to array order.
  const best = programs
    .filter((program) => getProgramReferenceId(program) !== null)
    .reduce<T | null>(
      (winner, program) =>
        winner === null || getEngagementRank(program) > getEngagementRank(winner) ? program : winner,
      null,
    );

  if (candidateProgramId && availableIds.includes(candidateProgramId)) {
    if (candidateProgramId === explicitProgramId) {
      return candidateProgramId;
    }

    const candidate = programs.find((program) => getProgramReferenceId(program) === candidateProgramId);
    if (!best || !candidate || getEngagementRank(candidate) >= getEngagementRank(best)) {
      return candidateProgramId;
    }
  }

  return (best && getProgramReferenceId(best)) ?? availableIds[0] ?? null;
}

export function appendProgramId(path: string, programId?: string | null): string {
  if (!programId) return path;

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}programId=${encodeURIComponent(programId)}`;
}

/**
 * Persist an AUTOMATIC selection (a resolver's correction, a detail response
 * naming its program). Not for user choices: see chooseActiveProgramId.
 */
export function syncActiveProgramId(programId: string): void {
  if (typeof window === "undefined") return;

  // An automatic sync that disagrees with this tab's explicit choice means the
  // resolver already rejected that choice (the program is gone from the list),
  // so the marker is stale and must not keep overriding readActiveProgramId.
  const explicit = readExplicitProgramChoice();
  if (explicit && explicit !== programId) {
    clearExplicitProgramChoice();
  }

  persistAndAnnounce(programId, explicit ?? undefined);
}

/**
 * The participant picked a program in the switcher. Marks it explicit for this
 * tab session so the engagement ranking cannot override it, then persists and
 * announces it once.
 */
export function chooseActiveProgramId(programId: string): void {
  if (typeof window === "undefined") return;

  const previous = readActiveProgramId();
  try {
    window.sessionStorage.setItem(EXPLICIT_PROGRAM_CHOICE_STORAGE_KEY, programId);
  } catch {
    // Storage unavailable: the choice still applies to this page view via the
    // event below, it just cannot outrank the resolver after a reload.
  }

  persistAndAnnounce(programId, previous ?? undefined);
}

function persistAndAnnounce(programId: string, previousEffective?: string): void {
  // Only announce a real change. Announcing unconditionally let two components
  // syncing different editions ping-pong: each dispatch made the other re-sync
  // and dispatch back, and every bounce refetched
  // usePortalSubmissionProgress. Harmless while a brand had one open edition;
  // once MEYS ran its 6th and 7th concurrently it became a request storm that
  // the API rate limiter had to absorb.
  let changed = true;
  try {
    const stored = window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY);
    if (stored !== programId) {
      window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, programId);
    }
    // Compare against what readers were actually being served, which is the
    // explicit choice when one was set, not necessarily localStorage.
    changed = (previousEffective ?? stored) !== programId;
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
