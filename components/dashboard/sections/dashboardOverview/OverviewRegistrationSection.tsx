"use client";

import { ArrowLeftRight, GraduationCap, AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { componentsTheme } from "@/lib/theme/components";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";

const overviewTheme = componentsTheme.dashboardOverview;

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;

  const record = payload as { message?: unknown };
  return typeof record.message === "string" && record.message.length > 0
    ? record.message
    : fallback;
}

export default function OverviewRegistrationSection() {
  const { dashboardSummary, isDashboardSummaryLoading } = useDashboardData();
  const router = useRouter();
  const activeApplication = dashboardSummary?.activeApplication ?? null;

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryUi = useMemo(() => {
    const category = activeApplication?.category;
    if (category === "fully_funded") {
      return {
        label: "Fully Funded Participant",
        description:
          "You're registered as a Fully Funded participant. Complete all requirements including essays and interviews. You'll pay program fees in scheduled batches, and if selected after the evaluation process, all your payments will be reimbursed.",
      };
    }
    if (category === "self_funded") {
      return {
        label: "Self Funded Participant",
        description:
          "You're registered as a Self Funded participant. Complete all requirements including essays and interviews. You'll pay program fees in scheduled batches to confirm your participation.",
      };
    }

    return {
      label: "Participant",
      description:
        "Review your application category and complete all required steps to continue your journey.",
    };
  }, [activeApplication?.category]);

  const canSwitchCategory = activeApplication?.canSwitchCategory ?? false;
  const currentCategory = activeApplication?.category;
  const switchTarget = currentCategory === "self_funded" ? "fully_funded" : "self_funded";
  const switchTargetLabel = switchTarget === "fully_funded" ? "Fully Funded" : "Self Funded";

  if (isDashboardSummaryLoading) {
    return <DashboardPageSkeleton variant="overview-registration" className="w-full" />;
  }

  async function handleSwitch() {
    if (!activeApplication?.id) {
      setError("Application ID not found. Please refresh the page and try again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/switch-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: activeApplication.id,
          targetCategory: switchTarget,
        }),
      });
      const json = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) {
        setError(getErrorMessage(json, "Failed to switch category. Please try again."));
        return;
      }
      setShowModal(false);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={overviewTheme.registrationCard}>
        <div className="flex flex-wrap items-start gap-4">
          <div className={overviewTheme.registrationIconCircle}>
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className={overviewTheme.registrationBodyWrapper}>
            <div className={overviewTheme.registrationHeaderRow}>
              <div>
                <h2 className={overviewTheme.registrationTitle}>Your Registration Category</h2>
                <p className={overviewTheme.registrationSubtitle}>{categoryUi.label}</p>
              </div>
            </div>

            <p className={overviewTheme.registrationDescription}>
              {categoryUi.description}
            </p>

            {canSwitchCategory ? (
              <div className={overviewTheme.registrationFooterRow}>
                <div className="flex items-start gap-2">
                  <div className={overviewTheme.registrationSwitchIconCircle}>
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                  </div>
                  <p className={overviewTheme.registrationSwitchText}>
                    <span className="font-semibold">Switch Available:</span> You can switch to {switchTargetLabel}
                    registration for guaranteed program participation with standard payment requirements.
                  </p>
                </div>

                <button
                  type="button"
                  className={overviewTheme.registrationSwitchButton}
                  onClick={() => setShowModal(true)}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  <span>Switch to {switchTargetLabel}</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {showModal && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Switch to {switchTargetLabel}?
              </h2>
            </div>

            <p className="mb-4 text-sm text-slate-600">
              You are about to switch your registration category from{" "}
              <span className="font-medium capitalize">{currentCategory?.replace("_", " ")}</span> to{" "}
              <span className="font-medium">{switchTargetLabel}</span>. This will change your payment
              requirements and program participation terms.
            </p>

            <p className="mb-6 text-sm font-medium text-slate-700">
              This action cannot be undone if you have existing payments.
            </p>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                onClick={() => { setShowModal(false); setError(null); }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                onClick={handleSwitch}
                disabled={loading}
              >
                <ArrowLeftRight className="h-4 w-4" />
                {loading ? "Switching…" : `Confirm Switch to ${switchTargetLabel}`}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
