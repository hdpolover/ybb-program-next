"use client";

import Image from "next/image";
import { Eye, EyeOff, PencilLine } from "lucide-react";
import { useMemo, useState } from "react";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { componentsTheme } from "@/lib/theme/components";

const submissionTheme = componentsTheme.dashboardSubmission;

export default function SubmissionReadProfileHeaderSection() {
  const { me, onboarding, participantProfile } = useDashboardData();
  const [showAccountId, setShowAccountId] = useState(false);

  const displayName =
    participantProfile?.displayName?.trim() ||
    participantProfile?.fullName?.trim() ||
    onboarding?.displayName?.trim() ||
    onboarding?.fullName?.trim() ||
    "Participant";
  const profileImageUrl = participantProfile?.profilePictureUrl?.trim() || null;
  const accountId = me?.userId || "-";
  const maskedAccountId = useMemo(() => {
    if (!accountId || accountId === "-") return "-";
    const raw = String(accountId);
    if (raw.length <= 6) return "•".repeat(raw.length);
    return `${"•".repeat(Math.max(0, raw.length - 4))}${raw.slice(-4)}`;
  }, [accountId]);

  const originParts = [onboarding?.originCity, onboarding?.originState].filter(Boolean).join(", ");
  const origin = [originParts, onboarding?.originCountry].filter(Boolean).join("\n");
  const hasOrigin = Boolean(origin.trim());

  return (
    <div className={submissionTheme.profileCard}>
      <div className={submissionTheme.profileRow}>
        <div className={submissionTheme.profileLeft}>
          <div className={submissionTheme.profileAvatarWrapper}>
            <div className={submissionTheme.profileAvatarInner}>
              {profileImageUrl ? (
                <Image
                  src={profileImageUrl}
                  alt={`${displayName} profile photo`}
                  fill
                  className={submissionTheme.profileAvatarImage}
                  sizes="80px"
                  unoptimized
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <button
              type="button"
              className={submissionTheme.profileAvatarButton}
              aria-label="Change profile photo"
            >
              <PencilLine className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            <p className={submissionTheme.profileName}>{displayName}</p>
            <p className={submissionTheme.profileRole}>Participant Account</p>
            <p className={submissionTheme.profileMeta}>
              <span className={submissionTheme.profileMetaLabel}>Account ID:</span>{" "}
              <span className="inline-flex items-center gap-2">
                <span className="font-mono">
                  {showAccountId ? accountId : maskedAccountId}
                </span>
                {accountId !== "-" && (
                  <button
                    type="button"
                    onClick={() => setShowAccountId(v => !v)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={showAccountId ? "Hide account id" : "Show account id"}
                  >
                    {showAccountId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </span>
            </p>
          </div>
        </div>

        <div className={submissionTheme.profileRightWrapper}>
          <p className={submissionTheme.profileRightLabel}>Primary Address</p>
          {hasOrigin ? (
            <p className={submissionTheme.profileRightText}>
              {origin.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          ) : (
            <p className={submissionTheme.profileRightText}>-</p>
          )}
        </div>
      </div>
    </div>
  );
}
