"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminImpersonationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const didStartRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (didStartRef.current) return;
    didStartRef.current = true;

    if (!token) {
      setError("Missing impersonation token.");
      return;
    }

    void (async () => {
      try {
        const res = await fetch("/api/auth/admin-impersonation-exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const json = (await res.json().catch(() => ({}))) as {
          message?: string;
          data?: { redirectTo?: string };
        };

        if (!res.ok) {
          setError(json.message || "Failed to complete impersonation login.");
          return;
        }

        const redirectTo = json.data?.redirectTo || "/dashboard";
        router.replace(redirectTo);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to complete impersonation login.");
      }
    })();
  }, [router, token]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-6 py-12">
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
        {!error ? (
          <>
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-700" />
            <h1 className="text-base font-semibold text-zinc-900">Signing you in...</h1>
            <p className="mt-1 text-sm text-zinc-600">Please wait while your secure support session is prepared.</p>
          </>
        ) : (
          <>
            <h1 className="text-base font-semibold text-zinc-900">Impersonation login failed</h1>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </main>
  );
}
