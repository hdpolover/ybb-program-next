"use client";

import Image from "next/image";
import { PencilLine } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const submissionTheme = jysSectionTheme.dashboardSubmission;

export default function SubmissionReadProfileHeaderSection() {
  return (
    <div className={submissionTheme.profileCard}>
      <div className={submissionTheme.profileRow}>
        <div className={submissionTheme.profileLeft}>
          <div className={submissionTheme.profileAvatarWrapper}>
            <div className={submissionTheme.profileAvatarInner}>
              <Image
                src="/img/photoprofile.png"
                alt="Profile photo"
                fill
                className={submissionTheme.profileAvatarImage}
                sizes="80px"
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
            <p className={submissionTheme.profileName}>HILMI FARREL FIRJATULLAH</p>
            <p className={submissionTheme.profileRole}>Participant Account</p>
            <p className={submissionTheme.profileMeta}>
              <span className={submissionTheme.profileMetaLabel}>Account ID:</span>{" "}
              991868DDE4976465C
            </p>
          </div>
        </div>

        <div className={submissionTheme.profileRightWrapper}>
          <p className={submissionTheme.profileRightLabel}>Primary Address</p>
          <p className={submissionTheme.profileRightText}>
            Depok, West Java, 16423
            <br />
            Indonesia
          </p>
        </div>
      </div>
    </div>
  );
}
