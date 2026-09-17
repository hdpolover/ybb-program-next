// lib/dashboard/__tests__/signedCopyUpload.test.ts
//
// Pins the client-side decisions for the agreement-letter upload: what the
// picker offers, which files leave the phone, and what the participant is told
// when one cannot. Each case is a shape the "tidak bisa upload agreement
// letter" reports took.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/media/prepareImageForUpload', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/media/prepareImageForUpload')>();
  return { ...actual, prepareImageForUpload: vi.fn() };
});

import { prepareImageForUpload, HEIC_GUIDANCE_MESSAGE, ImagePrepError } from '@/lib/media/prepareImageForUpload';
import {
  SIGNED_COPY_ACCEPT,
  SIGNED_COPY_MAX_BODY_BYTES,
  SIGNED_COPY_MAX_FILE_BYTES,
  SIGNED_COPY_TOO_LARGE_MESSAGE,
  SIGNED_COPY_UNSUPPORTED_TYPE_MESSAGE,
  SignedCopyFileError,
  prepareSignedCopyFile,
  resolveSignedCopyMimeType,
  signedCopyFailureFallback,
} from '@/lib/dashboard/signedCopyUpload';

const prepareImage = vi.mocked(prepareImageForUpload);

// A File whose reported size is `size` without allocating it: a real 11 MB
// buffer per case would make the suite slow for no extra coverage.
function makeFile(name: string, type: string, size = 1024): File {
  const file = new File([new Uint8Array(8)], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

beforeEach(() => {
  prepareImage.mockReset();
});

describe('SIGNED_COPY_ACCEPT', () => {
  it('offers photos as well as documents, so mobile pickers show the gallery and camera', () => {
    const accept = SIGNED_COPY_ACCEPT.split(',');
    for (const entry of ['image/jpeg', 'image/png', '.jpg', '.jpeg', '.png']) {
      expect(accept).toContain(entry);
    }
    for (const entry of ['application/pdf', '.pdf', '.doc', '.docx']) {
      expect(accept).toContain(entry);
    }
  });
});

describe('limits', () => {
  it('matches the 10 MB API/file-service limit and leaves room for the multipart envelope', () => {
    expect(SIGNED_COPY_MAX_FILE_BYTES).toBe(10 * 1024 * 1024);
    expect(SIGNED_COPY_MAX_BODY_BYTES).toBeGreaterThan(SIGNED_COPY_MAX_FILE_BYTES);
  });

  it('keeps next.config proxyClientMaxBodySize above the largest body the route accepts', async () => {
    // If this drifts below, the middleware truncates near-limit uploads again
    // and they fail as an unreadable body instead of succeeding.
    const nextConfig = (await import('../../../next.config.js')).default as {
      experimental?: { proxyClientMaxBodySize?: string | number };
    };
    const bytes = (await import('next/dist/compiled/bytes')).default as {
      parse: (v: string | number) => number;
    };
    const configured = nextConfig.experimental?.proxyClientMaxBodySize;
    expect(configured).toBeDefined();
    expect(bytes.parse(configured as string | number)).toBeGreaterThan(SIGNED_COPY_MAX_BODY_BYTES);
  });
});

describe('resolveSignedCopyMimeType', () => {
  it('keeps an allowed reported type', () => {
    expect(resolveSignedCopyMimeType({ name: 'x.pdf', type: 'application/pdf' })).toBe('application/pdf');
    expect(resolveSignedCopyMimeType({ name: 'x.jpg', type: 'image/jpeg' })).toBe('image/jpeg');
  });

  it('infers from the extension when the picker reported no type or a generic one', () => {
    expect(resolveSignedCopyMimeType({ name: 'Signed.PDF', type: '' })).toBe('application/pdf');
    expect(resolveSignedCopyMimeType({ name: 'scan.jpeg', type: 'application/octet-stream' })).toBe('image/jpeg');
    expect(resolveSignedCopyMimeType({ name: 'letter.docx', type: '' })).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });

  it('rejects types a signed copy cannot be, even with a friendly extension', () => {
    expect(resolveSignedCopyMimeType({ name: 'x.zip', type: 'application/zip' })).toBeNull();
    expect(resolveSignedCopyMimeType({ name: 'x.exe', type: '' })).toBeNull();
    expect(resolveSignedCopyMimeType({ name: 'noextension', type: '' })).toBeNull();
  });
});

describe('prepareSignedCopyFile', () => {
  it('passes an ordinary PDF through untouched', async () => {
    const file = makeFile('signed.pdf', 'application/pdf');
    await expect(prepareSignedCopyFile(file)).resolves.toBe(file);
    expect(prepareImage).not.toHaveBeenCalled();
  });

  it('passes a photo under the limit through without re-encoding it (legibility)', async () => {
    const file = makeFile('page.jpg', 'image/jpeg', 4 * 1024 * 1024);
    await expect(prepareSignedCopyFile(file)).resolves.toBe(file);
    expect(prepareImage).not.toHaveBeenCalled();
  });

  it('re-labels a typeless file from its extension so the server sees the real type', async () => {
    const out = await prepareSignedCopyFile(makeFile('signed.pdf', ''));
    expect(out.type).toBe('application/pdf');
    expect(out.name).toBe('signed.pdf');
  });

  it('rejects an unsupported type before uploading', async () => {
    await expect(prepareSignedCopyFile(makeFile('x.zip', 'application/zip'))).rejects.toThrow(
      SIGNED_COPY_UNSUPPORTED_TYPE_MESSAGE,
    );
  });

  it('rejects an oversized PDF with the limit in the message', async () => {
    const promise = prepareSignedCopyFile(makeFile('big.pdf', 'application/pdf', SIGNED_COPY_MAX_FILE_BYTES + 1));
    await expect(promise).rejects.toBeInstanceOf(SignedCopyFileError);
    await expect(promise).rejects.toThrow(SIGNED_COPY_TOO_LARGE_MESSAGE);
  });

  it('compresses an oversized photo instead of rejecting it', async () => {
    const compressed = makeFile('page.jpg', 'image/jpeg', 2 * 1024 * 1024);
    prepareImage.mockResolvedValue(compressed);
    const out = await prepareSignedCopyFile(makeFile('page.png', 'image/png', 14 * 1024 * 1024));
    expect(out).toBe(compressed);
  });

  it('converts HEIC via the shared image prep', async () => {
    const converted = makeFile('IMG_1.jpg', 'image/jpeg');
    prepareImage.mockResolvedValue(converted);
    await expect(prepareSignedCopyFile(makeFile('IMG_1.HEIC', ''))).resolves.toBe(converted);
  });

  it('gives the HEIC guidance when the browser cannot decode it', async () => {
    prepareImage.mockRejectedValue(new ImagePrepError(HEIC_GUIDANCE_MESSAGE));
    await expect(prepareSignedCopyFile(makeFile('IMG_1.heic', 'image/heic'))).rejects.toThrow(HEIC_GUIDANCE_MESSAGE);
  });
});

describe('signedCopyFailureFallback', () => {
  it('explains a 413 with no JSON body (e.g. a reverse proxy HTML page)', () => {
    expect(signedCopyFailureFallback(413)).toBe(SIGNED_COPY_TOO_LARGE_MESSAGE);
  });

  it('always says the file was not saved for a generic failure', () => {
    expect(signedCopyFailureFallback(500)).toMatch(/not saved/);
  });
});
