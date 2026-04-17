"use client";

import { AlertTriangle, Bell, Megaphone } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";

type TabKey = "alerts" | "announcements";

function formatDateLabel(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function NotificationsPopover() {
  const { dashboardSummary } = useDashboardData();
  const alerts = dashboardSummary?.alerts ?? [];
  const announcements = dashboardSummary?.recentAnnouncements ?? [];

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<TabKey>("alerts");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("mousedown", handleClickOutside);
    } else {
      window.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const unreadAnnouncementsCount = useMemo(() => {
    return announcements.filter(a => a && a.isRead === false).length;
  }, [announcements]);

  const badgeCount = alerts.length + unreadAnnouncementsCount;

  const emptyLabel = tab === "alerts" ? "No alerts" : "No announcements";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {badgeCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
            {badgeCount > 99 ? "99+" : badgeCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed right-3 top-16 z-50 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg sm:absolute sm:right-0 sm:top-auto sm:z-40 sm:mt-2 sm:max-w-none">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <div className="text-sm font-bold text-slate-900">Notifications</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 px-3 py-2">
            <button
              type="button"
              onClick={() => setTab("alerts")}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                tab === "alerts" ? "bg-primary text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Alerts</span>
              <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${tab === "alerts" ? "bg-white/20" : "bg-white"}`}>
                {alerts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTab("announcements")}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                tab === "announcements" ? "bg-primary text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Megaphone className="h-3.5 w-3.5" />
              <span>Announcements</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${tab === "announcements" ? "bg-white/20" : "bg-white"}`}
              >
                {unreadAnnouncementsCount}
              </span>
            </button>
          </div>

          <div className="max-h-[calc(100vh-7rem)] overflow-auto px-1 pb-2 sm:max-h-96">
            {tab === "alerts" ? (
              alerts.length > 0 ? (
                <div className="space-y-1 px-2">
                  {alerts.map((a, idx) => (
                    <a
                      key={a?.id || idx}
                      href={a?.actionUrl || "#"}
                      className="block rounded-xl px-3 py-2 transition hover:bg-slate-50"
                      onClick={e => {
                        if (!a?.actionUrl) e.preventDefault();
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-xs font-extrabold text-slate-900">
                            {a?.title || "Alert"}
                          </div>
                          {a?.message ? (
                            <div className="mt-0.5 text-xs text-slate-600">{a.message}</div>
                          ) : null}
                          {a?.actionLabel ? (
                            <div className="mt-1 text-[11px] font-bold text-[var(--brand-primary)]">{a.actionLabel}</div>
                          ) : null}
                        </div>
                        {a?.type ? (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {a.type}
                          </span>
                        ) : null}
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-xs font-semibold text-slate-500">{emptyLabel}</div>
              )
            ) : announcements.length > 0 ? (
              <div className="space-y-1 px-2">
                {announcements.map((a, idx) => (
                  <a
                    key={a?.id || idx}
                    href="#"
                    className="block rounded-xl px-3 py-2 transition hover:bg-slate-50"
                    onClick={e => {
                      e.preventDefault();
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">{a?.title || "Announcement"}</div>
                        {a?.preview ? (
                          <div className="mt-0.5 text-xs text-slate-600">{a.preview}</div>
                        ) : null}
                        {a?.date ? (
                          <div className="mt-1 text-[11px] font-semibold text-slate-500">{formatDateLabel(a.date)}</div>
                        ) : null}
                      </div>
                      {a?.isRead === false ? (
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-primary" />
                      ) : null}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-xs font-semibold text-slate-500">{emptyLabel}</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
