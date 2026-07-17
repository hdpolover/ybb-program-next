// components/auth/PasswordRequirements.tsx
import { Check, Circle } from 'lucide-react';
import { evaluatePassword } from '@/lib/auth/passwordRules';
import { cn } from '@/lib/utils';

export interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

// Live checklist shown while the user types a new password. Guidance, not an
// error state: unmet rules stay neutral/muted rather than alarming red.
// Static and informational only, so no hover/interactive treatment.
export function PasswordRequirements({ password, className }: PasswordRequirementsProps) {
  const { results } = evaluatePassword(password);

  return (
    <ul aria-live="polite" className={cn('mt-2 space-y-1', className)}>
      {results.map(rule => (
        <li
          key={rule.id}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium transition-colors',
            rule.met ? 'text-emerald-600' : 'text-slate-400',
          )}
        >
          {rule.met ? (
            <Check aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0" />
          ) : (
            <Circle aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0" />
          )}
          {/* The icon and colour are decorative, so the met/unmet state has to
              reach screen readers as text rather than colour alone. */}
          <span className="sr-only">{rule.met ? 'Requirement met:' : 'Requirement not met:'}</span>
          <span>{rule.label}</span>
        </li>
      ))}
    </ul>
  );
}
