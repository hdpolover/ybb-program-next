// lib/auth/programRegistrationClosed.ts
//
// Shared shape + client-side persistence for the optional `programRegistration`
// signal returned by /api/auth/local-login, /api/auth/register, and
// /api/auth/firebase-login. The backend sets this when the user authenticated
// in the context of a program whose registration window is closed, so no
// application was created for them. It is absent in the normal open case.

import { toast } from 'sonner';

export type ProgramRegistrationClosedInfo = {
  status: 'closed';
  programId: string;
  programName: string;
};

const STORAGE_KEY = 'ybb_registration_closed_program';

/**
 * Narrows an unknown auth-response field into a ProgramRegistrationClosedInfo,
 * or null if it's absent/malformed. Backend responses may nest this under
 * `data` or return it at the top level, mirroring the accessToken fallback
 * pattern already used across the auth BFF routes.
 */
export function parseProgramRegistrationClosed(value: unknown): ProgramRegistrationClosedInfo | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as Partial<ProgramRegistrationClosedInfo>;
  if (
    candidate.status === 'closed' &&
    typeof candidate.programId === 'string' &&
    candidate.programId.trim().length > 0 &&
    typeof candidate.programName === 'string' &&
    candidate.programName.trim().length > 0
  ) {
    return { status: 'closed', programId: candidate.programId, programName: candidate.programName };
  }

  return null;
}

export function buildRegistrationClosedMessage(info: ProgramRegistrationClosedInfo): string {
  return `Registration for ${info.programName} has closed, so no application was created. You're signed in, but there's nothing to continue for this program yet.`;
}

/**
 * Persists the closed signal for the current tab session so the dashboard can
 * echo it (e.g. the progress card) after the auth-time toast has disappeared.
 * Session-scoped on purpose: it should not leak into a later, unrelated login.
 */
export function persistRegistrationClosedInfo(info: ProgramRegistrationClosedInfo): void {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch {
    // Ignore storage failures (private browsing, quota, etc.) — the auth-time
    // toast already told the user, this is just the dashboard echo.
  }
}

export function readRegistrationClosedInfo(): ProgramRegistrationClosedInfo | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return parseProgramRegistrationClosed(JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * Single entry point for the three auth BFF response handlers on the login
 * page. Surfaces an immediate, impossible-to-miss toast (the Toaster is
 * mounted globally in SettingsProvider, so it survives the router.push that
 * follows) and persists the signal for the dashboard to echo afterwards.
 * No-ops when the field is absent, so the normal open-registration flow is
 * untouched.
 */
export function notifyIfRegistrationClosed(value: unknown): void {
  const info = parseProgramRegistrationClosed(value);
  if (!info) return;

  toast.warning(buildRegistrationClosedMessage(info));
  persistRegistrationClosedInfo(info);
}

/**
 * Narrows the same `programRegistration` field down to just the programId,
 * regardless of status ('created' | 'existing' | 'closed') — unlike
 * parseProgramRegistrationClosed above, which only matches 'closed'. Used to
 * pin the dashboard's active-program selector (ybb_active_program_id, see
 * lib/dashboard/activeProgram.ts) to whatever program the auth response
 * actually attached the participant to, in the two normal (non-closed) cases
 * this field is populated for.
 */
export function extractProgramRegistrationId(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;

  const candidate = value as { programId?: unknown };
  return typeof candidate.programId === 'string' && candidate.programId.trim().length > 0
    ? candidate.programId
    : null;
}
