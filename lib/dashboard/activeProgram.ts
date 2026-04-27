export const ACTIVE_PROGRAM_STORAGE_KEY = "ybb_active_program_id";
export const ACTIVE_PROGRAM_CHANGED_EVENT = "ybb:active-program-changed";

type ProgramReference = {
  id?: string | null;
  programId?: string | null;
};

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

  return availableIds[0] ?? null;
}

export function appendProgramId(path: string, programId?: string | null): string {
  if (!programId) return path;

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}programId=${encodeURIComponent(programId)}`;
}

export function syncActiveProgramId(programId: string): void {
  if (typeof window === "undefined") return;

  try {
    if (window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY) !== programId) {
      window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, programId);
    }
  } catch {
    // Ignore storage failures and still notify in-memory listeners.
  }

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
