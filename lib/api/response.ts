export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

export function getEnvelopeData(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  return "data" in payload ? payload.data ?? null : payload;
}

export function getMessage(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  return typeof payload.message === "string" ? payload.message : null;
}

export function getErrorMessage(payload: unknown, fallback: string): string {
  return getMessage(payload) ?? fallback;
}