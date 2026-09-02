// hooks/useEmailTypoHint.ts
'use client';

import { useCallback, useState } from 'react';
import { suggestDomainTypo, type DomainTypoSuggestion } from '@/lib/email/suggestDomainTypo';

export type EmailTypoHint = {
  /** The suggestion to render, or null when there is nothing to say. */
  suggestion: DomainTypoSuggestion | null;
  /** Attach to the email input's `onBlur` — never to `onChange`. */
  onBlur: () => void;
  /** Rewrites the field to the suggested address. */
  accept: () => void;
  /** Hides this suggestion and does not raise it again for the same address. */
  dismiss: () => void;
};

/**
 * Advisory "did you mean gmail.com?" state for an email field.
 *
 * Checks on blur only, so the hint cannot flicker mid-typing, and re-checks
 * whenever the value changes afterwards. Purely a suggestion: nothing here
 * blocks submission, and a dismissed address stays dismissed.
 */
export function useEmailTypoHint(
  value: string,
  onAccept: (email: string) => void,
): EmailTypoHint {
  const [checked, setChecked] = useState<{ source: string; suggestion: DomainTypoSuggestion } | null>(
    null,
  );
  const [dismissed, setDismissed] = useState<readonly string[]>([]);

  // A stale hint (the value moved on since the last blur) is simply not shown,
  // which avoids an effect that would fight the parent's controlled state.
  const suggestion = checked && checked.source === value ? checked.suggestion : null;

  const onBlur = useCallback(() => {
    const next = suggestDomainTypo(value);
    setChecked(next && !dismissed.includes(next.email) ? { source: value, suggestion: next } : null);
  }, [dismissed, value]);

  const accept = useCallback(() => {
    if (!suggestion) return;
    onAccept(suggestion.email);
    setChecked(null);
  }, [onAccept, suggestion]);

  const dismiss = useCallback(() => {
    if (!suggestion) return;
    const dismissedEmail = suggestion.email;
    setDismissed(prev => (prev.includes(dismissedEmail) ? prev : [...prev, dismissedEmail]));
    setChecked(null);
  }, [suggestion]);

  return { suggestion, onBlur, accept, dismiss };
}
