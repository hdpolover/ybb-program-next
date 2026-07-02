// components/ui/Alert.tsx
import type { ElementType, ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertVariant = 'error' | 'warning' | 'success' | 'info';

type AlertProps = {
  variant: AlertVariant;
  children: ReactNode;
  title?: string;
  className?: string;
};

const VARIANT_ICON: Record<AlertVariant, ElementType> = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
};

const VARIANT_STYLES: Record<AlertVariant, string> = {
  error: 'border-destructive/30 bg-destructive-soft text-destructive',
  warning: 'border-amber-300 bg-amber-50 text-amber-700',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  info: 'border-slate-300 bg-slate-50 text-slate-700',
};

export function Alert({ variant, children, title, className }: AlertProps) {
  const Icon = VARIANT_ICON[variant];
  const isAssertive = variant === 'error' || variant === 'warning';

  return (
    <div
      role={isAssertive ? 'alert' : 'status'}
      aria-live={isAssertive ? undefined : 'polite'}
      className={cn(
        'flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium leading-5',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <p>{children}</p>
      </div>
    </div>
  );
}
