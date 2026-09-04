// components/dashboard/sections/dashboardOverview/SubmitReminderPopup.tsx
"use client";

import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { formatDate } from "@/lib/utils";

const SEEN_KEY_PREFIX = "submit_reminder_seen_";

/**
 * Post-login reminder telling participants to submit their application form
 * before the deadline. Shown once per browser session, and only while the
 * application is still a draft. The deadline itself comes from the API
 * (`submissionDeadline`): the validity window CURRENTLY ACTIVE for the
 * application's own category (staged main + extension windows), falling
 * back to the program's default applicationDeadline once every window for
 * that category has expired or while none has started yet.
 */
export default function SubmitReminderPopup() {
  const { dashboardSummary } = useDashboardData();
  const application = dashboardSummary?.activeApplication ?? null;
  const deadline = application?.submissionDeadline;
  const shouldRemind = Boolean(deadline) && application?.status === "draft";
  const seenKey = `${SEEN_KEY_PREFIX}${application?.id ?? ""}`;

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!shouldRemind) return;
    try {
      if (sessionStorage.getItem(seenKey)) return;
      sessionStorage.setItem(seenKey, "1");
    } catch {
      // sessionStorage unavailable (private mode) — still show the reminder.
    }
    setOpen(true);
  }, [shouldRemind, seenKey]);

  if (!open || !deadline || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" role="dialog" aria-modal="true">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <CalendarClock className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Submit your application form</h2>
        </div>

        <p className="mb-3 text-sm text-slate-600">
          Your application is still a draft. Complete and submit your application form before{" "}
          <span className="font-semibold text-slate-900">{formatDate(deadline)}</span> so your
          registration can be processed.
        </p>

        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
          Applications that are not submitted by the deadline will not be reviewed.
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            Later
          </button>
          <Link
            href="/dashboard/submission/edit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
            onClick={() => setOpen(false)}
          >
            Fill Application Form
          </Link>
        </div>
      </div>
    </div>,
    document.body,
  );
}
