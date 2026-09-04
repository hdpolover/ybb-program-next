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
  const closeMs = parseDate(program.registrationCloseDate);

  // Degenerate configurations, decided here rather than left emergent:
  //  - close BEFORE open: a window no visitor can ever be inside. It is a
  //    misconfiguration, and the only safe reading is 'closed'. Reporting
  //    'upcoming' would promise an opening that can never arrive.
  //  - open === close: a real, instantaneous window; it opens and shuts on
  //    that instant, which the comparisons below already handle.
  //  - an unparseable date: treated as ABSENT, i.e. no constraint, matching
  //    the backend's `!registrationOpenDate` shape. Absent dates are the
  //    normal case for programmes gated only by allowRegistration.
  if (openMs !== null && closeMs !== null && closeMs < openMs) return 'closed';

  if (openMs !== null && openMs > nowMs) return 'upcoming';
  if (closeMs !== null && closeMs < nowMs) return 'closed';

  return 'open';
}

export function isProgramRegistrationOpen(
  program: RegistrationGateProgram | null | undefined,
  now: Date = new Date(),
): boolean {
  return getRegistrationPhase(program, now) === 'open';
}

/**
 * The phase the site-wide chrome (navbar CTA, countdown banner, sticky Register
 * bar) should present, given the window that won the countdown and the
 * programme's own gate.
 *
 * Extracted from app/layout.tsx because the bug lived in this one expression and
 * a server layout cannot be unit tested. It read `winnerPhase ?? 'open'`, so a
 * programme with `allowRegistration: false` produced no winning window, fell
 * through the ??, and the navbar advertised REGISTER NOW for a programme the
 * backend refuses. Korea Youth Summit 4th did exactly that on 2026-09-04, with
 * zero applications across every KYS programme ever recorded.
 *
 * The programme phase is consulted BEFORE defaulting, because that is where the
 * isPublished/isActive/allowRegistration kill switch lives. Defaulting to
 * 'open' survives only for the case it was written for: no programme could be
 * loaded at all, where a transient fetch failure must not blank the CTA.
 */
export function resolveChromePhase(
  winnerPhase: RegistrationPhase | null | undefined,
  programPhase: RegistrationPhase | null | undefined,
): RegistrationPhase {
  // The programme gate takes PRECEDENCE, it is not a fallback. This shipped
  // once as `winnerPhase ?? programPhase ?? 'open'` and did nothing for the case
  // it was written for: Korea Youth Summit 4th has allowRegistration:false AND
  // open pricing-tier windows, so a window won, reported 'open', and the kill
  // switch was never consulted. getRegistrationPhase's own docblock says the
  // publish/active/allowRegistration flags are "a hard kill switch checked
  // first" - checked FIRST, not last.
  //
  // A closed programme cannot be reopened by a tier window, because the backend
  // will refuse the registration regardless of what the tiers say.
  if (programPhase === 'closed') return 'closed';
  return winnerPhase ?? programPhase ?? 'open';
}
