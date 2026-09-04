"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  KeyRound,
  Mail,
  Shield,
  Chrome,
  UserRound,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { parseApiDate } from "@/lib/utils";
import { auth, googleProvider } from "@/lib/firebase";
import { useHydrated } from "@/hooks/useHydrated";
import { BUSINESS_TIMEZONE } from "@/lib/format/deadline";
import DeleteAccountSection from "@/components/dashboard/sections/settings/DeleteAccountSection";

/**
 * Formats without an explicit timeZone, so before hydration (server render and
 * first client render) it must be pinned to the business timezone; only once
 * `hydrated` is true does it resolve to the viewer's own ambient zone.
 */
function formatLastUsedAt(value: string | null | undefined, hydrated: boolean): string | null {
  if (!value) return null;
  const parsed = parseApiDate(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(hydrated ? {} : { timeZone: BUSINESS_TIMEZONE }),
  });
}

function SettingsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <div className="h-8 w-56 rounded-lg bg-slate-200" />
        <div className="mt-2 h-4 w-80 rounded bg-slate-100" />
      </div>

      <div className="space-y-5">
        {/* Account card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="h-4 w-24 rounded bg-slate-200" />
          </div>
          <div className="divide-y divide-slate-100">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="h-4 w-48 rounded bg-slate-200" />
              </div>
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
            <div className="px-4 py-4 sm:px-6">
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
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="h-4 w-20 rounded bg-slate-200" />
          </div>
          <div className="flex items-center justify-between px-4 py-5 sm:px-6">
            <div className="space-y-1.5">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-3 w-56 rounded bg-slate-100" />
            </div>
            <div className="h-9 w-36 rounded-lg bg-slate-100" />
          </div>
        </div>

        {/* Notifications card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="h-4 w-28 rounded bg-slate-200" />
          </div>
          <div className="px-4 py-5 sm:px-6">
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

function getPasswordRules(password: string) {
  return {
    minLength: password.length >= 8,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    numberOrSymbol: /[\d\W]/.test(password),
  };
}

function isStrongPassword(password: string) {
  const rules = getPasswordRules(password);
  return rules.minLength && rules.lower && rules.upper && rules.numberOrSymbol;
}

export default function SettingsSection() {
  const hydrated = useHydrated();
  const [authMe, setAuthMe] = useState<AuthMeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetState, setResetState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [googleLinking, setGoogleLinking] = useState(false);
  const [linkState, setLinkState] = useState<"idle" | "linking" | "linked" | "error">("idle");
  const [linkError, setLinkError] = useState("");
  const [showLinkPassword, setShowLinkPassword] = useState(false);
  const [showLinkConfirmPassword, setShowLinkConfirmPassword] = useState(false);
  const [linkForm, setLinkForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const loadAuthMe = async () => {
    const res = await fetch("/api/auth/me");
    const json = (await res.json()) as ApiResponse<AuthMeData>;
    if (json.data) setAuthMe(json.data);
  };

  useEffect(() => {
    // loadAuthMe calls setState internally; this is intentional fire-on-mount data loading.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAuthMe()
      .catch(() => {
        /* silently ignore */
      })
      .finally(() => setLoading(false));
  }, []);

  const hasLocalIdentity = authMe?.identities?.some(
    (i) => i.provider === "local" || i.provider === "email"
  );
  const hasGoogleIdentity = authMe?.identities?.some(
    (i) => i.provider === "google" || i.provider === "google.com"
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

  const handleConnectGoogle = async () => {
    if (!authMe?.email || googleLinking) return;

    setGoogleLinking(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleEmail = result.user.email?.trim().toLowerCase() || "";
      const currentEmail = authMe.email.trim().toLowerCase();

      if (!googleEmail || googleEmail !== currentEmail) {
        await signOut(auth).catch(() => undefined);
        throw new Error("Use the same email as your current account to connect Google sign-in.");
      }

      const idToken = await result.user.getIdToken();
      const res = await fetch("/api/auth/firebase-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        statusCode?: number;
        message?: string;
      };
      if (!res.ok) {
        throw new Error(json?.message || "Failed to connect Google sign-in.");
      }

      await loadAuthMe();
      toast.success("Google sign-in connected.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to connect Google sign-in.";
      toast.error(message);
    } finally {
      setGoogleLinking(false);
    }
  };

  const handleLinkLocalAuth = async () => {
    if (!authMe?.email || linkState === "linking") return;
    if (!linkForm.password || !linkForm.confirmPassword) {
      setLinkState("error");
      setLinkError("Password and confirm password are required.");
      return;
    }
    if (!isStrongPassword(linkForm.password)) {
      setLinkState("error");
      setLinkError(
        "Use at least 8 characters with uppercase, lowercase, and a number or symbol."
      );
      return;
    }
    if (linkForm.password !== linkForm.confirmPassword) {
      setLinkState("error");
      setLinkError("Password and confirm password do not match.");
      return;
    }

    setLinkState("linking");
    setLinkError("");
    try {
      const res = await fetch("/api/auth/identities/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: linkForm.password }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        statusCode?: number;
        message?: string;
      };

      if (res.status === 409) {
        throw new Error("Email & password sign-in is already set up for this account.");
      }

      if (!res.ok) {
        throw new Error(json?.message || "Failed to add email & password sign-in.");
      }

      await loadAuthMe();
      setLinkState("linked");
      setLinkForm({ password: "", confirmPassword: "" });
      toast.success("Email & password sign-in has been added.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add email & password sign-in.";
      setLinkState("error");
      setLinkError(message);
      toast.error(message);
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  const passwordRules = getPasswordRules(linkForm.password);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Profile &amp; Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account details and security settings.
        </p>
      </div>

      <div className="space-y-5">
        {/* Account section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-slate-700">Account</h2>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Email */}
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
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
            <div className="px-4 py-4 sm:px-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Sign-in methods
              </p>
              {authMe?.identities && authMe.identities.length > 0 ? (
                <ul className="space-y-2">
                  {authMe.identities.map((identity) => {
                    const lastUsedLabel = formatLastUsedAt(identity.lastUsedAt, hydrated);
                    return (
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
                            {lastUsedLabel && (
                              <p className="text-xs text-slate-400" suppressHydrationWarning>
                                Last used {lastUsedLabel}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Connected
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-slate-400">
                  No sign-in methods found.
                </p>
              )}
              {!hasGoogleIdentity ? (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleConnectGoogle}
                    disabled={googleLinking}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {googleLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Chrome className="h-4 w-4 text-blue-500" />}
                    {googleLinking ? "Connecting..." : "Connect Google"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* Security section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-slate-700">Security</h2>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6">
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
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  Add email &amp; password sign-in
                </p>
                <p className="text-xs text-slate-500">
                  You currently sign in with a social provider. Add a password so you can also log in with email.
                </p>
                <div className="space-y-2">
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      New password
                    </span>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showLinkPassword ? "text" : "password"}
                        value={linkForm.password}
                        onChange={(event) =>
                          setLinkForm((current) => ({ ...current, password: event.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary/100 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="8+ chars, uppercase, lowercase, number/symbol"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLinkPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showLinkPassword ? "Hide password" : "Show password"}
                      >
                        {showLinkPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-500">
                    <p className={passwordRules.minLength ? "text-emerald-600" : ""}>• 8+ characters</p>
                    <p className={passwordRules.upper ? "text-emerald-600" : ""}>• Uppercase letter</p>
                    <p className={passwordRules.lower ? "text-emerald-600" : ""}>• Lowercase letter</p>
                    <p className={passwordRules.numberOrSymbol ? "text-emerald-600" : ""}>• Number or symbol</p>
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Confirm password
                    </span>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showLinkConfirmPassword ? "text" : "password"}
                        value={linkForm.confirmPassword}
                        onChange={(event) =>
                          setLinkForm((current) => ({ ...current, confirmPassword: event.target.value }))
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-10 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-primary/100 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLinkConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showLinkConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showLinkConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </label>
                </div>
                {linkError ? (
                  <p className="text-xs text-red-600">{linkError}</p>
                ) : null}
                {linkState === "linked" ? (
                  <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Email &amp; password sign-in connected.
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLinkLocalAuth}
                    disabled={linkState === "linking"}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {linkState === "linking" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {linkState === "linking" ? "Adding..." : "Add sign-in method"}
                  </button>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Shield className="h-3.5 w-3.5" />
                    Existing social login stays connected.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-slate-700">
                Notifications
              </h2>
            </div>
          </div>
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Notification preferences are coming soon.</span>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <DeleteAccountSection />
      </div>
    </div>
  );
}
