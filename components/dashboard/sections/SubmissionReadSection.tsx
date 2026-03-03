"use client";

import { useState } from "react";
import { jysSectionTheme } from "@/lib/theme/jys-components";
import SubmissionReadProfileHeaderSection from "./submission/SubmissionReadProfileHeaderSection";
import SubmissionReadPersonalDetailsSection from "./submission/SubmissionReadPersonalDetailsSection";
import SubmissionReadProfessionalProfileSection from "./submission/SubmissionReadProfessionalProfileSection";
import SubmissionReadEntryInformationSection from "./submission/SubmissionReadEntryInformationSection";
import SubmissionReadMiscSection from "./submission/SubmissionReadMiscSection";

const submissionTheme = jysSectionTheme.dashboardSubmission;

const tabs = ["Personal Details", "Professional Profile", "Entry Information", "Miscellaneous"] as const;

type TabKey = (typeof tabs)[number];

export default function SubmissionReadSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("Personal Details");

  return (
    <section className={submissionTheme.sectionWrapper}>
      <SubmissionReadProfileHeaderSection />

      {/* Tabs */}
      <div className={submissionTheme.tabsWrapper}>
        {tabs.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`${submissionTheme.tabButtonBase} ${
              activeTab === tab
                ? submissionTheme.tabButtonActive
                : submissionTheme.tabButtonInactive
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Personal Details" && <SubmissionReadPersonalDetailsSection />}
      {activeTab === "Professional Profile" && <SubmissionReadProfessionalProfileSection />}
      {activeTab === "Entry Information" && <SubmissionReadEntryInformationSection />}
      {activeTab === "Miscellaneous" && <SubmissionReadMiscSection />}
    </section>
  );
}
