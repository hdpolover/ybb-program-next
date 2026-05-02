'use client';

import { useEffect } from 'react';
import ErrorState from '@/components/ui/ErrorState';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100dvh-80px)] items-center justify-center px-4 py-8 sm:min-h-screen">
      <ErrorState onRetry={reset} />
    </div>
  );
}
