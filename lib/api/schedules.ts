// lib/api/schedules.ts
//
// Client-side fetch of a programme's day-by-day schedule for the home page
// events calendar. This is NOT in the home payload (it can run to hundreds of
// rows across a multi-week programme), so it is pulled on demand when the
// calendar panel opens, from the existing public route (GET /programs/:id/
// schedules, see program-schedule.controller.ts) rather than a new endpoint.
//
// Fetched via the same-origin `/api/proxy/*` catch-all the app already uses
// for other client-side calls to the API (see app/api/proxy/[...path]/route.ts),
// NOT through lib/api/httpClient's apiGet: that helper's client branch expects
// a caller-supplied `/v1/...` path and then prefixes `/v1/` again inside the
// proxy route, which would double it up. Every existing apiGet call in this
// repo runs server-side only, so that double-prefix bug has never fired.
export type ProgramScheduleItem = {
  id: string;
  day: string;
  startTime?: string;
  endTime?: string;
  activity: string;
  description?: string;
  location?: string;
  speaker?: string;
};

export async function fetchProgramSchedules(programId: string): Promise<ProgramScheduleItem[]> {
  const res = await fetch(`/api/proxy/programs/${encodeURIComponent(programId)}/schedules`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to load program schedule (${res.status})`);
  }
  return (await res.json()) as ProgramScheduleItem[];
}
