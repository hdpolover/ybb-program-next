import { ReactNode } from 'react';

const DEFAULT_CONTAINER_CLASSNAME =
  'w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center';

interface EmptyStateProps {
  /** Decorative icon or illustration. Rendered aria-hidden; caller controls its own sizing/treatment. */
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  /** Real interactive element (e.g. <Button> or <Link>), not a decorative element. */
  action?: ReactNode;
  /** Replaces the default container classes entirely (not merged) for call sites that need a different surface treatment. */
  className?: string;
}

// Shared empty-state block: icon slot + heading + optional description + optional action.
// No hover elevation on the container itself ("if it hovers, it clicks") — only `action`,
// if provided, carries its own genuine hover/focus states.
export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={className ?? DEFAULT_CONTAINER_CLASSNAME}>
      {icon ? (
        <div aria-hidden="true" className="mb-4 flex justify-center">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
