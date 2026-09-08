// lib/api/__tests__/schedules.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchProgramSchedules } from '@/lib/api/schedules';

const ROW = {
  id: '38d45245-4579-4f17-b013-e75a4ab498e5',
  day: '2026-11-09',
  startTime: '09:00',
  endTime: '12:00',
  activity: 'Day 1: Airport Assistance',
};

function mockJson(body: unknown, ok = true, status = 200) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  }) as unknown as typeof fetch;
}

describe('fetchProgramSchedules', () => {
  afterEach(() => vi.restoreAllMocks());

  // The shape production actually returns. The global transform interceptor
  // wraps every controller response in {statusCode, message, data}, so the
  // declared controller type is NOT what reaches the browser. This function
  // used to cast the whole envelope to an array, which type-checked (it was an
  // `as`, not a validation) and then threw "schedules.forEach is not a
  // function" inside the calendar's useMemo — crashing the panel on open.
  it('unwraps the {statusCode, message, data} envelope the API really sends', async () => {
    mockJson({ statusCode: 200, message: 'Success', data: [ROW] });
    await expect(fetchProgramSchedules('p1')).resolves.toEqual([ROW]);
  });

  it('still accepts a bare array, so the client survives the envelope going away', async () => {
    mockJson([ROW]);
    await expect(fetchProgramSchedules('p1')).resolves.toEqual([ROW]);
  });

  // Anything that is not a list of rows must degrade to "no schedule", never
  // to a value the caller will call .forEach on.
  it('returns an empty list for any non-array payload rather than a landmine', async () => {
    for (const body of [{ statusCode: 200, data: null }, { data: { nope: true } }, null, 'text']) {
      mockJson(body);
      await expect(fetchProgramSchedules('p1')).resolves.toEqual([]);
    }
  });

  it('throws on a non-ok response so the caller can show its error state', async () => {
    mockJson({}, false, 502);
    await expect(fetchProgramSchedules('p1')).rejects.toThrow('502');
  });
});
