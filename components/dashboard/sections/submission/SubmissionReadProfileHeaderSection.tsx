"use client";

import Image from "next/image";
import { Eye, EyeOff, Loader2, PencilLine } from "lucide-react";
import { useRef, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDashboardData } from "@/components/dashboard/DashboardDataContext";
import { componentsTheme } from "@/lib/theme/components";
import {
  prepareImageForUpload,
  ImagePrepError,
  looksLikeImageFile,
  MAX_UPLOAD_BYTES,
} from "@/lib/media/prepareImageForUpload";

const submissionTheme = componentsTheme.dashboardSubmission;

// HEIC/HEIF included so iPhone users (whose default camera format this is)
// see their photos in the picker at all; prepareImageForUpload() converts
// them to JPEG (where the browser can decode HEIC) before upload.
const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif";
// Reconciled with the server-side image cap — see lib/media/prepareImageForUpload.ts.
const MAX_SIZE_MB = Math.round(MAX_UPLOAD_BYTES / (1024 * 1024));

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
  const email = me?.email?.trim() || "-";
  const maskedEmail = useMemo(() => {
    if (!email || email === "-") return "-";
    const [localPart, domainPart] = email.split("@");
    if (!localPart || !domainPart) return email;
    if (localPart.length <= 2) return `${localPart.charAt(0)}•@${domainPart}`;
    return `${localPart.slice(0, 2)}${"•".repeat(Math.min(4, localPart.length - 2))}@${domainPart}`;
  }, [email]);
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

    if (!looksLikeImageFile(file)) {
      toast.error("Please select an image file (JPEG, PNG, WebP, GIF, or HEIC).");
      return;
    }

    setUploading(true);

    // Downscale + convert to JPEG before upload. Solves oversized phone
    // photos and (where the browser can decode it) HEIC, and cuts upload
    // time on slow mobile connections. Throws with a specific, actionable
    // message when the browser genuinely cannot decode the file.
    let uploadFile: File;
    try {
      uploadFile = await prepareImageForUpload(file);
    } catch (err) {
      setUploading(false);
      const message = err instanceof ImagePrepError ? err.message : "We couldn't process that image. Please try a different photo.";
      toast.error(message);
      return;
    }

    if (uploadFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploading(false);
      toast.error(`File is too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    // Optimistic preview
    const previewUrl = URL.createObjectURL(uploadFile);
    setLocalPhotoUrl(previewUrl);

    try {
      const form = new FormData();
      form.append("file", uploadFile);

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

          <div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
            <p className={`${submissionTheme.profileName} truncate`} style={{ textTransform: 'capitalize' }}>{displayName}</p>
            <div className={submissionTheme.profileMeta}>
              <div className="min-w-0 truncate">{maskedEmail}</div>
            </div>
            <div className={`${submissionTheme.profileMeta} mt-0.5`}>
              <span className={submissionTheme.profileMetaLabel}>Account ID:</span>
              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <span className="block min-w-0 flex-1 truncate font-mono">
                  {showAccountId ? accountId : maskedAccountId}
                </span>
                {accountId !== "-" && (
                  <button
                    type="button"
                    onClick={() => setShowAccountId(v => !v)}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-500 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={showAccountId ? "Hide account id" : "Show account id"}
                  >
                    {showAccountId ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`${submissionTheme.profileRightWrapper} w-full border-t border-slate-100 pt-4 md:w-auto md:border-t-0 md:pt-0`}>
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
