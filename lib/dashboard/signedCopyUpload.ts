// lib/dashboard/signedCopyUpload.ts
//
// Everything the agreement-letter (signed copy) upload needs to decide BEFORE a
// byte leaves the participant's phone, plus the limits the BFF route enforces.
//
// Participants were reporting "tidak bisa upload agreement letter" for reasons
// that all ended in either no outcome or an opaque one:
//
// - the picker only accepted .pdf/.doc/.docx, which on Android and iOS hides
//   the photo gallery entirely, although the file service has always accepted
//   JPEG and PNG. Most participants sign on paper and photograph the page.
// - a file over the 10 MB server limit travelled the whole way up before being
//   rejected, and above ~10 MB the Next middleware truncated the body, so the
//   participant got a bare 500 instead of "too large".
// - some Android pickers report an empty MIME type, which the file service then
//   rejected as "application/octet-stream not allowed".
//
// No 'use client' here on purpose: the BFF route imports the limits, and a
// server module importing from a client module is the RSC-boundary bug class
// the pre-push gate exists for. Nothing below touches the DOM at module scope.

import {
  HEIC_GUIDANCE_MESSAGE,
  MAX_UPLOAD_BYTES,
  isHeicFile,
  prepareImageForUpload,
} from '@/lib/media/prepareImageForUpload';

/**
 * Per-file ceiling. Same value as services/api MAX_FILE_SIZE (the multer limit
 * on POST /v1/portal/documents/:templateId/signed-copy) and services/file
 * UploadFileHandler.MAX_DOCUMENT_SIZE / MAX_IMAGE_SIZE. Reused rather than
 * restated so this repo has one copy of the number.
 */
export const SIGNED_COPY_MAX_FILE_BYTES = MAX_UPLOAD_BYTES;

/**
 * A multipart body is the file plus boundaries and part headers, a few hundred
 * bytes in practice. 64 KB of headroom keeps a file right at the limit from
 * being refused for its envelope, while still refusing anything genuinely
 * oversized before it is read.
 */
export const SIGNED_COPY_MULTIPART_OVERHEAD_BYTES = 64 * 1024;

/**
 * The largest request body the BFF route will read. next.config.js
 * experimental.proxyClientMaxBodySize MUST stay above this, or the middleware
 * truncates the body before the route sees it (pinned by a test).
 */
export const SIGNED_COPY_MAX_BODY_BYTES = SIGNED_COPY_MAX_FILE_BYTES + SIGNED_COPY_MULTIPART_OVERHEAD_BYTES;

const MAX_MB = Math.round(SIGNED_COPY_MAX_FILE_BYTES / (1024 * 1024));

const PDF = 'application/pdf';
const DOC = 'application/msword';
const DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const JPEG = 'image/jpeg';
const PNG = 'image/png';

const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: PDF,
  doc: DOC,
  docx: DOCX,
  jpg: JPEG,
  jpeg: JPEG,
  png: PNG,
};

const ALLOWED_MIME_TYPES = new Set(Object.values(MIME_BY_EXTENSION));

/**
 * Extensions AND MIME types. Mobile pickers key off MIME types (an image/* entry
 * is what makes the gallery and camera appear); desktop pickers key off
 * extensions. HEIC is deliberately not listed: when accept names only JPEG/PNG,
 * iOS transcodes a HEIC photo to JPEG on the way out of the picker.
 */
export const SIGNED_COPY_ACCEPT = [
  '.pdf',
  '.doc',
  '.docx',
  '.jpg',
  '.jpeg',
  '.png',
  PDF,
  DOC,
  DOCX,
  JPEG,
  PNG,
].join(',');

export const SIGNED_COPY_UNSUPPORTED_TYPE_MESSAGE =
  'This file type is not supported. Please upload a PDF, Word document (DOC/DOCX), or a JPG/PNG photo of the signed letter.';

export const SIGNED_COPY_TOO_LARGE_MESSAGE = `This file is larger than ${MAX_MB} MB, the upload limit. Please compress the PDF, or upload a photo of the signed letter instead.`;

