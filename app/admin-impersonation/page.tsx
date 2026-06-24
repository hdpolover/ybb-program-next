"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type RedeemResult = { ok: true; redirectTo: string } | { ok: false; message: string };

// Module-level single-flight cache keyed by token. Unlike a component `useRef`,
// this survives React StrictMode remounts (which create a fresh ref per mount) and
// any in-context re-render, so the single-use impersonation token is exchanged at
// most once per page load. Without this, the second mount fires a second exchange
// that finds the token already consumed and shows "Invalid or expired token".
const redeemInFlight = new Map<string, Promise<RedeemResult>>();

function redeemImpersonation(token: string): Promise<RedeemResult> {
  const existing = redeemInFlight.get(token);
  if (existing) return existing;

  const pending = (async (): Promise<RedeemResult> => {
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
        return { ok: false, message: json.message || "Failed to complete impersonation login." };
      }
      return { ok: true, redirectTo: json.data?.redirectTo || "/dashboard" };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : "Failed to complete impersonation login.",
      };
    }
  })();

  redeemInFlight.set(token, pending);
  return pending;
}

export default function AdminImpersonationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setError("Missing impersonation token.");
      return;
    }

    redeemImpersonation(token).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        router.replace(result.redirectTo);
      } else {
        setError(result.message);
      }
    });

    return () => {
      cancelled = true;
    };
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
