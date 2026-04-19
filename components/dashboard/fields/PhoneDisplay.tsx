"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js";

interface Props {
  value: string;
}

export function PhoneDisplay({ value }: Props) {
  if (!value) return <span className="text-slate-400">—</span>;
  try {
    const parsed = parsePhoneNumberFromString(value);
    if (parsed) return <span>{parsed.formatInternational()}</span>;
  } catch {
    /* fall through */
  }
  return <span>{value}</span>;
}
