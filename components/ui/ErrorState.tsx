import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';

type ErrorStateProps = {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this page right now. Please try again in a moment.',
  retryLabel = 'Try again',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.12)] sm:max-w-md sm:p-8">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/25">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      {onRetry ? (
        <div className="mt-6">
          <Button type="button" onClick={onRetry} size="lg" className="min-w-[140px]">
            {retryLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
