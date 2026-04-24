"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Download, AlertTriangle, CheckCircle } from "lucide-react";
import { componentsTheme } from "@/lib/theme/components";
import DashboardPageSkeleton from "@/components/dashboard/ui/DashboardPageSkeleton";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
} from "@/lib/dashboard/activeProgram";

const TABS = ["All", "Upload Required", "Can Generate", "Reference"] as const;
type TabKey = (typeof TABS)[number];

type SortField = "name" | "description" | "type" | "actions";
type SortDirection = "asc" | "desc";
type CertSortField = "id" | "award" | "assignment" | "status" | "action";

interface ProgramDocument {
  name: string;
  description: string;
  type: string;
  category: "reference" | "upload_required" | "can_generate";
}

interface Certificate {
  id: string;
  award: string;
  assignment: string;
  status: "Approved" | "Ongoing" | string;
}

// New types added in Task 6 — present in backend API but not previously typed on frontend
interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  documentType: string;
  fileUrl?: string;
  submissionStatus?: string;
  signedCopyUrl?: string;
  rejectionReason?: string;
}

function DocumentsRowsSkeleton() {
  return (
    <div className={componentsTheme.dashboardDocuments.tableBody} aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`documents-row-skeleton-${index}`}
          className={`grid grid-cols-[2fr,3fr,1.5fr,1.5fr] ${componentsTheme.dashboardDocuments.tableRow}`}
        >
          <div className={componentsTheme.dashboardDocuments.docNameCell}>
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200/80" />
          </div>
          <div className={componentsTheme.dashboardDocuments.docDescriptionCell}>
            <div className="h-4 w-full animate-pulse rounded bg-slate-200/80" />
          </div>
          <div className={componentsTheme.dashboardDocuments.docTypeCell}>
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200/80" />
          </div>
          <div className={componentsTheme.dashboardDocuments.actionCell}>
            <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CertificatesRowsSkeleton() {
  return (
    <div className={componentsTheme.dashboardDocuments.tableBody} aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`certificates-row-skeleton-${index}`}
          className={`grid grid-cols-[1.4fr,2.4fr,2.2fr,1.4fr,1.4fr] ${componentsTheme.dashboardDocuments.tableRow}`}
        >
          <div className={componentsTheme.dashboardDocuments.docNameCell}>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200/80" />
          </div>
          <div className={componentsTheme.dashboardDocuments.docDescriptionCell}>
            <div className="h-4 w-full animate-pulse rounded bg-slate-200/80" />
          </div>
          <div className={componentsTheme.dashboardDocuments.docDescriptionCell}>
            <div className="h-4 w-full animate-pulse rounded bg-slate-200/80" />
          </div>
          <div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200/80" />
          </div>
          <div className={componentsTheme.dashboardDocuments.actionCell}>
            <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DocumentsSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("All");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [activeCertificatesTab, setActiveCertificatesTab] = useState<TabKey>("All");
  const [certSortField, setCertSortField] = useState<CertSortField>("id");
  const [certSortDirection, setCertSortDirection] = useState<SortDirection>("asc");

  const [programDocuments, setProgramDocuments] = useState<ProgramDocument[]>([]);
  const [programResources, setProgramResources] = useState<DocumentItem[]>([]);
  const [myDocuments, setMyDocuments] = useState<DocumentItem[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [errorDocs, setErrorDocs] = useState<string | null>(null);
  const [errorCerts, setErrorCerts] = useState<string | null>(null);

  // Fetch program documents
  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      setErrorDocs(null);

      const programId = readActiveProgramId();
      const url = appendProgramId("/api/portal/documents", programId);

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      const json = (await response.json().catch(() => ({}))) as any;
      if (!response.ok) {
        throw new Error(json?.message || "Failed to load documents");
      }

      // Support both old shape (data.items) and new shape (data.programResources / data.myDocuments)
      setProgramDocuments(json?.data?.items ?? []);
      setProgramResources(json?.data?.programResources ?? []);
      setMyDocuments(json?.data?.myDocuments ?? []);
    } catch (err) {
      setErrorDocs(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      await fetchDocuments();
    };

    run();

    const handleProgramChange = () => {
      if (!cancelled) {
        fetchDocuments();
      }
    };

    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, handleProgramChange as EventListener);

    return () => {
      cancelled = true;
      window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, handleProgramChange as EventListener);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch certificates
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoadingCerts(true);
        setErrorCerts(null);

        const response = await fetch("/api/portal/certificates", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const json = (await response.json().catch(() => ({}))) as any;
        if (!response.ok) {
          throw new Error(json?.message || "Failed to load certificates");
        }

        if (!cancelled) {
          setCertificates(json?.data?.items ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setErrorCerts(err instanceof Error ? err.message : "Failed to load certificates");
        }
      } finally {
        if (!cancelled) {
          setLoadingCerts(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

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
      items = programDocuments.filter(d => d.category === "upload_required");
    } else if (activeTab === "Can Generate") {
      items = programDocuments.filter(d => d.category === "can_generate");
    } else if (activeTab === "Reference") {
      items = programDocuments.filter(d => d.category === "reference");
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

  const showInitialSkeleton =
    loadingDocs &&
    loadingCerts &&
    !errorDocs &&
    !errorCerts &&
    programDocuments.length === 0 &&
    certificates.length === 0;

  if (showInitialSkeleton) {
    return <DashboardPageSkeleton variant="documents" className={componentsTheme.dashboardDocuments.sectionWrapper} />;
  }

  return (
    <div className={componentsTheme.dashboardDocuments.sectionWrapper}>
      {/* Only show legacy table if programDocuments has content (old API shape) */}
      {programDocuments.length > 0 && (
        <>
          {/* Program documents filter */}
          <div>
            <div className={componentsTheme.dashboardDocuments.tabsWrapper}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    componentsTheme.dashboardDocuments.tabButton
                  } ${
                    activeTab === tab
                      ? componentsTheme.dashboardDocuments.tabButtonActive
                      : componentsTheme.dashboardDocuments.tabButtonInactive
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Program documents table */}
          <div className={componentsTheme.dashboardDocuments.tableCard}>
            {/* Table header */}
            <div
              className={`grid grid-cols-[2fr,3fr,1.5fr,1.5fr] ${componentsTheme.dashboardDocuments.tableHeader}`}
            >
              <button
                type="button"
                onClick={() => handleSortClick("name")}
                className={componentsTheme.dashboardDocuments.tableHeaderSortButton}
              >
                <span>Document Name</span>
                <span className={componentsTheme.dashboardDocuments.tableHeaderSortIcon}>
                  {sortField === "name" ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSortClick("description")}
                className={componentsTheme.dashboardDocuments.tableHeaderSortButton}
              >
                <span>Description</span>
                <span className={componentsTheme.dashboardDocuments.tableHeaderSortIcon}>
                  {sortField === "description" ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSortClick("type")}
                className={componentsTheme.dashboardDocuments.tableHeaderSortButton}
              >
                <span>Type</span>
                <span className={componentsTheme.dashboardDocuments.tableHeaderSortIcon}>
                  {sortField === "type" ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSortClick("actions")}
                className={componentsTheme.dashboardDocuments.tableHeaderSortButtonRight}
              >
                <span>Actions</span>
                <span className={componentsTheme.dashboardDocuments.tableHeaderSortIcon}>
                  {sortField === "actions" ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
                </span>
              </button>
            </div>

            {loadingDocs ? (
              <DocumentsRowsSkeleton />
            ) : errorDocs ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="mt-2 text-sm text-red-600">{errorDocs}</p>
              </div>
            ) : filteredSortedDocuments.length === 0 ? (
              <div className={componentsTheme.dashboardDocuments.emptyStateWrapper}>
                <div className={componentsTheme.dashboardDocuments.emptyStateImageWrapper}>
                  <Image
                    src="/img/tablenotfounds.png"
                    alt="No documents illustration"
                    width={260}
                    height={160}
                    className="h-auto w-auto max-h-40"
                  />
                </div>
                <p className={componentsTheme.dashboardDocuments.emptyStateTitle}>
                  No documents available yet
                </p>
                <p className={componentsTheme.dashboardDocuments.emptyStateText}>
                  Program documents will be available here when published.
                </p>
              </div>
            ) : (
              <div className={componentsTheme.dashboardDocuments.tableBody}>
                {filteredSortedDocuments.map(doc => (
                  <div
                    key={doc.name}
                    className={`grid grid-cols-[2fr,3fr,1.5fr,1.5fr] ${componentsTheme.dashboardDocuments.tableRow}`}
                  >
                    <div className={componentsTheme.dashboardDocuments.docNameCell}>{doc.name}</div>
                    <div className={componentsTheme.dashboardDocuments.docDescriptionCell}>
                      {doc.description}
                    </div>
                    <div className={componentsTheme.dashboardDocuments.docTypeCell}>{doc.type}</div>
                    <div className={componentsTheme.dashboardDocuments.actionCell}>
                      <button
                        type="button"
                        className={componentsTheme.dashboardDocuments.downloadButton}
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
        </>
      )}

      {/* Program Resources section (new — complementary documents) */}
      {!loadingDocs && programResources.length > 0 && (
        <div className="mt-6">
          <h2 className={componentsTheme.dashboardDocuments.certificatesTitle}>Program Resources</h2>
          <p className={componentsTheme.dashboardDocuments.certificatesSubtitle}>
            Additional resources and complementary documents provided for your program.
          </p>
          <div className={componentsTheme.dashboardDocuments.tableCard}>
            <div className={componentsTheme.dashboardDocuments.tableBody}>
              {programResources.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-4 ${componentsTheme.dashboardDocuments.tableRow}`}
                >
                  <div>
                    <p className={componentsTheme.dashboardDocuments.docNameCell}>{item.title}</p>
                    {item.description && (
                      <p className={componentsTheme.dashboardDocuments.docDescriptionCell}>
                        {item.description}
                      </p>
                    )}
                  </div>
                  <div className={componentsTheme.dashboardDocuments.actionCell}>
                    {item.documentType === "complementary_document" && item.fileUrl && (
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50"
                        download
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My Documents section (new — agreement letters) */}
      {!loadingDocs && myDocuments.length > 0 && (
        <div className="mt-6">
          <h2 className={componentsTheme.dashboardDocuments.certificatesTitle}>My Documents</h2>
          <p className={componentsTheme.dashboardDocuments.certificatesSubtitle}>
            Personal documents assigned to you, including agreement letters requiring your signature.
          </p>
          <div className={componentsTheme.dashboardDocuments.tableCard}>
            <div className={componentsTheme.dashboardDocuments.tableBody}>
              {myDocuments.map(item => (
                <div
                  key={item.id}
                  className={`${componentsTheme.dashboardDocuments.tableRow}`}
                >
                  <p className={componentsTheme.dashboardDocuments.docNameCell}>{item.title}</p>
                  {item.description && (
                    <p className={componentsTheme.dashboardDocuments.docDescriptionCell}>
                      {item.description}
                    </p>
                  )}

                  {item.documentType === "agreement_letter" && (
                    <div className="mt-2 flex flex-col gap-2">
                      {item.fileUrl && (
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline"
                          download
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download Agreement Letter
                        </a>
                      )}

                      {item.submissionStatus !== "verified" && (
                        <SignedCopyUpload
                          templateId={item.id}
                          submissionStatus={item.submissionStatus ?? "pending_upload"}
                          signedCopyUrl={item.signedCopyUrl}
                          onUploaded={fetchDocuments}
                        />
                      )}

                      {item.submissionStatus === "verified" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Signed copy verified
                        </span>
                      )}

                      {item.submissionStatus === "rejected" && item.rejectionReason && (
                        <p className="text-[11px] text-red-600">
                          Rejected: {item.rejectionReason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certificates section */}
      <div className={componentsTheme.dashboardDocuments.certificatesSectionWrapper}>
        <div>
          <h2 className={componentsTheme.dashboardDocuments.certificatesTitle}>Your Achievement Certificates</h2>
          <p className={componentsTheme.dashboardDocuments.certificatesSubtitle}>
            View and download your earned certificates. These documents certify your successful completion of
            program milestones and achievements.
          </p>
        </div>

        {/* Certificates filter tabs */}
        <div>
          <div className={componentsTheme.dashboardDocuments.tabsWrapper}>
            {TABS.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCertificatesTab(tab)}
                className={`${
                  componentsTheme.dashboardDocuments.tabButton
                } ${
                  activeCertificatesTab === tab
                    ? componentsTheme.dashboardDocuments.tabButtonActive
                    : componentsTheme.dashboardDocuments.tabButtonInactive
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Certificates table */}
        <div className={componentsTheme.dashboardDocuments.tableCard}>
          <div
            className={`grid grid-cols-[1.4fr,2.4fr,2.2fr,1.4fr,1.4fr] ${componentsTheme.dashboardDocuments.tableHeader}`}
          >
            <button
              type="button"
              onClick={() => handleCertSortClick("id")}
              className={componentsTheme.dashboardDocuments.tableHeaderSortButton}
            >
              <span>Certificate ID</span>
              <span className={componentsTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "id" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCertSortClick("award")}
              className={componentsTheme.dashboardDocuments.tableHeaderSortButton}
            >
              <span>Award Details</span>
              <span className={componentsTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "award" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCertSortClick("assignment")}
              className={componentsTheme.dashboardDocuments.tableHeaderSortButton}
            >
              <span>Assignment Info</span>
              <span className={componentsTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "assignment" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCertSortClick("status")}
              className={componentsTheme.dashboardDocuments.tableHeaderSortButton}
            >
              <span>Status</span>
              <span className={componentsTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "status" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleCertSortClick("action")}
              className={componentsTheme.dashboardDocuments.tableHeaderSortButtonRight}
            >
              <span>Action</span>
              <span className={componentsTheme.dashboardDocuments.tableHeaderSortIcon}>
                {certSortField === "action" ? (certSortDirection === "asc" ? "↑" : "↓") : "↕"}
              </span>
            </button>
          </div>

          {/* Empty state / rows certificates */}
          {loadingCerts ? (
            <CertificatesRowsSkeleton />
          ) : errorCerts ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="mt-2 text-sm text-red-600">{errorCerts}</p>
            </div>
          ) : filteredSortedCertificates.length === 0 ? (
            <div className={componentsTheme.dashboardDocuments.emptyStateWrapper}>
              <div className={componentsTheme.dashboardDocuments.emptyStateImageWrapper}>
                <Image
                  src="/img/tablenotfounds.png"
                  alt="No certificates illustration"
                  width={260}
                  height={160}
                  className="h-auto w-auto max-h-40"
                />
              </div>
              <p className={componentsTheme.dashboardDocuments.emptyStateTitle}>
                No certificates available yet
              </p>
              <p className={componentsTheme.dashboardDocuments.emptyStateText}>
                Your certificates will appear here once they are issued for your achievements.
              </p>
            </div>
          ) : (
            <div className={componentsTheme.dashboardDocuments.tableBody}>
              {filteredSortedCertificates.map(cert => (
                <div
                  key={cert.id}
                  className={`grid grid-cols-[1.4fr,2.4fr,2.2fr,1.4fr,1.4fr] ${componentsTheme.dashboardDocuments.tableRow}`}
                >
                  <div className={componentsTheme.dashboardDocuments.docNameCell}>{cert.id}</div>
                  <div className={componentsTheme.dashboardDocuments.docDescriptionCell}>{cert.award}</div>
                  <div className={componentsTheme.dashboardDocuments.docDescriptionCell}>{cert.assignment}</div>
                  <div>
                    <span
                      className={`${componentsTheme.dashboardDocuments.statusBadgeBase} ${
                        {
                          Approved: componentsTheme.dashboardDocuments.statusApproved,
                          Ongoing: componentsTheme.dashboardDocuments.statusOngoing,
                        }[cert.status] || componentsTheme.dashboardDocuments.statusDefault
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                  <div className={componentsTheme.dashboardDocuments.actionCell}>
                    <button
                      type="button"
                      className={componentsTheme.dashboardDocuments.downloadButton}
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

function SignedCopyUpload({
  templateId,
  submissionStatus,
  signedCopyUrl,
  onUploaded,
}: {
  templateId: string;
  submissionStatus: string;
  signedCopyUrl?: string;
  onUploaded: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(
        `/api/portal/documents/${templateId}/signed-copy`,
        { method: "POST", body: formData },
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? data.error ?? "Upload failed");
      }
      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {submissionStatus === "uploaded" && signedCopyUrl ? (
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-600 font-medium">
            Signed copy submitted — awaiting review
          </span>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-[11px] text-zinc-500 underline hover:text-zinc-700"
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload Signed Copy"}
        </button>
      )}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
