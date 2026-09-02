// components/auth/ResendVerificationEmail.tsx
'use client';

import { useCallback, useState } from 'react';
import { Mail } from 'lucide-react';
import { Alert } from '@/components/ui';
import { EmailTypoHint } from '@/components/auth/EmailTypoHint';
import { useEmailTypoHint } from '@/hooks/useEmailTypoHint';
import {
  resendVerificationEmail,
  type ResendVerificationResult,
} from '@/lib/auth/resendVerification';
import { componentsTheme } from '@/lib/theme/components';
import { normalizeEmailInput } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface ResendVerificationEmailProps {
  email: string;
  /** Supply to render an editable address field; omit for a read-only resend. */
  onEmailChange?: (email: string) => void;
  className?: string;
}

const RESULT_VARIANT: Record<ResendVerificationResult['status'], 'success' | 'info' | 'warning' | 'error'> = {
  sent: 'success',
  'already-verified': 'info',
  'rate-limited': 'warning',
  error: 'error',
};

/**
 * "Didn't get the email?" affordance. Every outcome — sent, already verified,
 * throttled, failed — is reported to the participant; none is swallowed.
 */
export function ResendVerificationEmail({
  email,
  onEmailChange,
  className,
}: ResendVerificationEmailProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResendVerificationResult | null>(null);

  const acceptSuggestion = useCallback(
    (next: string) => {
      onEmailChange?.(next);
    },
    [onEmailChange],
  );
  const emailHint = useEmailTypoHint(email, acceptSuggestion);

  const onResend = async () => {
    if (loading) return;

    setLoading(true);
    setResult(null);
    try {
      setResult(await resendVerificationEmail(email));
    } finally {
      setLoading(false);
    }
  };

  const canSend = Boolean(email.trim()) && !loading;

  return (
    <div className={cn('space-y-2', className)}>
      {onEmailChange ? (
        <div>
          <label htmlFor="resend-verification-email" className={componentsTheme.login.fieldLabel}>
            Email
          </label>
          <div className={componentsTheme.login.inputWrapper}>
            <Mail aria-hidden="true" className={componentsTheme.login.inputIcon} />
            <input
              id="resend-verification-email"
              name="resendVerificationEmail"
              type="email"
              value={email}
              onChange={e => onEmailChange(normalizeEmailInput(e.target.value))}
              onBlur={emailHint.onBlur}
              className={componentsTheme.login.input}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <EmailTypoHint hint={emailHint} />
        </div>
      ) : null}

      <button
        type="button"
        onClick={onResend}
        disabled={!canSend}
        className="text-xs font-semibold text-primary underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sending verification email...' : 'Resend verification email'}
      </button>

      {result ? <Alert variant={RESULT_VARIANT[result.status]}>{result.message}</Alert> : null}
    </div>
  );
}
