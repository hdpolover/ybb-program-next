'use client';

import { forwardRef, useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { sanitize, type RestrictMode } from '@/lib/text/restricted-input';

const FEEDBACK: Record<RestrictMode, string> = {
  name: 'Please use the English alphabet only. Your name appears on your Letter of Acceptance.',
  general: 'Only standard English characters are allowed.',
};

export interface EnglishTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  restrictMode?: RestrictMode;
  feedbackClassName?: string;
}

const EnglishTextArea = forwardRef<HTMLTextAreaElement, EnglishTextAreaProps>(
  function EnglishTextArea(
    { restrictMode = 'general', feedbackClassName, onChange, ...rest },
    ref,
  ) {
    const [blocked, setBlocked] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { value: clean, removed } = sanitize(e.target.value, restrictMode);
      // Keep feedback visible until the field is cleared; only dismiss when empty.
      if (removed.length > 0) {
        setBlocked(true);
      } else if (clean === '') {
        setBlocked(false);
      }
      // Mutate the DOM value before calling onChange so the consumer's
      // e.target.value handler stores the cleaned text (blocked chars never persist).
      if (clean !== e.target.value) {
        e.target.value = clean;
      }
      onChange?.(e);
    };

    return (
      <>
        <textarea ref={ref} onChange={handleChange} {...rest} />
        {blocked && (
          <p
            role="status"
            aria-live="polite"
            className={
              feedbackClassName ??
              'mt-1 flex items-center gap-1.5 rounded-md bg-destructive-soft px-2 py-1 text-xs font-medium text-destructive'
            }
          >
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {FEEDBACK[restrictMode]}
          </p>
        )}
      </>
    );
  },
);

export default EnglishTextArea;
