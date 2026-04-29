"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  KeyRound,
  Mail,
  Shield,
  Chrome,
  UserRound,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function formatLastUsedAt(value?: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function SettingsSkeleton() {
  return (
    <div className="px-4 py-8 animate-pulse">
      {/* Page header */}
      <div className="mb-8">
        <div className="h-8 w-56 rounded-lg bg-slate-200" />
        <div className="mt-2 h-4 w-80 rounded bg-slate-100" />
      </div>

      <div className="space-y-6">
        {/* Account card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="h-4 w-24 rounded bg-slate-200" />
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="h-4 w-48 rounded bg-slate-200" />
              </div>
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
            <div className="px-6 py-4">
              <div className="mb-3 h-3 w-28 rounded bg-slate-100" />
              <div className="space-y-2">
                <div className="h-14 rounded-xl bg-slate-100" />
                <div className="h-14 rounded-xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>

        {/* Security card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="h-4 w-20 rounded bg-slate-200" />
          </div>
          <div className="flex items-center justify-between px-6 py-5">
            <div className="space-y-1.5">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-3 w-56 rounded bg-slate-100" />
            </div>
            <div className="h-9 w-36 rounded-lg bg-slate-100" />
          </div>
        </div>

        {/* Notifications card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="h-4 w-28 rounded bg-slate-200" />
          </div>
          <div className="px-6 py-5">
            <div className="h-12 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

type Identity = {
  provider: string;
  displayName?: string;
  lastUsedAt?: string | null;
};

type AuthMeData = {
  userId: string;
  email: string;
  identities?: Identity[];
};

type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T | null;
};

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === "google.com" || provider === "google") {
    return <Chrome className="h-4 w-4 text-blue-500" />;
  }
  if (provider === "local" || provider === "email") {
    return <Mail className="h-4 w-4 text-slate-500" />;
  }
  return <Shield className="h-4 w-4 text-slate-400" />;
}

function providerLabel(provider: string): string {
  if (provider === "google.com" || provider === "google") return "Google";
  if (provider === "local" || provider === "email")
    return "Email & Password";
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

export default function SettingsSection() {
  const [authMe, setAuthMe] = useState<AuthMeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetState, setResetState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((json: ApiResponse<AuthMeData>) => {
        if (json.data) setAuthMe(json.data);
      })
      .catch(() => {
        /* silently ignore */
      })
      .finally(() => setLoading(false));
  }, []);

  const hasLocalIdentity = authMe?.identities?.some(
    (i) => i.provider === "local" || i.provider === "email"
  );

  const handleResetPassword = async () => {
    if (!authMe?.email || resetState === "sending" || resetState === "sent")
      return;
    setResetState("sending");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authMe.email }),
      });
      const json = (await res.json()) as ApiResponse<unknown>;
      if (res.ok) {
        setResetState("sent");
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        setResetState("error");
        toast.error(json.message || "Failed to send reset email.");
      }
    } catch {
      setResetState("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Profile &amp; Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account details and security settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Account section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-slate-700">Account</h2>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Email */}
            <div className="flex items-center justify-between gap-4 px-6 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email address
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">
                  {authMe?.email ?? "—"}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                Read-only
              </span>
            </div>

            {/* Connected providers */}
            <div className="px-6 py-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Sign-in methods
              </p>
              {authMe?.identities && authMe.identities.length > 0 ? (
                <ul className="space-y-2">
                  {authMe.identities.map((identity) => (
                    <li
                      key={identity.provider}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                          <ProviderIcon provider={identity.provider} />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            {identity.displayName || providerLabel(identity.provider)}
                          </p>
                          {formatLastUsedAt(identity.lastUsedAt) && (
                            <p className="text-xs text-slate-400">
                              Last used{" "}
                              {formatLastUsedAt(identity.lastUsedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Connected
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">
                  No sign-in methods found.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Security section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-slate-700">Security</h2>
            </div>
          </div>

          <div className="px-6 py-5">
            {hasLocalIdentity ? (
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Password
                  </p>
                  <p className="text-xs text-slate-400">
                    We&apos;ll send a password reset link to your email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={
                    resetState === "sending" || resetState === "sent"
                  }
                  className="mt-3 flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0"
                >
                  {resetState === "sending" && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {resetState === "sent" && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  {resetState === "error" && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  {resetState === "idle" && "Send reset email"}
                  {resetState === "sending" && "Sending…"}
                  {resetState === "sent" && "Email sent!"}
                  {resetState === "error" && "Try again"}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                <Shield className="h-4 w-4 shrink-0" />
                <span>
                  You&apos;re signed in with a social provider. Password
                  management is handled by your provider.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-slate-700">
                Notifications
              </h2>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Notification preferences are coming soon.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
