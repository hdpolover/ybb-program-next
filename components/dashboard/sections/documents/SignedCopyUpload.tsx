'use client';

// Agreement-letter signed copy upload, extracted from DocumentsSection so the
// upload path can be tested on its own. See lib/dashboard/signedCopyUpload.ts
// for why each client-side check exists.

import { useRef, useState } from 'react';
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

export default function SignedCopyUpload({
  templateId,
  submissionStatus,
  onUploaded,
}: {
  templateId: string;
  submissionStatus: string;
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

  return (
    <div>
      {/* Keyed on status alone: the documents response can omit signedCopyUrl
          (e.g. when presigning it fails), and treating that as "not submitted"
          put the upload button back as if the upload had been lost. */}
      {submissionStatus === 'uploaded' ? (
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="min-w-0 break-words text-[11px] font-medium text-amber-600">
            Signed copy submitted, awaiting review
          </span>
          <button
            type="button"
            onClick={openPicker}
            disabled={uploading}
            className="shrink-0 text-[11px] text-zinc-500 underline hover:text-zinc-700 disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : 'Replace'}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
        >
          {uploading ? 'Uploading…' : 'Upload Signed Copy'}
        </button>
      )}
      <p className="mt-1 text-[11px] text-zinc-500">PDF, DOC/DOCX, or a JPG/PNG photo, up to {MAX_MB} MB.</p>
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
