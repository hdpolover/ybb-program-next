// components/dashboard/sections/dashboardOverview/ApplicationStatusCard.tsx
"use client";

import { AlertTriangle, ArrowLeftRight, CheckCircle2, Circle, Info } from "lucide-react";
import Link from "next/link";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { deriveApplicationStatus, type ApplicationStatusTone } from "@/lib/dashboard/applicationStatus";
import { componentsTheme } from "@/lib/theme/components";
import { ROUTES } from "@/constants/routes";

const overviewTheme = componentsTheme.dashboardOverview;

const TONE: Record<ApplicationStatusTone, { card: string; icon: string; Icon: typeof Info }> = {
  warning: { card: "border-amber-200 bg-amber-50/70", icon: "bg-amber-100 text-amber-600", Icon: AlertTriangle },
  success: { card: "border-emerald-200 bg-emerald-50/70", icon: "bg-emerald-100 text-emerald-600", Icon: CheckCircle2 },
  info: { card: "border-blue-200 bg-blue-50/70", icon: "bg-blue-100 text-blue-600", Icon: Info },
};

/** Static status card: no hover states; only the CTA is interactive. */
export default function ApplicationStatusCard({ onSwitch }: { onSwitch?: () => void }) {
  const { dashboardSummary } = useDashboardData();
  const view = deriveApplicationStatus(dashboardSummary?.activeApplication);
  if (!view) return null;

  const { card, icon, Icon } = TONE[view.tone];

  return (
    <section
      aria-label="Application status"
      className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${card}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${icon}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">{view.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{view.body}</p>
          </div>

          {view.checklist ? (
            <ul className="space-y-1.5 text-sm text-slate-800">
              {view.checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-400" aria-hidden />
                  )}
                  <span>{item.label}</span>
                  <span className="sr-only">{item.done ? "(done)" : "(not done)"}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {view.deadline ? (
            <p className="text-xs font-semibold text-slate-700">Deadline: {view.deadline}</p>
          ) : null}

          {view.note ? (
            <p className="text-sm text-slate-700">
              {view.note}
              {view.showContactLink ? (
                <>
                  {" "}
                  <Link href={ROUTES.CONTACT} className="font-semibold text-primary underline-offset-2 hover:underline">
                    Contact us
                  </Link>
                </>
              ) : null}
            </p>
          ) : null}

          {view.cta === "continue" ? (
            <Link href="/dashboard/submission/edit" className={overviewTheme.registrationSwitchButton}>
              Continue application
            </Link>
          ) : null}
          {view.cta === "switch" && onSwitch ? (
            <button type="button" className={overviewTheme.registrationSwitchButton} onClick={onSwitch}>
              <ArrowLeftRight className="h-4 w-4" />
              <span>Switch to Self Funded</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
