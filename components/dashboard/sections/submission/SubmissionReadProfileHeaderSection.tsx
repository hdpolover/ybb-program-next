"use client";

import Image from "next/image";
import { Eye, EyeOff, Loader2, PencilLine } from "lucide-react";
import { useRef, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { componentsTheme } from "@/lib/theme/components";

const submissionTheme = componentsTheme.dashboardSubmission;

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif";
const MAX_SIZE_MB = 5;

export default function SubmissionReadProfileHeaderSection() {
  const { me, onboarding, participantProfile } = useDashboardData();
  const [showAccountId, setShowAccountId] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayName =
    participantProfile?.displayName?.trim() ||
    participantProfile?.fullName?.trim() ||
    onboarding?.displayName?.trim() ||
    onboarding?.fullName?.trim() ||
    "Participant";
  const profileImageUrl =
    localPhotoUrl ?? participantProfile?.profilePictureUrl?.trim() ?? null;
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

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected if needed
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, WebP, GIF).");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    setUploading(true);

    // Optimistic preview
    const previewUrl = URL.createObjectURL(file);
    setLocalPhotoUrl(previewUrl);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/api/participants/me/photo", {
        method: "POST",
        body: form,
      });

      const json = (await res.json().catch(() => ({}))) as {
        statusCode?: number;
        message?: string;
        data?: { profilePictureUrl?: string };
      };

      if (!res.ok) {
        setLocalPhotoUrl(null);
        toast.error(json.message ?? "Upload failed. Please try again.");
      } else {
        const confirmedUrl = json.data?.profilePictureUrl;
        if (confirmedUrl) setLocalPhotoUrl(confirmedUrl);
        setTimeout(() => URL.revokeObjectURL(previewUrl), 3000);
        toast.success("Profile picture updated!");
      }
    } catch (err) {
      setLocalPhotoUrl(null);
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

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
                  className={`${submissionTheme.profileAvatarImage} ${uploading ? "opacity-50" : ""}`}
                  sizes="80px"
                  unoptimized
                />
              ) : (
                <span className={`flex h-full w-full items-center justify-center text-3xl font-bold text-white ${uploading ? "opacity-50" : ""}`}>
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              className="hidden"
              aria-hidden="true"
              onChange={handleFileChange}
            />

            <button
              type="button"
              className={`${submissionTheme.profileAvatarButton} ${uploading ? "cursor-not-allowed opacity-50" : ""}`}
              aria-label="Change profile photo"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <PencilLine className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <p className={submissionTheme.profileName} style={{ textTransform: 'capitalize' }}>{displayName}</p>
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
