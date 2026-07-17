// lib/auth/friendlyAuthError.ts

import { PASSWORD_RULES_MESSAGE } from './passwordRules';

export type FriendlyAuthError = {
  message: string;
  action?: 'use-google';
};

// Matches the backend's class-validator strings for the password field,
// whether they arrive alone or joined with "; " by HttpExceptionFilter.
const PASSWORD_VALIDATION_PATTERN =
  /password must contain uppercase|password must be longer than or equal to \d+ characters/i;

const OPS_LEAK_PATTERN =
  /missing auth context|failed:\s*\d|onboarding failed|register failed|login failed|status \d|undefined|http/i;

/**
 * Maps raw backend/auth error strings to participant-friendly copy.
 * Never echoes unmapped raw strings back to the user — avoids leaking internals.
 */
export function friendlyAuthError(raw: string): FriendlyAuthError {
  const message = raw || '';

  if (/local authentication not configured|use oauth provider/i.test(message)) {
    return {
      message:
        'This account was created with Google sign-in. Please use "Continue with Google" below to sign in.',
      action: 'use-google',
    };
  }

  if (/invalid credentials/i.test(message)) {
    return {
      message: 'Incorrect email or password. Please try again, or reset your password below.',
    };
  }

  if (/account is not active/i.test(message)) {
    return {
      message: "Your account isn't active yet. Please contact our team for help.",
    };
  }

  if (/email not verified/i.test(message)) {
    return {
      message:
        "Your email isn't verified yet. Please verify it first, or resend the verification email below.",
    };
  }

  if (PASSWORD_VALIDATION_PATTERN.test(message)) {
    return {
      message: PASSWORD_RULES_MESSAGE,
    };
  }

  if (OPS_LEAK_PATTERN.test(message)) {
    return {
      message: 'Something went wrong on our end. Please try again in a moment.',
    };
  }

  return {
    message: "We couldn't complete that. Please try again, or contact support if it keeps happening.",
  };
}
