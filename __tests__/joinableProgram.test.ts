// __tests__/joinableProgram.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const fetchAuthContext = vi.fn();
const getProgramDetail = vi.fn();
vi.mock('@/lib/api/authContext', () => ({ fetchAuthContext: (d: string) => fetchAuthContext(d) }));
vi.mock('@/lib/api/programs', () => ({ getProgramDetail: (s: string, h: string) => getProgramDetail(s, h) }));

import { resolveJoinableProgram } from '@/lib/server/joinableProgram';

const openProgram = {
  id: 'p5',
  name: 'Japan Youth Summit 5th',
  isPublished: true,
  isActive: true,
  allowRegistration: true,
  registrationOpenDate: null,
  registrationCloseDate: null,
};

describe('resolveJoinableProgram', () => {
  beforeEach(() => {
    fetchAuthContext.mockReset().mockResolvedValue({ programId: 'p5', programSlug: 'jys-5th' });
    getProgramDetail.mockReset().mockResolvedValue(openProgram);
  });

  it('returns the open edition the participant has no application on', async () => {
    expect(await resolveJoinableProgram('d', ['old'])).toEqual({ id: 'p5', name: 'Japan Youth Summit 5th' });
  });

  it('returns null when the participant already has an application on it', async () => {
    expect(await resolveJoinableProgram('d', ['p5'])).toBeNull();
    expect(getProgramDetail).not.toHaveBeenCalled();
  });

  it('returns null when allowRegistration is off, even inside the dates', async () => {
    getProgramDetail.mockResolvedValue({ ...openProgram, allowRegistration: false });
    expect(await resolveJoinableProgram('d', [])).toBeNull();
  });

  it('returns null when the window is closed or upcoming', async () => {
    getProgramDetail.mockResolvedValue({ ...openProgram, registrationCloseDate: '2020-01-01T00:00:00Z' });
    expect(await resolveJoinableProgram('d', [])).toBeNull();
    getProgramDetail.mockResolvedValue({ ...openProgram, registrationOpenDate: '2999-01-01T00:00:00Z' });
    expect(await resolveJoinableProgram('d', [])).toBeNull();
  });

  it('returns null when the brand has no auth-context program', async () => {
    fetchAuthContext.mockResolvedValue({ programId: null, programSlug: null });
    expect(await resolveJoinableProgram('d', [])).toBeNull();
  });

  it('swallows backend errors', async () => {
    fetchAuthContext.mockRejectedValue(new Error('down'));
    expect(await resolveJoinableProgram('d', [])).toBeNull();
  });
});
