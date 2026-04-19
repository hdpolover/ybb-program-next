"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Country } from "country-state-city";
import { componentsTheme } from "@/lib/theme/components";

const submissionTheme = componentsTheme.dashboardSubmission;

interface CountryFieldProps {
  value: string; // ISO alpha-2 code, e.g. "ID"
  onChange: (code: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
}

type CountryOption = {
  code: string;
  name: string;
  flag: string;
};

export function CountryField({
  value,
  onChange,
  placeholder,
  hasError,
  disabled,
}: CountryFieldProps) {
  const countries: CountryOption[] = useMemo(
    () =>
      Country.getAllCountries().map(c => ({
        code: c.isoCode,
        name: c.name,
        flag: c.flag ?? "",
      })),
    [],
  );
  const selected = countries.find(c => c.code === value) ?? null;

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      c =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q),
    );
  }, [countries, query]);

  const inputClass = `${submissionTheme.editInputBase}${
    hasError ? " border-red-500 focus:border-red-500 focus:ring-red-200" : ""
  } flex items-center justify-between cursor-pointer ${
    disabled ? "opacity-60 cursor-not-allowed" : ""
  }`;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={inputClass}
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <span aria-hidden>{selected.flag}</span>
              <span className="truncate">{selected.name}</span>
              <span className="ml-1 text-xs text-slate-400">
                ({selected.code})
              </span>
            </>
          ) : (
            <span className="text-slate-400">
              {placeholder || "Select a country"}
            </span>
          )}
        </span>
        <span className="ml-2 text-slate-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-300 bg-white shadow-lg">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search countries…"
            className="w-full rounded-t-lg border-b border-slate-200 px-3 py-2 text-sm focus:outline-none"
          />
          <ul className="max-h-60 overflow-y-auto py-1 text-sm">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-slate-400">No matches</li>
            )}
            {filtered.map(c => (
              <li
                key={c.code}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setQuery("");
                }}
                className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-slate-100 ${
                  c.code === value ? "bg-slate-50 font-semibold" : ""
                }`}
              >
                <span aria-hidden>{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-xs text-slate-400">{c.code}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
