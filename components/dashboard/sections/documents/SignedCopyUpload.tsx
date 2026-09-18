'use client';

// Agreement-letter signed copy upload, extracted from DocumentsSection so the
// upload path can be tested on its own. See lib/dashboard/signedCopyUpload.ts
// for why each client-side check exists.

import { useRef, useState } from 'react';
import { Clock, CheckCircle2, XCircle, RotateCcw, FileText } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { getErrorMessage } from '@/lib/api/response';
import { withTimeoutSignal } from '@/lib/api/fetchWithTimeout';
import {
  SIGNED_COPY_ACCEPT,
  SIGNED_COPY_MAX_FILE_BYTES,
  SIGNED_COPY_NETWORK_MESSAGE,
  SIGNED_COPY_TIMEOUT_MESSAGE,
  SignedCopyFileError,
  prepareSignedCopyFile,
  signedCopyFailureFallback,
} from '@/lib/dashboard/signedCopyUpload';

/**
 * Slightly longer than the proxy's 120s, so a stalled upstream surfaces the
 * server's specific message rather than this generic one. It exists for the
 * case the proxy itself never answers: without it the button spins forever.
 */
const CLIENT_UPLOAD_TIMEOUT_MS = 130_000;

const MAX_MB = Math.round(SIGNED_COPY_MAX_FILE_BYTES / (1024 * 1024));

export const SIGNED_COPY_SUCCESS_MESSAGE = 'Signed copy uploaded. We will review it shortly.';

function isAbortLike(err: unknown): boolean {
  // Checked by name, not `instanceof DOMException`: older Android WebViews
  // reject with a plain Error named AbortError.
  return (
    typeof err === 'object' &&
    err !== null &&
    'name' in err &&
    (err.name === 'AbortError' || err.name === 'TimeoutError')
  );
}

const theme = componentsTheme.dashboardDocuments;

/**
 * A real chip, separate from the body copy below it — the "in review" text
 * used to read as a continuation of the previous sentence, which is exactly
 * what ops flagged. Only the four states that mean something happened get a
 * chip; the initial "nothing uploaded yet" state stays chip-free.
 */
function StatusChip({ submissionStatus }: { submissionStatus: string }) {
  const chip = {
    uploaded: { label: 'Under review', tone: theme.docStatusChipUnderReview, Icon: Clock },
    approved: { label: 'Approved', tone: theme.docStatusChipApproved, Icon: CheckCircle2 },
    rejected: { label: 'Not accepted', tone: theme.docStatusChipRejected, Icon: XCircle },
    revision_requested: {
      label: 'Changes requested',
      tone: theme.docStatusChipRevision,
      Icon: RotateCcw,
    },
  }[submissionStatus];

  if (!chip) return null;

  return (
    <span className={`${theme.docStatusChipBase} ${chip.tone}`}>
      <chip.Icon className="h-3 w-3" />
      {chip.label}
    </span>
  );
}

