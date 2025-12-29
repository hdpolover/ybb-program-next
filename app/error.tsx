'use client';

import { useEffect } from 'react';

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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-4 text-2xl font-semibold">Something went wrong!</h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
