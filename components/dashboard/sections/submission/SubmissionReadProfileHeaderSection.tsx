"use client";

import Image from "next/image";
import { PencilLine } from "lucide-react";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { componentsTheme } from "@/lib/theme/components";

const submissionTheme = componentsTheme.dashboardSubmission;

export default function SubmissionReadProfileHeaderSection() {
  const { me, onboarding, participantProfile } = useDashboardData();

  const displayName =
    participantProfile?.displayName?.trim() ||
    participantProfile?.fullName?.trim() ||
    onboarding?.displayName?.trim() ||
    onboarding?.fullName?.trim() ||
    "Participant";
  const profileImageUrl = participantProfile?.profilePictureUrl?.trim() || "/img/photoprofile.png";
  const accountId = me?.userId || "-";

  const originParts = [onboarding?.originCity, onboarding?.originState].filter(Boolean).join(", ");
  const origin = [originParts, onboarding?.originCountry].filter(Boolean).join("\n");
  const hasOrigin = Boolean(origin.trim());

  return (
    <div className={submissionTheme.profileCard}>
      <div className={submissionTheme.profileRow}>
        <div className={submissionTheme.profileLeft}>
          <div className={submissionTheme.profileAvatarWrapper}>
            <div className={submissionTheme.profileAvatarInner}>
              <Image
                src={profileImageUrl}
                alt={`${displayName} profile photo`}
                fill
                className={submissionTheme.profileAvatarImage}
                sizes="80px"
                unoptimized
              />
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
              {accountId}
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
