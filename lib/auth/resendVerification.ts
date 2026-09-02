// lib/auth/resendVerification.ts
//
// One place that knows what the resend endpoint can actually answer, so the
// login screen and the verify-email screen tell the participant the same story.
// Note the backend throttle: 3 attempts per hour (auth.controller.ts
// `@Throttle({ default: { limit: 3, ttl: 3600000 } })`), which surfaces as 429.

export type ResendVerificationStatus = 'sent' | 'already-verified' | 'rate-limited' | 'error';

export type ResendVerificationResult = {
  status: ResendVerificationStatus;
  message: string;
};

const SENT_MESSAGE = 'Verification email sent. Check your inbox, and your spam folder.';
const ALREADY_VERIFIED_MESSAGE =
  'This email is already verified. You can sign in with your password.';
const RATE_LIMITED_MESSAGE =
  'Too many verification emails requested. Please wait a while before trying again, or contact support.';
const GENERIC_ERROR_MESSAGE =
  "We couldn't send the verification email just now. Please try again in a moment, or contact support.";

const ALREADY_VERIFIED_PATTERN = /already\s+verified/i;
const NOT_FOUND_PATTERN = /not\s+found|no\s+(such\s+)?(user|account)/i;

const NOT_FOUND_MESSAGE =
  "We couldn't find an account for that email. Check the address, or sign up again.";

/**
 * Requests a new verification email. Resolves to an explicit outcome for every
 * path — a failure is never reported as a success, and never swallowed.
 */
export async function resendVerificationEmail(rawEmail: string): Promise<ResendVerificationResult> {
  const email = (rawEmail ?? '').trim();
  if (!email) {
    return { status: 'error', message: 'Please enter your email address first.' };
  }

  try {
    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const json = (await res.json().catch(() => ({}))) as { message?: string };
    const backendMessage = json?.message ?? '';

    // The backend answers "Email is already verified" — a 200 on some builds,
    // a 4xx on others — so match on the message rather than the status code.
    if (ALREADY_VERIFIED_PATTERN.test(backendMessage)) {
      return { status: 'already-verified', message: ALREADY_VERIFIED_MESSAGE };
    }

    if (res.ok) {
      return { status: 'sent', message: SENT_MESSAGE };
    }

    if (res.status === 429) {
      return { status: 'rate-limited', message: RATE_LIMITED_MESSAGE };
    }

    if (res.status === 404 || NOT_FOUND_PATTERN.test(backendMessage)) {
      return { status: 'error', message: NOT_FOUND_MESSAGE };
    }

    // Anything else is an internal failure; the raw string may leak internals,
    // so it is logged rather than shown, matching friendlyAuthError's policy.
    console.warn('[resendVerificationEmail] request failed', {
      status: res.status,
      message: backendMessage,
    });
    return { status: 'error', message: GENERIC_ERROR_MESSAGE };
  } catch (error) {
    console.warn('[resendVerificationEmail] network error', {
      error: error instanceof Error ? error.message : 'unknown',
    });
    return { status: 'error', message: GENERIC_ERROR_MESSAGE };
  }
}
