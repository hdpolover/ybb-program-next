export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

export function getEnvelopeData(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  return "data" in payload ? payload.data ?? null : payload;
}

export function getMessage(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  const { message } = payload;
  if (typeof message === "string") return message;
  // class-validator (Nest's ValidationPipe) returns `message` as a string[]
  // when multiple constraints fail — join them instead of discarding them.
  if (Array.isArray(message) && message.length > 0 && message.every((item) => typeof item === "string")) {
    return message.join("; ");
  }
  return null;
}

export function getErrorMessage(payload: unknown, fallback: string): string {
  return getMessage(payload) ?? fallback;
}