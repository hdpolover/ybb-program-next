export const ACTIVE_PROGRAM_STORAGE_KEY = "ybb_active_program_id";
export const ACTIVE_PROGRAM_CHANGED_EVENT = "ybb:active-program-changed";

export function readActiveProgramId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function appendProgramId(path: string, programId?: string | null): string {
  if (!programId) return path;

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}programId=${encodeURIComponent(programId)}`;
}

export function announceActiveProgramChange(programId: string): void {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(ACTIVE_PROGRAM_CHANGED_EVENT, {
      detail: { programId },
    }),
  );
}