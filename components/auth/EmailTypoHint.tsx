// components/auth/EmailTypoHint.tsx
'use client';

import { X } from 'lucide-react';
import type { EmailTypoHint as EmailTypoHintState } from '@/hooks/useEmailTypoHint';
import { cn } from '@/lib/utils';

export interface EmailTypoHintProps {
  hint: EmailTypoHintState;
  className?: string;
}

/**
 * Inline "did you mean ...?" prompt under an email field.
 *
 * Deliberately soft: it is never an error, it never blocks submit, and both the
 * accept and the dismiss actions are real buttons so keyboard users get the
 * same affordance as the mouse. The wrapper is a live region so the suggestion
 * is announced when it appears after blur.
 */
export function EmailTypoHint({ hint, className }: EmailTypoHintProps) {
  const { suggestion, notice, accept, dismiss, dismissNotice } = hint;

  return (
    <div aria-live="polite" className={cn(suggestion || notice ? 'mt-2' : undefined, className)}>
      {!suggestion && notice ? (
        // Same soft treatment as the suggestion above, deliberately: this is a
        // working address, and the participant may have no other one. It says
        // what to do if they keep it rather than pushing them off it.
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-800">
          <p className="flex-1">
            Verification emails to <span className="font-semibold">{notice.domain}</span> more often
            land in spam. A <span className="font-semibold">gmail.com</span> address is the most
            reliable. If you keep this one, please check your spam folder.
          </p>
          <button
            type="button"
            onClick={dismissNotice}
            aria-label="Dismiss email delivery notice"
            className="-mr-1 rounded-md p-0.5 text-amber-600 hover:bg-amber-100 hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
      {suggestion ? (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-800">
          <p className="flex-1">
            Did you mean{' '}
            <button
              type="button"
              onClick={accept}
              className="font-semibold underline underline-offset-2 hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
            >
              {suggestion.email}
            </button>
            ? If your address is correct, you can ignore this.
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss email suggestion"
            className="-mr-1 rounded-md p-0.5 text-amber-600 hover:bg-amber-100 hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
