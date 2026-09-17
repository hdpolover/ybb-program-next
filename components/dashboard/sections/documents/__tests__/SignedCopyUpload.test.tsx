// components/dashboard/sections/documents/__tests__/SignedCopyUpload.test.tsx
//
// The participant-visible half of the agreement-letter upload fix: the picker
// offers photos, a failed attempt can be retried with the same file, an old
// WebView without AbortSignal.timeout can still upload, the server's reason is
// shown, and a submitted copy reads as submitted.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignedCopyUpload, {
  SIGNED_COPY_SUCCESS_MESSAGE,
} from '@/components/dashboard/sections/documents/SignedCopyUpload';

function pick(input: HTMLElement, file: File) {
  // jsdom's `files` is read-only; define it the way a real picker fills it.
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  // jsdom refuses to set a file input's value to anything but '', so back it
  // with a plain property: the assertion is that the component clears it.
  let value = 'C:\\fakepath\\' + file.name;
  Object.defineProperty(input, 'value', {
    configurable: true,
    get: () => value,
    set: (next: string) => {
      value = next;
    },
  });
  fireEvent.change(input);
}

function jsonResponse(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
}

describe('SignedCopyUpload', () => {
  const originalTimeout = AbortSignal.timeout;

  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    AbortSignal.timeout = originalTimeout;
  });

  it('offers photos in the picker, not only PDF/Word', () => {
    render(<SignedCopyUpload templateId="t1" submissionStatus="pending_upload" onUploaded={() => {}} />);
    const accept = screen.getByTestId('signed-copy-input').getAttribute('accept') ?? '';
    expect(accept).toContain('image/jpeg');
    expect(accept).toContain('image/png');
    expect(accept).toContain('application/pdf');
  });

  it('shows the submitted state from the status alone, even without a signed copy URL', () => {
    render(<SignedCopyUpload templateId="t1" submissionStatus="uploaded" onUploaded={() => {}} />);
    expect(screen.getByText(/submitted, awaiting review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Replace' })).toBeInTheDocument();
  });

  it('uploads on a WebView without AbortSignal.timeout and confirms success', async () => {
    // @ts-expect-error simulating an older WebView that lacks the API
    AbortSignal.timeout = undefined;
    const fetchSpy = vi.fn(async () => jsonResponse(200, { data: { success: true } }));
    vi.stubGlobal('fetch', fetchSpy);
    const onUploaded = vi.fn();

    render(<SignedCopyUpload templateId="t1" submissionStatus="pending_upload" onUploaded={onUploaded} />);
    pick(screen.getByTestId('signed-copy-input'), new File(['%PDF'], 'signed.pdf', { type: 'application/pdf' }));

    expect(await screen.findByText(SIGNED_COPY_SUCCESS_MESSAGE)).toBeInTheDocument();
    expect(onUploaded).toHaveBeenCalledTimes(1);
    const init = (fetchSpy.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("shows the server's own rejection reason", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse(400, { statusCode: 400, message: 'Application not found' })),
    );
    render(<SignedCopyUpload templateId="t1" submissionStatus="pending_upload" onUploaded={() => {}} />);
    pick(screen.getByTestId('signed-copy-input'), new File(['%PDF'], 'signed.pdf', { type: 'application/pdf' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Application not found');
  });

  it('refuses an oversized PDF before uploading, and resets the input so the same pick can be retried', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    render(<SignedCopyUpload templateId="t1" submissionStatus="pending_upload" onUploaded={() => {}} />);
    const input = screen.getByTestId('signed-copy-input') as HTMLInputElement;
    const big = new File(['%PDF'], 'big.pdf', { type: 'application/pdf' });
    Object.defineProperty(big, 'size', { value: 11 * 1024 * 1024 });

    pick(input, big);

    expect(await screen.findByRole('alert')).toHaveTextContent(/larger than 10 MB/);
    expect(fetchSpy).not.toHaveBeenCalled();
    await waitFor(() => expect(input.value).toBe(''));
  });

  it('resets the input after a failed upload too, so re-selecting the same file fires again', async () => {
    const fetchSpy = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(jsonResponse(200, { data: null }));
    vi.stubGlobal('fetch', fetchSpy);
    render(<SignedCopyUpload templateId="t1" submissionStatus="pending_upload" onUploaded={() => {}} />);
    const input = screen.getByTestId('signed-copy-input') as HTMLInputElement;
    const file = new File(['%PDF'], 'signed.pdf', { type: 'application/pdf' });

    pick(input, file);
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not reach the server/i);
    await waitFor(() => expect(input.value).toBe(''));

    pick(input, file);
    expect(await screen.findByText(SIGNED_COPY_SUCCESS_MESSAGE)).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});