export const SIGNED_COPY_INCOMPLETE_MESSAGE =
  'The upload did not arrive completely, so your file was not saved. Please check your connection and try again.';

export const SIGNED_COPY_TIMEOUT_MESSAGE =
  'Upload timed out. Your file was not saved. Please check your connection and try again.';

export const SIGNED_COPY_NETWORK_MESSAGE =
  'We could not reach the server, so your file was not saved. Please check your connection and try again.';

export class SignedCopyFileError extends Error {}

function extensionOf(name: string): string {
  const match = /\.([^./\\]+)$/.exec(name ?? '');
  return match ? match[1].toLowerCase() : '';
}

/**
 * The MIME type to send for a picked file, or null when it is not a type a
 * signed copy may be. A missing or generic type (empty, application/octet-
 * stream) is resolved from the extension, because that is what some Android
 * pickers and file managers hand us for a perfectly ordinary PDF.
 */
export function resolveSignedCopyMimeType(file: Pick<File, 'name' | 'type'>): string | null {
  const reported = (file.type ?? '').toLowerCase();
  if (ALLOWED_MIME_TYPES.has(reported)) return reported;
  if (reported === '' || reported === 'application/octet-stream') {
    return MIME_BY_EXTENSION[extensionOf(file.name)] ?? null;
  }
  return null;
}

/**
 * Validates a picked file and returns the File to actually upload.
 *
 * - HEIC (which reaches us from "Files"/Android pickers that skip iOS's
 *   transcode) is converted to JPEG where the browser can decode it, and
 *   otherwise rejected with the step-by-step guidance rather than being sent
 *   to a server that will refuse it.
 * - A JPEG/PNG photo over the limit is compressed rather than rejected: a
 *   modern phone photo of a page can exceed 10 MB, and asking a participant to
 *   shrink it themselves is where they give up.
 * - A PDF/DOC/DOCX over the limit cannot be shrunk here, so it gets a message
 *   saying what to do instead.
 * - A file with a missing type is re-labelled from its extension so every hop
 *   after this one sees the real type.
 *
 * Throws SignedCopyFileError with a participant-facing message.
 */
export async function prepareSignedCopyFile(file: File): Promise<File> {
  if (isHeicFile(file)) {
    try {
      return await prepareImageForUpload(file);
    } catch (err) {
      throw new SignedCopyFileError(err instanceof Error ? err.message : HEIC_GUIDANCE_MESSAGE);
    }
  }

  const mimeType = resolveSignedCopyMimeType(file);
  if (!mimeType) {
    throw new SignedCopyFileError(SIGNED_COPY_UNSUPPORTED_TYPE_MESSAGE);
  }

  if (file.size > SIGNED_COPY_MAX_FILE_BYTES) {
    if (mimeType === JPEG || mimeType === PNG) {
      try {
        return await prepareImageForUpload(file);
      } catch (err) {
        throw new SignedCopyFileError(err instanceof Error ? err.message : SIGNED_COPY_TOO_LARGE_MESSAGE);
      }
    }
    throw new SignedCopyFileError(SIGNED_COPY_TOO_LARGE_MESSAGE);
  }

  if (file.type === mimeType) return file;
  return new File([file], file.name, { type: mimeType, lastModified: file.lastModified });
}

/**
 * The message to show for a failed upload response. The server's own message
 * wins whenever it sent one (a file-service rejection names the actual
 * problem); this only fills in when the body was not our JSON envelope, e.g. a
 * reverse proxy's HTML 413 page or a crashed hop.
 */
export function signedCopyFailureFallback(status: number): string {
  if (status === 413) return SIGNED_COPY_TOO_LARGE_MESSAGE;
  if (status === 415) return SIGNED_COPY_UNSUPPORTED_TYPE_MESSAGE;
  if (status === 504 || status === 408) return SIGNED_COPY_TIMEOUT_MESSAGE;
  if (status === 401) return 'Your session has expired. Please refresh the page, log in again, and retry the upload.';
  return 'Upload failed and your file was not saved. Please try again.';
}
