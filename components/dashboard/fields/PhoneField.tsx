"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Country } from "country-state-city";
import {
  parsePhoneNumberFromString,
  getCountryCallingCode,
  isSupportedCountry,
  type CountryCode,
} from "libphonenumber-js";
import { componentsTheme } from "@/lib/theme/components";

const submissionTheme = componentsTheme.dashboardSubmission;

interface PhoneFieldProps {
  value: string; // E.164 string, e.g. "+6281234567890"
  onChange: (e164: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

type CountryChoice = {
  code: CountryCode;
  name: string;
  flag: string;
  dial: string; // e.g. "+62"
};

const DEFAULT_COUNTRY: CountryCode = "ID";

function allCountries(): CountryChoice[] {
  return Country.getAllCountries()
    .filter(c => isSupportedCountry(c.isoCode as CountryCode))
    .map(c => {
      const code = c.isoCode as CountryCode;
      let dial = "";
      try {
        dial = `+${getCountryCallingCode(code)}`;
      } catch {
        dial = "";
      }
      return { code, name: c.name, flag: c.flag ?? "", dial };
    })
    .filter(c => c.dial.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function PhoneField({
  value,
  onChange,
  hasError,
  disabled,
}: PhoneFieldProps) {
  const countries = useMemo(() => allCountries(), []);

  // Parse incoming value once on mount / when external changes happen.
  const parsed = useMemo(() => {
    if (!value) return null;
    try {
      return parsePhoneNumberFromString(value) ?? null;
    } catch {
      return null;
    }
  }, [value]);

  const initialCountry: CountryCode = parsed?.country ?? DEFAULT_COUNTRY;
  const initialNumber: string = parsed?.nationalNumber?.toString() ?? "";

  const [country, setCountry] = useState<CountryCode>(initialCountry);
  const [number, setNumber] = useState<string>(initialNumber);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickAway(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickAway);
    return () => document.removeEventListener("mousedown", onClickAway);
  }, [open]);

  function emit(nextCountry: CountryCode, nextNumber: string) {
    const digits = nextNumber.replace(/\D+/g, "");
    if (!digits) {
      onChange("");
      return;
    }
    try {
      const dial = getCountryCallingCode(nextCountry);
      onChange(`+${dial}${digits}`);
    } catch {
      onChange(nextNumber);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [countries, query]);

  const selected = countries.find(c => c.code === country);

  const outerClass = `${submissionTheme.editInputBase}${
    hasError ? " border-red-500 focus:border-red-500 focus:ring-red-200" : ""
  } flex items-stretch gap-0 p-0 overflow-hidden`;

  return (
    <div className={outerClass}>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          className={`flex h-full items-center gap-1.5 border-r border-slate-300 px-2 text-sm hover:bg-slate-50 ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          }`}
          onClick={() => !disabled && setOpen(v => !v)}
          disabled={disabled}
        >
          <span aria-hidden>{selected?.flag ?? "🏳️"}</span>
          <span className="font-mono text-xs text-slate-600">
            {selected?.dial ?? "+?"}
          </span>
          <span className="text-slate-400">▾</span>
        </button>
        {open && (
          <div className="absolute z-20 mt-1 w-72 rounded-lg border border-slate-300 bg-white shadow-lg">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search country or dial code…"
              className="w-full rounded-t-lg border-b border-slate-200 px-3 py-2 text-sm focus:outline-none"
            />
            <ul className="max-h-60 overflow-y-auto py-1 text-sm">
              {filtered.map(c => (
                <li
                  key={c.code}
                  onClick={() => {
                    setCountry(c.code);
                    emit(c.code, number);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-slate-100 ${
                    c.code === country ? "bg-slate-50 font-semibold" : ""
                  }`}
                >
                  <span aria-hidden>{c.flag}</span>
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="font-mono text-xs text-slate-500">
                    {c.dial}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <input
        type="tel"
        inputMode="tel"
        value={number}
        disabled={disabled}
        onChange={e => {
          const next = e.target.value.replace(/[^\d\s()-]/g, "");
          setNumber(next);
          emit(country, next);
        }}
        className="flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
        placeholder="812 3456 7890"
      />
    </div>
  );
}
