import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  prepareImageForUpload,
  isHeicFile,
  looksLikeImageFile,
  ImagePrepError,
  HEIC_GUIDANCE_MESSAGE,
  UNREADABLE_IMAGE_MESSAGE,
  NOT_AN_IMAGE_MESSAGE,
  MAX_UPLOAD_BYTES,
} from "../prepareImageForUpload";

function makeFile(name: string, type: string, size = 1024): File {
  const bytes = new Uint8Array(size);
  return new File([bytes], name, { type });
}

// jsdom doesn't implement createImageBitmap or URL.createObjectURL/revokeObjectURL,
// so tests stub them per-case. The stubbed value varies between `undefined` and a
// vi.fn() mock with a test-specific signature, so the mutable slot itself is typed
// `unknown` rather than the real (much stricter) DOM signature — the real type is
// not what's being represented here, a test double is.
type GlobalThisWithImageBitmapStub = typeof globalThis & { createImageBitmap: unknown };
type UrlStaticWithObjectUrlStubs = typeof URL & {
  createObjectURL: unknown;
  revokeObjectURL: unknown;
};

describe("isHeicFile", () => {
  it("detects by MIME type", () => {
    expect(isHeicFile({ name: "photo.jpg", type: "image/heic" })).toBe(true);
    expect(isHeicFile({ name: "photo.jpg", type: "image/heif" })).toBe(true);
  });

  it("detects by file extension when MIME type is empty (common for HEIC)", () => {
    expect(isHeicFile({ name: "IMG_1234.HEIC", type: "" })).toBe(true);
    expect(isHeicFile({ name: "IMG_1234.heif", type: "" })).toBe(true);
  });

  it("returns false for ordinary image types", () => {
    expect(isHeicFile({ name: "photo.jpg", type: "image/jpeg" })).toBe(false);
    expect(isHeicFile({ name: "photo.png", type: "image/png" })).toBe(false);
  });
});

describe("looksLikeImageFile", () => {
  it("accepts image/* MIME types", () => {
    expect(looksLikeImageFile({ type: "image/jpeg" })).toBe(true);
  });

  it("accepts an empty MIME type (HEIC on some platforms)", () => {
    expect(looksLikeImageFile({ type: "" })).toBe(true);
  });

  it("rejects non-image MIME types", () => {
    expect(looksLikeImageFile({ type: "application/pdf" })).toBe(false);
    expect(looksLikeImageFile({ type: "text/plain" })).toBe(false);
  });
});

