"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js";

interface Props {
  value: string;
}

export function PhoneDisplay({ value }: Props) {
  if (!value) return <span className="text-slate-400">—</span>;

  let formatted: string | null = null;
  try {
    const parsed = parsePhoneNumberFromString(value);
    if (parsed) formatted = parsed.formatInternational();
  } catch {
    /* fall through */
  }

  return <span>{formatted ?? value}</span>;
}
