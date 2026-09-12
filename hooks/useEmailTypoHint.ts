// hooks/useEmailTypoHint.ts
'use client';

import { useCallback, useState } from 'react';
import {
  nonGmailDomain,
  suggestDomainTypo,
  type DomainTypoSuggestion,
} from '@/lib/email/suggestDomainTypo';

export type EmailTypoHint = {
  /** The suggestion to render, or null when there is nothing to say. */
  suggestion: DomainTypoSuggestion | null;
  /**
   * A working but non-Gmail domain worth a spam-folder note, or null. Only ever
   * set when `warnNonGmail` is on AND there is no typo suggestion, so the field
   * shows at most one hint.
   */
  notice: { domain: string } | null;
  /** Attach to the email input's `onBlur` — never to `onChange`. */
  onBlur: () => void;
  /** Rewrites the field to the suggested address. */
  accept: () => void;
  /** Hides this suggestion and does not raise it again for the same address. */
  dismiss: () => void;
  /** Hides the non-Gmail note and does not raise it again for that domain. */
  dismissNotice: () => void;
};

export type EmailTypoHintOptions = {
  /**
   * Show the non-Gmail spam-folder note. Signup only. On the login form the
   * account already exists, so commenting on the domain there is pure noise.
   */
  warnNonGmail?: boolean;
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
  options: EmailTypoHintOptions = {},
): EmailTypoHint {
  const { warnNonGmail = false } = options;
  const [checked, setChecked] = useState<{ source: string; suggestion: DomainTypoSuggestion } | null>(
    null,
  );
  const [dismissed, setDismissed] = useState<readonly string[]>([]);
  const [checkedNotice, setCheckedNotice] = useState<{ source: string; domain: string } | null>(null);
  const [dismissedNotices, setDismissedNotices] = useState<readonly string[]>([]);

  // A stale hint (the value moved on since the last blur) is simply not shown,
  // which avoids an effect that would fight the parent's controlled state.
  const suggestion = checked && checked.source === value ? checked.suggestion : null;
  const notice = checkedNotice && checkedNotice.source === value ? { domain: checkedNotice.domain } : null;

  const onBlur = useCallback(() => {
    const next = suggestDomainTypo(value);
    const showSuggestion = next !== null && !dismissed.includes(next.email);
    setChecked(showSuggestion ? { source: value, suggestion: next } : null);

    // Precedence lives here, in one place: a near-miss is the more actionable
    // message, so the note is only computed when no suggestion is showing. That
    // guarantees the field renders at most one hint no matter what is typed.
    const domain = !showSuggestion && warnNonGmail ? nonGmailDomain(value) : null;
    setCheckedNotice(
      domain !== null && !dismissedNotices.includes(domain) ? { source: value, domain } : null,
    );
  }, [dismissed, dismissedNotices, value, warnNonGmail]);

  const accept = useCallback(() => {
    if (!suggestion) return;
    onAccept(suggestion.email);
    setChecked(null);
    // The accepted address is a suggestion target, so nothing is owed about it.
    setCheckedNotice(null);
  }, [onAccept, suggestion]);

  const dismiss = useCallback(() => {
    if (!suggestion) return;
    const dismissedEmail = suggestion.email;
    setDismissed(prev => (prev.includes(dismissedEmail) ? prev : [...prev, dismissedEmail]));
    setChecked(null);
  }, [suggestion]);

  const dismissNotice = useCallback(() => {
    if (!notice) return;
    const dismissedDomain = notice.domain;
    setDismissedNotices(prev => (prev.includes(dismissedDomain) ? prev : [...prev, dismissedDomain]));
    setCheckedNotice(null);
  }, [notice]);

  return { suggestion, notice, onBlur, accept, dismiss, dismissNotice };
}
