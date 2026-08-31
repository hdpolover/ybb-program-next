import { describe, it, expect } from 'vitest';

// Mirrors the precedence in app/api/auth/firebase-login/route.ts. The API's
// resolveAuthTargetProgram checks programId BEFORE programSlug, so an explicit
// choice from the signup form must clear the context's programId, otherwise the
// server's pick silently wins and we are back to the 2026-08-31 incident.
function resolveTarget(
  ctx: { programId?: string; programSlug?: string },
  body: { programSlug?: string },
) {
  let programId = ctx.programId;
  let programSlug = ctx.programSlug;
  const chosen = typeof body.programSlug === 'string' ? body.programSlug.trim() : '';
  if (chosen && chosen !== programSlug) {
    programSlug = chosen;
    programId = undefined;
  }
  return { programId, programSlug };
}

describe('google signup edition choice', () => {
  const ctx = { programId: 'id-7th', programSlug: 'meys-7th' };

  it('honours the chosen edition and drops the server-picked id', () => {
    expect(resolveTarget(ctx, { programSlug: 'meys-6th' })).toEqual({
      programId: undefined,
      programSlug: 'meys-6th',
    });
  });

  it('keeps the server pick when no choice was made', () => {
    expect(resolveTarget(ctx, {})).toEqual({ programId: 'id-7th', programSlug: 'meys-7th' });
  });

  it('ignores a blank or whitespace choice', () => {
    expect(resolveTarget(ctx, { programSlug: '   ' })).toEqual(ctx);
  });

  it('leaves the id in place when the choice matches the server pick', () => {
    expect(resolveTarget(ctx, { programSlug: 'meys-7th' })).toEqual(ctx);
  });
});
