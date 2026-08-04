// lib/media/prepareImageForUpload.ts
//
// Client-side image prep before upload: downscales + re-encodes to JPEG via
// canvas so (a) HEIC photos from iPhones get a shot at working wherever the
// browser can actually decode HEIC (WebKit/Safari, including all iOS
// browsers, decode HEIC natively via the OS; Chrome/Firefox on desktop do
// not — there is no way to make HEIC decode work everywhere without a
// wasm/native decoder dependency), and (b) large phone photos get
// compressed before hitting the network, which also matters on slow mobile
// connections. Decode is attempted for every file regardless of its
// reported MIME type — HEIC's MIME type is unreliable across platforms
// (often reported empty) — and failure is handled honestly: we never
// silently ship the original oversized/undecoded file.

const MAX_DIMENSION_PX = 1600;
const JPEG_QUALITY = 0.85;
const JPEG_QUALITY_RETRY = 0.7;

// Reconciled with the server-side image cap (see services/file
// UploadFileHandler.MAX_IMAGE_SIZE / CreateUploadUrlHandler.MAX_IMAGE_SIZE and
// services/api MAX_FILE_SIZE) — keep these in sync.
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const HEIC_MIME_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const HEIC_EXTENSIONS = [".heic", ".heif"];

export const HEIC_GUIDANCE_MESSAGE =
  "This photo is in Apple's HEIC format, which this browser can't read. On your iPhone: Settings > Camera > Formats > choose \"Most Compatible\" (new photos then save as JPEG), then retake the photo and try again. Or open the photo, tap Share, and send it to yourself via Messages or Mail first, which usually converts it to JPEG automatically.";

export const UNREADABLE_IMAGE_MESSAGE =
  "We couldn't read this image file. Please try a JPEG, PNG, or WebP photo.";

export const NOT_AN_IMAGE_MESSAGE = "Please select an image file (JPEG, PNG, WebP, or HEIC).";

export const TOO_LARGE_AFTER_COMPRESSION_MESSAGE = `This photo is too large even after compression. Please choose a smaller image (under ${Math.round(
  MAX_UPLOAD_BYTES / (1024 * 1024),
)} MB).`;

export class ImagePrepError extends Error {}

export function isHeicFile(file: Pick<File, "name" | "type">): boolean {
  const type = (file.type ?? "").toLowerCase();
  if (HEIC_MIME_TYPES.has(type)) return true;
  const name = (file.name ?? "").toLowerCase();
  return HEIC_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export function looksLikeImageFile(file: Pick<File, "type">): boolean {
  // Some browser/OS combos (notably HEIC picked on non-Safari browsers)
  // report an empty MIME type. Treat "unknown" as "maybe an image" rather
  // than rejecting outright — the decode attempt below is the real check.
  return file.type === "" || file.type.startsWith("image/");
}

type DecodedImageSource = ImageBitmap | HTMLImageElement;

function hasCreateImageBitmap(): boolean {
  return typeof createImageBitmap === "function";
}

function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("image decode failed"));
    };
    img.src = objectUrl;
  });
}

async function decodeImage(file: File): Promise<DecodedImageSource> {
  if (hasCreateImageBitmap()) {
    try {
      return await createImageBitmap(file);
    } catch {
      // Some browsers only support createImageBitmap for a subset of
      // formats — fall through to the <img> element path before giving up.
    }
  }
  return loadImageElement(file);
}

function sourceDimensions(source: DecodedImageSource): { width: number; height: number } {
  if (source instanceof HTMLImageElement) {
    return { width: source.naturalWidth, height: source.naturalHeight };
  }
  return { width: source.width, height: source.height };
}

function scaledDimensions(width: number, height: number, maxDimension: number): { width: number; height: number } {
  const longEdge = Math.max(width, height);
  if (longEdge <= maxDimension) return { width, height };
  const scale = maxDimension / longEdge;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("canvas export failed"))),
      "image/jpeg",
      quality,
    );
  });
}

function jpegFilename(originalName: string): string {
  const base = originalName.replace(/\.[^./]+$/, "");
  return `${base || "photo"}.jpg`;
}

/**
 * Prepares a picked image for upload: decodes it, downscales it to
 * MAX_DIMENSION_PX on the long edge, and re-encodes it as JPEG.
 *
 * Throws ImagePrepError with a user-facing, actionable message when the file
 * isn't an image, or when the browser genuinely cannot decode it (most
 * commonly: HEIC on a non-WebKit browser, which ships no HEIC codec).
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (!looksLikeImageFile(file)) {
    throw new ImagePrepError(NOT_AN_IMAGE_MESSAGE);
  }

  // GIFs pass through unconverted: canvas would flatten any animation to a
  // single frame, and GIF isn't a phone-camera format this bug is about.
  if (file.type === "image/gif") {
    return file;
  }

  let source: DecodedImageSource;
  try {
    source = await decodeImage(file);
  } catch {
    throw new ImagePrepError(isHeicFile(file) ? HEIC_GUIDANCE_MESSAGE : UNREADABLE_IMAGE_MESSAGE);
  }

  const { width, height } = sourceDimensions(source);
  if (!width || !height) {
    throw new ImagePrepError(isHeicFile(file) ? HEIC_GUIDANCE_MESSAGE : UNREADABLE_IMAGE_MESSAGE);
  }

  const target = scaledDimensions(width, height, MAX_DIMENSION_PX);
  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ImagePrepError(UNREADABLE_IMAGE_MESSAGE);
  }
  ctx.drawImage(source as CanvasImageSource, 0, 0, target.width, target.height);

  if ("close" in source && typeof source.close === "function") {
    source.close();
  }

  let blob = await canvasToJpegBlob(canvas, JPEG_QUALITY);
  if (blob.size > MAX_UPLOAD_BYTES) {
    blob = await canvasToJpegBlob(canvas, JPEG_QUALITY_RETRY);
  }
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new ImagePrepError(TOO_LARGE_AFTER_COMPRESSION_MESSAGE);
  }

  return new File([blob], jpegFilename(file.name), { type: "image/jpeg" });
}
