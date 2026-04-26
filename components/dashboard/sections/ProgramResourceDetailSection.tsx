'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
  FolderClosed,
  Info,
} from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  appendProgramId,
  readActiveProgramId,
} from '@/lib/dashboard/activeProgram';
import { getEnvelopeData, getErrorMessage, isRecord } from '@/lib/api/response';
import {
  type DocumentItem,
  formatDocumentCategoryLabel,
  formatDocumentDateLabel,
  formatDocumentStatusLabel,
  toDocumentItem,
} from '@/lib/dashboard/documents';

interface ProgramResourceDetailSectionProps {
  resourceId: string;
}

const paymentsTheme = componentsTheme.dashboardPayments;
const documentsTheme = componentsTheme.dashboardDocuments;

function DetailSkeleton() {
  return (
    <div className={paymentsTheme.sectionWrapper} aria-hidden="true">
      <div className="h-4 w-44 animate-pulse rounded bg-slate-200/80" />
      <div className="h-8 w-72 animate-pulse rounded bg-slate-200/80" />
      <div className={paymentsTheme.detailLayoutGrid}>
        <div className={`${paymentsTheme.detailPrimaryCard} space-y-4`}>
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200/80" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`resource-detail-skeleton-${index}`} className="space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200/80" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200/80" />
              </div>
            ))}
          </div>
          <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-100" />
        </div>
        <div className={`${paymentsTheme.detailSideCardOuter} p-5`}>
          <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function DetailInfo({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-primary">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <div className="mt-1 text-sm text-slate-700">{value}</div>
      </div>
    </div>
  );
}

export default function ProgramResourceDetailSection({
  resourceId,
}: ProgramResourceDetailSectionProps) {
  const [resource, setResource] = useState<DocumentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchResource = async () => {
      try {
        setLoading(true);
        setError(null);

        const programId = readActiveProgramId();
        const url = appendProgramId('/api/portal/documents', programId);

        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });

        const json = (await response.json().catch(() => null)) as unknown;
        if (!response.ok) {
          throw new Error(getErrorMessage(json, 'Failed to load document details'));
        }

        if (cancelled) return;

        const payload = getEnvelopeData(json);
        const payloadRecord = isRecord(payload) ? payload : null;
        const resources = Array.isArray(payloadRecord?.programResources)
          ? payloadRecord.programResources
              .map(toDocumentItem)
              .filter((item): item is DocumentItem => item !== null)
          : [];

        const matchingResource =
          resources.find(
            item =>
              item.id === resourceId &&
              (item.documentType === 'program_resource' ||
                item.documentType === 'complementary_document')
          ) ?? null;

        setResource(matchingResource);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load document details');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchResource();

    const handleProgramChange = () => {
      if (!cancelled) {
        fetchResource();
      }
    };

    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, handleProgramChange as EventListener);

    return () => {
      cancelled = true;
      window.removeEventListener(
        ACTIVE_PROGRAM_CHANGED_EVENT,
        handleProgramChange as EventListener
      );
    };
  }, [resourceId]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <div className={paymentsTheme.sectionWrapper}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <Link href="/dashboard/documents" className="mt-4 text-sm text-primary underline">
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className={paymentsTheme.sectionWrapper}>
        <div className={paymentsTheme.detailEmptyStateCard}>
          <div className={paymentsTheme.detailEmptyStateIconWrapper}>
            <FolderClosed className="h-6 w-6" />
          </div>
          <p className={paymentsTheme.detailEmptyStateTitle}>Document not found.</p>
          <p className={paymentsTheme.detailEmptyStateBody}>
            This resource is no longer available for your current program, or the link is invalid.
          </p>
          <Link href="/dashboard/documents" className={paymentsTheme.detailEmptyStateButton}>
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Documents</span>
          </Link>
        </div>
      </div>
    );
  }

  const statusLabel = formatDocumentStatusLabel(resource.status);
  const categoryLabel = formatDocumentCategoryLabel(resource.category);
  const updatedAtLabel = formatDocumentDateLabel(resource.updatedAt);
  const statusToneClass =
    resource.status === 'available'
      ? documentsTheme.statusApproved
      : resource.status === 'under_review'
        ? documentsTheme.statusOngoing
        : documentsTheme.statusDefault;

  return (
    <div className={paymentsTheme.sectionWrapper}>
      <nav className={paymentsTheme.breadcrumbNav}>
        <Link href="/dashboard/documents" className={paymentsTheme.breadcrumbLink}>
          Documents
        </Link>
        <span className={paymentsTheme.breadcrumbSeparator}>/</span>
        <span className={paymentsTheme.breadcrumbCurrent}>Resource Details</span>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className={paymentsTheme.headingTitle}>{resource.title}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {resource.description?.trim() ||
              'Review the document details and open the attached file from here.'}
          </p>
        </div>
        <Link href="/dashboard/documents" className={paymentsTheme.backButton}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Documents</span>
        </Link>
      </div>

      <div className={paymentsTheme.detailLayoutGrid}>
        <div className="space-y-6">
          <div className={paymentsTheme.detailPrimaryCard}>
            <p className="text-sm font-extrabold text-slate-900">Document Information</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <DetailInfo
                label="Type"
                value={resource.documentType}
                icon={<FileText className="h-4 w-4" />}
              />
              <DetailInfo
                label="Status"
                value={
                  <span className={`${documentsTheme.statusBadgeBase} ${statusToneClass}`}>
                    {statusLabel}
                  </span>
                }
                icon={<Info className="h-4 w-4" />}
              />
              <DetailInfo
                label="Source"
                value={categoryLabel}
                icon={<FolderClosed className="h-4 w-4" />}
              />
              <DetailInfo
                label="Last Updated"
                value={updatedAtLabel}
                icon={<Info className="h-4 w-4" />}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {resource.description?.trim() ||
                  'No additional description has been provided for this document.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className={paymentsTheme.detailSideCardOuter}>
            <div className={paymentsTheme.detailSideCardHeader}>
              <p className={paymentsTheme.detailSideCardTitle}>Document Actions</p>
            </div>
            <div className={paymentsTheme.detailSideCardBody}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full text-primary">
                  <FolderClosed className="h-7 w-7" />
                </div>
                <p className={paymentsTheme.detailIllustrationTitle}>{resource.documentType}</p>
                <p className={paymentsTheme.detailIllustrationBody}>
                  This record belongs to your active program. Use the actions below to open or
                  download the file.
                </p>
              </div>

              {resource.fileUrl ? (
                <div className="space-y-2">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={paymentsTheme.detailMakePaymentButton}
                    download
                  >
                    <Download className="h-4 w-4" />
                    <span>Download File</span>
                  </a>
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={paymentsTheme.detailQuickSecondaryLink}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open in New Tab</span>
                  </a>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  No downloadable file is attached to this record yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
