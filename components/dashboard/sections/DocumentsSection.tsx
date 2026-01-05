"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { jysSectionTheme } from "@/lib/theme/jys-components";

const TABS = ["All", "Upload Required", "Can Generate", "Reference"] as const;
type TabKey = (typeof TABS)[number];

type SortField = "name" | "description" | "type" | "actions";
type SortDirection = "asc" | "desc";
type CertSortField = "id" | "award" | "assignment" | "status" | "action";

export default function DocumentsSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("All");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [activeCertificatesTab, setActiveCertificatesTab] = useState<TabKey>("All");
  const [certSortField, setCertSortField] = useState<CertSortField>("id");
  const [certSortDirection, setCertSortDirection] = useState<SortDirection>("asc");

  // Mock data for program documents
  const programDocuments = useMemo(
    () =>
      [
        {
          name: "Registration Fee Fully Funded Registration Guidebook",
          description: "Detailed guidebook for the fully funded registration fee and payment process.",
          type: "Registration Fee",
          category: "reference" as const,
        },
        {
          name: "Program Fee Fully Funded Registration Guidebook",
          description: "Program fee fully funded registration and payment guideline.",
          type: "Registration Fee",
          category: "reference" as const,
        },
      ],
    [],
  );

  // Mock data for certificates
  const certificates = useMemo(
    () =>
      [
        {
          id: "KYS-2387279132",
          award: "Fully Funded Awardee",
          assignment: "Proposal Approved",
          status: "Approved" as const,
        },
        {
          id: "KYS-8239173232",
          award: "Participation Award",
          assignment: "International Youth Conference",
          status: "Ongoing" as const,
        },
      ],
    [],
  );

  const handleSortClick = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredSortedDocuments = useMemo(() => {
    let items = programDocuments;
    if (activeTab === "Upload Required") {
      items = [];
    } else if (activeTab === "Can Generate") {
      items = [];
    } else if (activeTab === "Reference") {
      items = programDocuments;
    }

    const sorted = [...items].sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      let av: string;
      let bv: string;
      if (sortField === "name") {
        av = a.name;
        bv = b.name;
      } else if (sortField === "description") {
        av = a.description;
        bv = b.description;
      } else if (sortField === "type") {
        av = a.type;
        bv = b.type;
      } else {
        av = "Download";
        bv = "Download";
      }
      return av.localeCompare(bv) * dir;
    });

    return sorted;
  }, [programDocuments, activeTab, sortField, sortDirection]);

  const filteredSortedCertificates = useMemo(() => {
    let items = certificates;
    if (activeCertificatesTab === "Upload Required") {
      items = [];
    } else if (activeCertificatesTab === "Can Generate") {
      items = [];
    } else if (activeCertificatesTab === "Reference") {
      items = certificates;
    }

    const sorted = [...items].sort((a, b) => {
      const dir = certSortDirection === "asc" ? 1 : -1;
      let av: string;
      let bv: string;
      if (certSortField === "id") {
        av = a.id;
        bv = b.id;
      } else if (certSortField === "award") {
        av = a.award;
        bv = b.award;
      } else if (certSortField === "assignment") {
        av = a.assignment;
        bv = b.assignment;
      } else if (certSortField === "status") {
        av = a.status;
        bv = b.status;
      } else {
        av = "Download";
        bv = "Download";
      }
      return av.localeCompare(bv) * dir;
    });

    return sorted;
  }, [certificates, activeCertificatesTab, certSortField, certSortDirection]);

  const handleCertSortClick = (field: CertSortField) => {
    if (certSortField === field) {
      setCertSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setCertSortField(field);
      setCertSortDirection("asc");
    }
  };

  return (
    <div className={jysSectionTheme.dashboardDocuments.sectionWrapper}>
      {/* Program documents filter */}
      <div>
        <div className={jysSectionTheme.dashboardDocuments.tabsWrapper}>
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`${
                jysSectionTheme.dashboardDocuments.tabButton
              } ${
                activeTab === tab
                  ? jysSectionTheme.dashboardDocuments.tabButtonActive
                  : jysSectionTheme.dashboardDocuments.tabButtonInactive
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Program documents table */}
      <div className={jysSectionTheme.dashboardDocuments.tableCard}>
        {/* Table header */}
        <div
          className={`grid grid-cols-[2fr,3fr,1.5fr,1.5fr] ${jysSectionTheme.dashboardDocuments.tableHeader}`}
        >
          <button
            type="button"
            onClick={() => handleSortClick("name")}
            className={jysSectionTheme.dashboardDocuments.tableHeaderSortButton}
          >
            <span>Document Name</span>
            <span className={jysSectionTheme.dashboardDocuments.tableHeaderSortIcon}>
              {sortField === "name" ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSortClick("description")}
            className={jysSectionTheme.dashboardDocuments.tableHeaderSortButton}
          >
            <span>Description</span>
            <span className={jysSectionTheme.dashboardDocuments.tableHeaderSortIcon}>
              {sortField === "description" ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSortClick("type")}
            className={jysSectionTheme.dashboardDocuments.tableHeaderSortButton}
          >
            <span>Type</span>
            <span className={jysSectionTheme.dashboardDocuments.tableHeaderSortIcon}>
              {sortField === "type" ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSortClick("actions")}
            className={jysSectionTheme.dashboardDocuments.tableHeaderSortButtonRight}
          >
            <span>Actions</span>
            <span className={jysSectionTheme.dashboardDocuments.tableHeaderSortIcon}>
              {sortField === "actions" ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
            </span>
          </button>
        </div>

        {filteredSortedDocuments.length === 0 ? (
          <div className={jysSectionTheme.dashboardDocuments.emptyStateWrapper}>
            <div className={jysSectionTheme.dashboardDocuments.emptyStateImageWrapper}>
              <Image
                src="/img/tablenotfounds.png"
                alt="No documents illustration"
                width={260}
                height={160}
                className="h-auto w-auto max-h-40"
              />
            </div>
            <p className={jysSectionTheme.dashboardDocuments.emptyStateTitle}>
              No documents available yet
            </p>
            <p className={jysSectionTheme.dashboardDocuments.emptyStateText}>
              Program documents will be available here when published.
            </p>
          </div>
        ) : (
          <div className={jysSectionTheme.dashboardDocuments.tableBody}>
            {filteredSortedDocuments.map(doc => (
              <div
                key={doc.name}
                className={`grid grid-cols-[2fr,3fr,1.5fr,1.5fr] ${jysSectionTheme.dashboardDocuments.tableRow}`}
              >
                <div className={jysSectionTheme.dashboardDocuments.docNameCell}>{doc.name}</div>
                <div className={jysSectionTheme.dashboardDocuments.docDescriptionCell}>
                  {doc.description}
                </div>
                <div className={jysSectionTheme.dashboardDocuments.docTypeCell}>{doc.type}</div>
                <div className={jysSectionTheme.dashboardDocuments.actionCell}>
                  <button
                    type="button"
                    className={jysSectionTheme.dashboardDocuments.downloadButton}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificates section */}
      <div className={jysSectionTheme.dashboardDocuments.certificatesSectionWrapper}>
        <div>
          <h2 className={jysSectionTheme.dashboardDocuments.certificatesTitle}>Your Achievement Certificates</h2>
          <p className={jysSectionTheme.dashboardDocuments.certificatesSubtitle}>
            View and download your earned certificates. These documents certify your successful completion of
            program milestones and achievements.
          </p>
        </div>

        {/* Certificates filter tabs */}
        <div>
          <div className={jysSectionTheme.dashboardDocuments.tabsWrapper}>
            {TABS.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCertificatesTab(tab)}
                className={`${
                  jysSectionTheme.dashboardDocuments.tabButton
                } ${
                  activeCertificatesTab === tab
                    ? jysSectionTheme.dashboardDocuments.tabButtonActive
                    : jysSectionTheme.dashboardDocuments.tabButtonInactive
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Certificates table */}
        <div className={jysSectionTheme.dashboardDocuments.tableCard}>
          <div
            className={`grid grid-cols-[1.4fr,2.4fr,2.2fr,1.4fr,1.4fr] ${jysSectionTheme.dashboardDocuments.tableHeader}`}
          >
            <button
              type="button"
              onClick={() => handleCertSortClick("id")}
              className={jysSectionTheme.dashboardDocuments.tableHeaderSortButton}
            >
              <span>Certificate ID</span>
              <span className={jysSectionTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "id" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCertSortClick("award")}
              className={jysSectionTheme.dashboardDocuments.tableHeaderSortButton}
            >
              <span>Award Details</span>
              <span className={jysSectionTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "award" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCertSortClick("assignment")}
              className={jysSectionTheme.dashboardDocuments.tableHeaderSortButton}
            >
              <span>Assignment Info</span>
              <span className={jysSectionTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "assignment" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCertSortClick("status")}
              className={jysSectionTheme.dashboardDocuments.tableHeaderSortButton}
            >
              <span>Status</span>
              <span className={jysSectionTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "status" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCertSortClick("action")}
              className={jysSectionTheme.dashboardDocuments.tableHeaderSortButtonRight}
            >
              <span>Action</span>
              <span className={jysSectionTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "action" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
          </div>

          {/* Empty state / rows certificates */}
          {filteredSortedCertificates.length === 0 ? (
            <div className={jysSectionTheme.dashboardDocuments.emptyStateWrapper}>
              <div className={jysSectionTheme.dashboardDocuments.emptyStateImageWrapper}>
                <Image
                  src="/img/tablenotfounds.png"
                  alt="No certificates illustration"
                  width={260}
                  height={160}
                  className="h-auto w-auto max-h-40"
                />
              </div>
              <p className={jysSectionTheme.dashboardDocuments.emptyStateTitle}>
                No certificates available yet
              </p>
              <p className={jysSectionTheme.dashboardDocuments.emptyStateText}>
                Your certificates will appear here once they are issued for your achievements.
              </p>
            </div>
          ) : (
            <div className={jysSectionTheme.dashboardDocuments.tableBody}>
              {filteredSortedCertificates.map(cert => (
                <div
                  key={cert.id}
                  className={`grid grid-cols-[1.4fr,2.4fr,2.2fr,1.4fr,1.4fr] ${jysSectionTheme.dashboardDocuments.tableRow}`}
                >
                  <div className={jysSectionTheme.dashboardDocuments.docNameCell}>{cert.id}</div>
                  <div className={jysSectionTheme.dashboardDocuments.docDescriptionCell}>{cert.award}</div>
                  <div className={jysSectionTheme.dashboardDocuments.docDescriptionCell}>{cert.assignment}</div>
                  <div>
                    <span
                      className={`${jysSectionTheme.dashboardDocuments.statusBadgeBase} ${
                        {
                          Approved: jysSectionTheme.dashboardDocuments.statusApproved,
                          Ongoing: jysSectionTheme.dashboardDocuments.statusOngoing,
                        }[cert.status] || jysSectionTheme.dashboardDocuments.statusDefault
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                  <div className={jysSectionTheme.dashboardDocuments.actionCell}>
                    <button
                      type="button"
                      className={jysSectionTheme.dashboardDocuments.downloadButton}
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