export default function SignedCopyUpload({
  templateId,
  submissionStatus,
  submissionNote,
  signedCopyUrl,
  reviewedAtLabel,
  onUploaded,
}: {
  templateId: string;
  submissionStatus: string;
  /** Admin's reason, shown verbatim on `rejected` / `revision_requested`. */
  submissionNote?: string;
  /** The file the participant uploaded, so they can check they sent the right one. */
  signedCopyUrl?: string;
  /** Pre-formatted "reviewed on" date; parent owns timezone/hydration concerns. */
  reviewedAtLabel?: string;
  onUploaded: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const picked = input.files?.[0];
    if (!picked) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    // Not AbortSignal.timeout: it is missing on the older iOS Safari and
    // Android WebViews many participants use (in-app browsers included), where
    // referencing it threw a TypeError before the request was ever sent.
    const { signal, cleanup } = withTimeoutSignal(CLIENT_UPLOAD_TIMEOUT_MS);
    try {
      const file = await prepareSignedCopyFile(picked);

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`/api/portal/documents/${templateId}/signed-copy`, {
        method: 'POST',
        body: formData,
        signal,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as unknown;
        // A 401 body just says "Unauthorized", which tells a participant nothing
        // about what to do; everything else carries the server's own reason.
        throw new Error(
          res.status === 401
            ? signedCopyFailureFallback(401)
            : getErrorMessage(data, signedCopyFailureFallback(res.status)),
        );
      }
      setSuccess(SIGNED_COPY_SUCCESS_MESSAGE);
      onUploaded();
    } catch (err) {
      if (err instanceof SignedCopyFileError) {
        setError(err.message);
      } else if (isAbortLike(err)) {
        setError(SIGNED_COPY_TIMEOUT_MESSAGE);
      } else if (err instanceof TypeError) {
        // fetch rejects with a TypeError ("Failed to fetch", "Load failed")
        // when the connection drops; that text means nothing to a participant.
        setError(SIGNED_COPY_NETWORK_MESSAGE);
      } else {
        setError(err instanceof Error && err.message ? err.message : signedCopyFailureFallback(0));
      }
    } finally {
      cleanup();
      setUploading(false);
      // Without this, picking the same file again after a failure fires no
      // change event, so the retry button silently does nothing.
      input.value = '';
    }
  }

  const openPicker = () => fileRef.current?.click();

  // The server locks a re-upload once approved (400); the UI must agree
  // rather than let someone hit that. Every other status still allows it.
  const isApproved = submissionStatus === 'approved';
  const isUploaded = submissionStatus === 'uploaded';
  const showNote = (submissionStatus === 'rejected' || submissionStatus === 'revision_requested') && submissionNote;

  return (
    <div className="space-y-1.5">
      <StatusChip submissionStatus={submissionStatus} />

      {isApproved && (
        <p className="text-[11px] text-emerald-700">
          This signed copy has been approved. No further action is needed.
        </p>
      )}
      {isUploaded && (
        <p className="text-[11px] text-amber-700">
          Signed copy submitted, awaiting review. We will let you know once it has been checked.
        </p>
      )}
      {showNote && <p className="text-[11px] text-slate-700 break-words">{submissionNote}</p>}
      {reviewedAtLabel && (isApproved || submissionStatus === 'rejected') && (
        <p className="text-[11px] text-slate-500">Reviewed on {reviewedAtLabel}</p>
      )}

      {signedCopyUrl && (
        <a
          href={signedCopyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-1 text-[11px] font-medium text-blue-600 hover:underline"
        >
          <FileText className="h-3.5 w-3.5" />
          View the file you uploaded
        </a>
      )}

      {/* Keyed on status alone: the documents response can omit signedCopyUrl
          (e.g. when presigning it fails), and treating that as "not submitted"
          put the upload button back as if the upload had been lost. */}
      {isApproved ? null : isUploaded ? (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="w-fit text-[11px] text-zinc-500 underline hover:text-zinc-700 disabled:opacity-60"
        >
          {uploading ? 'Uploading…' : 'Replace'}
        </button>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="inline-flex w-fit items-center gap-1 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
        >
          {uploading ? 'Uploading…' : 'Upload Signed Copy'}
        </button>
      )}
      {!isApproved && (
        <p className="text-[11px] text-zinc-500">PDF, DOC/DOCX, or a JPG/PNG photo, up to {MAX_MB} MB.</p>
      )}
      {error && (
        <p role="alert" className="mt-1 text-[11px] text-red-600">
          {error}
        </p>
      )}
      {success && !error && (
        <p role="status" className="mt-1 text-[11px] text-emerald-600">
          {success}
        </p>
      )}
      <input
        ref={fileRef}
        type="file"
        accept={SIGNED_COPY_ACCEPT}
        className="hidden"
        data-testid="signed-copy-input"
        onChange={handleFileChange}
      />
    </div>
  );
}
