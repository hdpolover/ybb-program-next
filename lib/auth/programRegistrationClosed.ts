// lib/auth/programRegistrationClosed.ts
//
// Shared shape + client-side persistence for the optional `programRegistration`
// signal returned by /api/auth/local-login, /api/auth/register, and
// /api/auth/firebase-login. The backend sets this when the user authenticated
// in the context of a program whose registration window is closed, so no
// application was created for them. It is absent in the normal open case.

import { toast } from 'sonner';
import { clearExplicitProgramChoice, syncActiveProgramId } from '@/lib/dashboard/activeProgram';
import {
  normalizeRegistrationCategory,
  registrationCategoryLabel,
  type CategoryFallback,
} from '@/lib/registration/categoryPhase';

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
  if (info) {
    toast.warning(buildRegistrationClosedMessage(info));
    persistRegistrationClosedInfo(info);
    return;
  }

  // The other half of the per-category window: the account WAS created, but
  // under a different category than the one asked for, because the requested
  // one had closed (typically an old Fully Funded ad or link). Silence here
  // would leave someone believing they applied Fully Funded.
  const fallback = parseCategoryFallback(value);
  if (fallback) {
    toast.warning(buildCategoryFallbackMessage(fallback));
  }
}

export type ProgramCategoryFallbackInfo = CategoryFallback & { programName?: string };

/**
 * Narrows `programRegistration.categoryFallback` (set by ybb-platform's
 * ensureProgramApplication when the requested category's registration window
 * was not open and the application was created under an open one). Null when
 * absent, malformed, or a no-op (requested === assigned).
 */
export function parseCategoryFallback(value: unknown): ProgramCategoryFallbackInfo | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as { programName?: unknown; categoryFallback?: unknown };
  const raw = candidate.categoryFallback;
  if (!raw || typeof raw !== 'object') return null;

  const requested = normalizeRegistrationCategory(String((raw as { requested?: unknown }).requested ?? ''));
  const assigned = normalizeRegistrationCategory(String((raw as { assigned?: unknown }).assigned ?? ''));
  if (!requested || !assigned || requested === assigned) return null;

  const programName =
    typeof candidate.programName === 'string' && candidate.programName.trim().length > 0
      ? candidate.programName.trim()
      : undefined;
  return { requested, assigned, ...(programName ? { programName } : {}) };
}

export function buildCategoryFallbackMessage(info: ProgramCategoryFallbackInfo): string {
  const requested = registrationCategoryLabel(info.requested);
  const assigned = registrationCategoryLabel(info.assigned);
  const where = info.programName ? ` for ${info.programName}` : '';
  return `${requested} registration${where} has closed; your account was created as ${assigned}.`;
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

/**
 * The programId to pin the dashboard to after an auth response, or null to
 * leave the participant's saved selection alone.
 *
 * Only 'created' qualifies. That is the one case where this login or signup
 * genuinely attached the participant to a program they had no application for,
 * and it is their only application in the brand (the API refuses to create one
 * on login otherwise), so there is nothing else it could be competing with.
 *
 * 'existing' used to pin too, and that is the MEYS 6th/7th bug: the BFF sends
 * the brand's currently-open edition on EVERY login, so 'existing' named
 * whichever edition happened to be open - for anyone holding a phantom 2027
 * draft, the draft - and overwrote their selection on every login. 'closed'
 * names a program they have no application for at all.
 */
export function extractCreatedProgramRegistrationId(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;
  if ((value as { status?: unknown }).status !== 'created') return null;
  return extractProgramRegistrationId(value);
}

/**
 * Post-auth active-program handling shared by the login, signup and Google
 * handlers. A fresh sign-in starts from the engagement ranking rather than a
 * switcher choice some earlier session made in this tab, and the saved
 * selection is only overwritten when this response created the application.
 */
export function applyAuthProgramSelection(programRegistration: unknown): void {
  clearExplicitProgramChoice();
  const createdProgramId = extractCreatedProgramRegistrationId(programRegistration);
  if (createdProgramId) syncActiveProgramId(createdProgramId);
}
