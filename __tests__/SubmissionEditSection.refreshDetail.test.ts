// __tests__/SubmissionEditSection.refreshDetail.test.ts
//
// Unit coverage for fetchLatestSubmissionDetail, the best-effort detail
// refresh used after a section save and after a rejected submit. It must never
// throw: both callers have already reported their own outcome to the user.

import { afterEach, describe, it, expect, vi } from 'vitest';
import { fetchLatestSubmissionDetail } from '@/components/dashboard/sections/SubmissionEditSection';

const detailEnvelope = (enabled: boolean, reason?: string) => ({
  success: true,
  data: {
    applicationId: 'app-1',
    programId: 'program-1',
    programName: 'Example Summit',
    status: 'draft',
    overallProgress: 50,
    sections: [],
    essays: [],
    requirements: [],
    preview: {
      title: 'Preview & Confirmation',
      description: '',
      checklists: [],
      primaryAction: { type: 'submit_application', label: 'Submit Application', enabled, reason },
    },
  },
});

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('fetchLatestSubmissionDetail', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the parsed detail, uncached and scoped to the selected program', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse(detailEnvelope(false, 'Complete Personal Details')));

    const detail = await fetchLatestSubmissionDetail('program-1');

    expect(detail?.previewPrimaryAction?.enabled).toBe(false);
    expect(detail?.previewPrimaryAction?.reason).toBe('Complete Personal Details');
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/api/portal/submissions/detail');
    expect(String(url)).toContain('program-1');
    expect(init?.cache).toBe('no-store');
  });

  it('returns null when the detail request is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ message: 'nope' }, 500));

    expect(await fetchLatestSubmissionDetail('program-1')).toBeNull();
  });

  it('returns null instead of throwing when the network fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(fetchLatestSubmissionDetail('program-1')).resolves.toBeNull();
  });
});
