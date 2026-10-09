// lib/server/joinableProgram.ts
import { fetchAuthContext } from '@/lib/api/authContext';
import { getProgramDetail } from '@/lib/api/programs';
import { getRegistrationPhase } from '@/lib/registration/status';

export type JoinableProgram = { id: string; name: string };

/**
 * The brand's open edition, if the participant has no application on it.
 *
 * "Open edition" is whatever the login BFF already attaches to every login (the
 * auth-context program), gated by the same getRegistrationPhase the rest of the
 * portal uses so allowRegistration beats the dates. Best-effort: /me must never
 * fail over an optional call to action, so any error resolves to null.
 */
export async function resolveJoinableProgram(
  brandDomain: string,
  registeredProgramIds: readonly string[],
): Promise<JoinableProgram | null> {
  try {
    const ctx = await fetchAuthContext(brandDomain);
    if (!ctx.programId || !ctx.programSlug) return null;
    if (registeredProgramIds.includes(ctx.programId)) return null;

    const program = await getProgramDetail(ctx.programSlug, brandDomain);
    if (!program || program.id !== ctx.programId) return null;
    if (getRegistrationPhase(program) !== 'open') return null;

    return { id: program.id, name: program.name };
  } catch {
    return null;
  }
}
