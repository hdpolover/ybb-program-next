// lib/auth/passwordRules.ts
// Single source of truth for client-side password validation. Mirrors the
// backend RegisterDto rule exactly: min 8 chars, uppercase, lowercase, and
// (digit OR non-word character). Do not diverge from this without updating
// the backend DTO in the same change.

export const PASSWORD_MIN_LENGTH = 8;

export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

export interface PasswordRuleResult {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordEvaluation {
  results: PasswordRuleResult[];
  allMet: boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length',
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    test: password => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: password => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: password => /[a-z]/.test(password),
  },
  {
    id: 'number-or-special',
    label: 'A number or special character',
    test: password => /\d/.test(password) || /\W/.test(password),
  },
];

export function evaluatePassword(password: string): PasswordEvaluation {
  const results = PASSWORD_RULES.map(rule => ({
    id: rule.id,
    label: rule.label,
    met: rule.test(password),
  }));

  return {
    results,
    allMet: results.every(result => result.met),
  };
}

export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every(rule => rule.test(password));
}

export const PASSWORD_RULES_MESSAGE =
  'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number or special character.';
