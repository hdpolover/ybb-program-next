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
 * user register" for a program must go through `getRegistrationPhase` (or
 * `isProgramRegistrationOpen`) rather than re-deriving the rule.
 *
 * The answer is TRI-state, not boolean: a program whose registrationOpenDate
 * has not arrived yet is `upcoming`, not `closed`. Labelling it "Registration
 * Closed" tells a prospective participant to go away days before you want
 * them signing up (Korea Youth Summit 4th, 2026-09-03: tiers opened 5 Sep
 * while every surface read "Closed" next to a live 183-day countdown).
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

/** Registration lifecycle phase. Shared by the program-level gate here and the
 * validity-window gate in ./isRegistrationOpen, so the two never invent
 * competing vocabularies for the same three states. */
export type RegistrationPhase = 'upcoming' | 'open' | 'closed';

/**
 * The program-level phase. The publish/active/allowRegistration flags are a
 * hard kill switch checked first (that is exactly what the backend does), so a
 * program with `allowRegistration: false` is `closed` regardless of its dates.
 */
export function getRegistrationPhase(
  program: RegistrationGateProgram | null | undefined,
  now: Date = new Date(),
): RegistrationPhase {
  if (!program) return 'closed';
  if (!program.isPublished || !program.isActive || !program.allowRegistration) return 'closed';

  const nowMs = now.getTime();

  const openMs = parseDate(program.registrationOpenDate);
  if (openMs !== null && openMs > nowMs) return 'upcoming';

  const closeMs = parseDate(program.registrationCloseDate);
  if (closeMs !== null && closeMs < nowMs) return 'closed';

  return 'open';
}

export function isProgramRegistrationOpen(
  program: RegistrationGateProgram | null | undefined,
  now: Date = new Date(),
): boolean {
  return getRegistrationPhase(program, now) === 'open';
}