describe("prepareImageForUpload", () => {
  let getContextSpy: ReturnType<typeof vi.spyOn>;
  let toBlobSpy: ReturnType<typeof vi.spyOn>;
  let drawImageMock: ReturnType<typeof vi.fn>;
  let blobSizeToReturn: number;

  beforeEach(() => {
    drawImageMock = vi.fn();
    blobSizeToReturn = 2048;

    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockImplementation(() => ({ drawImage: drawImageMock }) as unknown as CanvasRenderingContext2D);

    toBlobSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "toBlob")
      .mockImplementation(function (this: HTMLCanvasElement, callback: BlobCallback) {
        callback(new Blob([new Uint8Array(blobSizeToReturn)], { type: "image/jpeg" }));
      });

    // jsdom doesn't implement createImageBitmap or URL.createObjectURL; stub
    // both. createImageBitmap is set per-test; createObjectURL is only
    // exercised by the <img> fallback path but is harmless to stub globally.
    (globalThis as GlobalThisWithImageBitmapStub).createImageBitmap = undefined;
    (URL as UrlStaticWithObjectUrlStubs).createObjectURL = vi.fn(() => "blob:mock-url");
    (URL as UrlStaticWithObjectUrlStubs).revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    getContextSpy.mockRestore();
    toBlobSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it("rejects a non-image file with a specific message", async () => {
    const file = makeFile("resume.pdf", "application/pdf");

    await expect(prepareImageForUpload(file)).rejects.toThrow(ImagePrepError);
    await expect(prepareImageForUpload(file)).rejects.toThrow(NOT_AN_IMAGE_MESSAGE);
  });

  it("passes GIFs through unconverted", async () => {
    const file = makeFile("meme.gif", "image/gif", 500);

    const result = await prepareImageForUpload(file);

    expect(result).toBe(file);
    expect(getContextSpy).not.toHaveBeenCalled();
  });

  it("decodes via createImageBitmap when available, downscales, and re-encodes as JPEG", async () => {
    const closeMock = vi.fn();
    (globalThis as GlobalThisWithImageBitmapStub).createImageBitmap = vi.fn().mockResolvedValue({
      width: 4000,
      height: 3000,
      close: closeMock,
    });

    const file = makeFile("IMG_1234.jpg", "image/jpeg", 9 * 1024 * 1024);
    const result = await prepareImageForUpload(file);

    expect(result.type).toBe("image/jpeg");
    expect(result.name).toBe("IMG_1234.jpg");
    expect(drawImageMock).toHaveBeenCalledWith(expect.anything(), 0, 0, 1600, 1200); // 4000x3000 -> long edge 1600
    expect(closeMock).toHaveBeenCalled();
  });

  it("does not upscale images already under the max dimension", async () => {
    (globalThis as GlobalThisWithImageBitmapStub).createImageBitmap = vi.fn().mockResolvedValue({
      width: 800,
      height: 600,
      close: vi.fn(),
    });

    await prepareImageForUpload(makeFile("small.jpg", "image/jpeg"));

    expect(drawImageMock).toHaveBeenCalledWith(expect.anything(), 0, 0, 800, 600);
  });

  it("retries at a lower JPEG quality if the first export is still over the size cap, and throws if still too big", async () => {
    (globalThis as GlobalThisWithImageBitmapStub).createImageBitmap = vi.fn().mockResolvedValue({ width: 100, height: 100, close: vi.fn() });
    blobSizeToReturn = MAX_UPLOAD_BYTES + 1;

    await expect(prepareImageForUpload(makeFile("huge.jpg", "image/jpeg"))).rejects.toThrow(ImagePrepError);
    expect(toBlobSpy).toHaveBeenCalledTimes(2); // full quality, then the retry pass
  });

  // jsdom implements neither createImageBitmap nor real <img> decoding, so the
  // <img> fallback path is stubbed with a minimal fake that fires onerror —
  // this exercises "the browser genuinely cannot decode this file" for both
  // paths (createImageBitmap throws, then the <img> fallback also fails).
  class FailingImage {
    onload: (() => void) | null = null;
    onerror: ((ev?: unknown) => void) | null = null;
    set src(_value: string) {
      queueMicrotask(() => this.onerror?.());
    }
  }

  it("throws the HEIC-specific guidance message when a HEIC file can't be decoded", async () => {
    (globalThis as GlobalThisWithImageBitmapStub).createImageBitmap = vi.fn().mockRejectedValue(new Error("not supported"));
    vi.stubGlobal("Image", FailingImage);

    const file = makeFile("IMG_5678.HEIC", "image/heic");

    await expect(prepareImageForUpload(file)).rejects.toThrow(ImagePrepError);
    await expect(prepareImageForUpload(file)).rejects.toThrow(HEIC_GUIDANCE_MESSAGE);
  });

  it("throws a generic unreadable-image message for a non-HEIC file that fails to decode", async () => {
    (globalThis as GlobalThisWithImageBitmapStub).createImageBitmap = vi.fn().mockRejectedValue(new Error("not supported"));
    vi.stubGlobal("Image", FailingImage);

    const file = makeFile("corrupt.jpg", "image/jpeg");

    await expect(prepareImageForUpload(file)).rejects.toThrow(ImagePrepError);
    await expect(prepareImageForUpload(file)).rejects.toThrow(UNREADABLE_IMAGE_MESSAGE);
  });
});
