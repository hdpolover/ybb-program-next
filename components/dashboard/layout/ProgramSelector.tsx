"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsProvider";
import { useEffect, useRef, useState } from "react";
import {
  ACTIVE_PROGRAM_STORAGE_KEY,
  announceActiveProgramChange,
} from "@/lib/dashboard/activeProgram";

type RegisteredProgram = {
  programId: string;
  programName: string;
  programSlug: string;
  year?: number;
};

function buildProgramLabel(programName: string, year?: number): string {
  const cleanedName = (programName || '').trim();
  if (!cleanedName) return 'Participant';

  const hasYearInName = typeof year === 'number' && cleanedName.includes(String(year));
  const nameWithYear = typeof year === 'number' && !hasYearInName
    ? `${cleanedName} ${year}`
    : cleanedName;

  return `${nameWithYear} Participant`;
}

export default function ProgramSelector({
  programs,
}: {
  programs?: RegisteredProgram[];
}) {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const ref = useRef<HTMLDivElement | null>(null);

  const normalizedPrograms = (programs ?? [])
    .filter(p => !!p?.programId)
    .map(p => ({
      id: p.programId,
      programName: p.programName,
      year: p.year,
      label: buildProgramLabel(p.programName, p.year),
      logo: settings?.brand?.logo_url || "/img/ybb-logo.png",
    }));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      window.addEventListener("mousedown", handleClickOutside);
    } else {
      window.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (normalizedPrograms.length === 0) {
      setActiveId('');
      return;
    }

    let stored = '';
    try {
      stored = window.localStorage.getItem(ACTIVE_PROGRAM_STORAGE_KEY) || '';
    } catch {
      // ignore
    }

    const exists = stored && normalizedPrograms.some(p => p.id === stored);
    const nextId = exists ? stored : normalizedPrograms[0]!.id;
    setActiveId(nextId);
  }, [normalizedPrograms]);

  useEffect(() => {
    if (!activeId) return;
    try {
      window.localStorage.setItem(ACTIVE_PROGRAM_STORAGE_KEY, activeId);
    } catch {
      // ignore
    }

    announceActiveProgramChange(activeId);
  }, [activeId]);

  const active = normalizedPrograms.find(p => p.id === activeId) ?? normalizedPrograms[0] ?? null;
  const defaultLabel = settings?.active_program?.name
    ? buildProgramLabel(settings.active_program.name, settings.active_program.year)
    : (settings?.brand?.name ? buildProgramLabel(settings.brand.name) : 'Participant');
  const displayedLabel = active?.label ?? defaultLabel;
  const displayedLogo = active?.logo ?? settings?.brand?.logo_url ?? '/img/ybb-logo.png';

  return (
    <div ref={ref} className="relative inline-block text-xs font-semibold tracking-wide">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="inline-flex max-w-[20rem] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 shadow-sm transition hover:border-primary/100 hover:text-primary"
      >
        <span className="relative h-6 w-6 overflow-hidden rounded-full bg-slate-100">
          <Image src={displayedLogo} alt={displayedLabel} fill className="object-contain" priority unoptimized />
        </span>
        <span className="truncate text-left normal-case">{displayedLabel}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 text-[11px] shadow-lg">
          {normalizedPrograms.length > 0 ? normalizedPrograms.map(program => (
            <button
              key={program.id}
              type="button"
              onClick={() => {
                setActiveId(program.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-50"
            >
              <span className="relative h-6 w-6 overflow-hidden rounded-full bg-slate-100">
                <Image src={program.logo} alt={program.label} fill className="object-contain" unoptimized />
              </span>
              <span className="normal-case">{program.label}</span>
            </button>
          )) : (
            <div className="px-3 py-2 text-left font-medium normal-case text-slate-500">{defaultLabel}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
