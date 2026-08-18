/**
 * Registration open/closed gating.
 *
 * Mirrors the backend eligibility gate exactly (see platform API
 * `get-program-detail.handler.ts` / `list-programs.handler.ts` callers):
 *
 *   isPublished && isActive && allowRegistration
 *     && (!registrationOpenDate || registrationOpenDate <= now)
 *     && (!registrationCloseDate || registrationCloseDate >= now)
 *
 * The portal must not present registration as open (CTA, apply-flow links)
 * for a program the backend would reject -- otherwise users click through
 * and get turned away at submit time. Any call site that decides "can this
 * user register" for a program must go through `isProgramRegistrationOpen`
 * rather than re-deriving the rule.
 */

export type RegistrationGateProgram = {
  isPublished: boolean;
  isActive: boolean;
  allowRegistration: boolean;
  registrationOpenDate?: string | null;
  registrationCloseDate?: string | null;
};

function parseDate(value: string | null | undefined): number | null {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

export function isProgramRegistrationOpen(
  program: RegistrationGateProgram | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!program) return false;
  if (!program.isPublished || !program.isActive || !program.allowRegistration) return false;

  const nowMs = now.getTime();

  const openMs = parseDate(program.registrationOpenDate);
  if (openMs !== null && openMs > nowMs) return false;

  const closeMs = parseDate(program.registrationCloseDate);
  if (closeMs !== null && closeMs < nowMs) return false;

  return true;
}
