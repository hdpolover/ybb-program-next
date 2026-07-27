// lib/auth/loginMode.ts

export type LoginMode = 'login' | 'signup';

/**
 * Decides which form /login should show for a given set of search params.
 *
 * `applicationCategory` counts as sign-up intent: every "Register" CTA on the
 * site links to /login?applicationCategory=..., and without this those buttons
 * land a visitor with no account on a password prompt. An explicit `mode`
 * always wins, so the "Sign in here" / "Create new account" toggles (which
 * push mode= while preserving the rest of the query) still work.
 *
 * Returns null when the params carry no opinion, letting the caller keep
 * whatever mode is already on screen rather than resetting it.
 */
export function resolveLoginMode(params: {
  mode: string | null;
  applicationCategory: string | null;
}): LoginMode | null {
  if (params.mode === 'signup') return 'signup';
  if (params.mode === 'login') return 'login';
  if (params.applicationCategory && params.applicationCategory.trim().length > 0) return 'signup';
  return null;
}
