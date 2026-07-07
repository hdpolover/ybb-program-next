// lib/phone.ts
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

export type SanitizedPhone = {
  /** E.164 value when parsing succeeds, otherwise the original input untouched. */
  value: string;
  isValid: boolean;
};

/**
 * Parse + normalize a phone number the same way the backend does on save:
 * parse with `regionHint` (e.g. nationality ISO alpha-2) as the region, and
 * if valid, return the E.164 form. Never fabricates a value — on failure the
 * original (trimmed) input is returned unchanged so nothing is silently lost.
 */
export function sanitizePhone(raw?: string, regionHint?: string): SanitizedPhone {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return { value: "", isValid: false };

  const region = regionHint?.trim().toUpperCase();

  try {
    const parsed = trimmed.startsWith("+")
      ? parsePhoneNumberFromString(trimmed)
      : parsePhoneNumberFromString(trimmed, region as CountryCode | undefined);

    if (parsed?.isValid()) {
      return { value: parsed.number, isValid: true };
    }
  } catch {
    // Fall through to the "keep as entered" branch below.
  }

  return { value: raw ?? "", isValid: false };
}

/** Convenience wrapper — true when the number parses as valid for the given region hint. */
export function isValidPhone(raw?: string, regionHint?: string): boolean {
  return sanitizePhone(raw, regionHint).isValid;
}
