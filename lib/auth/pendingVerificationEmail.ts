// lib/auth/pendingVerificationEmail.ts
//
// Signup redirects to /verify-email, which until now knew nothing about who had
// just registered — so the only recovery advice it could give was "go back to
// the login page". Handing the address over in the URL would leak it into
// history and referrers, so it rides in sessionStorage instead: same tab, same
// session, gone when the tab closes.

export const PENDING_VERIFICATION_EMAIL_KEY = 'ybb.pendingVerificationEmail';

/** Stores the address awaiting verification. Never throws. */
export function rememberPendingVerificationEmail(email: string): void {
  const value = (email ?? '').trim();
  if (!value || typeof window === 'undefined') return;

  try {
    window.sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, value);
  } catch {
    // Private mode / storage disabled: the verify screen just falls back to
    // asking for the address, which is a worse but working path.
  }
}

/** Reads the address awaiting verification, or '' when unavailable. */
export function readPendingVerificationEmail(): string {
  if (typeof window === 'undefined') return '';

  try {
    return window.sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY)?.trim() ?? '';
  } catch {
    return '';
  }
}
