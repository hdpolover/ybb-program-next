"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useSettings } from "@/components/providers/SettingsProvider";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ACTIVE_PROGRAM_CHANGED_EVENT,
  chooseActiveProgramId,
  readActiveProgramId,
  resolveActiveProgramId,
  syncActiveProgramId,
} from "@/lib/dashboard/activeProgram";

type RegisteredProgram = {
  programId: string;
  programName: string;
  programSlug: string;
  year?: number;
  // Carried through purely so resolveActiveProgramId ranks the same way here as
  // it does for the sibling fetches. Dropping it made the header show one
  // edition while the data calls used another.
  applicationStatus?: string;
};

function buildProgramLabel(programName: string, year?: number): string {
  const cleanedName = (programName || '').trim();
  if (!cleanedName) return 'My Program';

  const hasYearInName = typeof year === 'number' && cleanedName.includes(String(year));
  return typeof year === 'number' && !hasYearInName
    ? `${cleanedName} ${year}`
    : cleanedName;
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

  const brandLogo = settings?.brand?.logo_url;
  const activeProgramLogo = settings?.active_program?.logo_url;

  // Memoized because the resolve effect below depends on it. Rebuilt on every
  // render, it re-ran that effect on every render, which re-read storage and
  // reset activeId underneath a click: the old separate "write activeId to
  // storage" effect then synced the clicked program, the resolve effect synced
  // it back, and each bounce fired ACTIVE_PROGRAM_CHANGED_EVENT. Every listener
  // refetched on every bounce - the 429s and flicker participants reported as
  // "switching to 2026 errors".
  const normalizedPrograms = useMemo(
    () =>
      (programs ?? [])
        .filter(p => !!p?.programId)
        .map(p => ({
          id: p.programId,
          programName: p.programName,
          year: p.year,
          applicationStatus: p.applicationStatus,
          label: buildProgramLabel(p.programName, p.year),
          logo: brandLogo || activeProgramLogo || "/img/ybb-logo.png",
        })),
    [programs, brandLogo, activeProgramLogo],
  );

  // Resolution depends only on which programs exist and their statuses, not on
  // labels or logos, so a settings refresh must not re-run it.
  const programsKey = normalizedPrograms
    .map(p => `${p.id}:${p.applicationStatus ?? ''}`)
    .join('|');

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

  const programsRef = useRef(normalizedPrograms);
  useEffect(() => {
    programsRef.current = normalizedPrograms;
  }, [normalizedPrograms]);

  useEffect(() => {
    const currentPrograms = programsRef.current;
    if (currentPrograms.length === 0) {
      setActiveId('');
      return;
    }

    const nextId = resolveActiveProgramId(currentPrograms, readActiveProgramId());
    setActiveId(nextId ?? '');
    // Persist the resolver's answer. When it overrode the stored id (a phantom
    // draft pinned by a pre-fix login), this is what writes the correction back
    // so every raw readActiveProgramId() caller fetches the same program. A
    // no-op, with no event, when nothing changed.
    if (nextId) syncActiveProgramId(nextId);
  }, [programsKey]);

  // Follow selections made elsewhere (another section syncing its program).
  // State only: re-syncing from a listener is exactly the ping-pong above.
  useEffect(() => {
    const handleChange = () => {
      const currentPrograms = programsRef.current;
      if (currentPrograms.length === 0) return;
      setActiveId(resolveActiveProgramId(currentPrograms, readActiveProgramId()) ?? '');
    };

    window.addEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(ACTIVE_PROGRAM_CHANGED_EVENT, handleChange);
  }, []);

  const active = normalizedPrograms.find(p => p.id === activeId) ?? normalizedPrograms[0] ?? null;
  const defaultLabel = settings?.active_program?.name
    ? buildProgramLabel(settings.active_program.name, settings.active_program.year)
    : (settings?.brand?.name ? buildProgramLabel(settings.brand.name) : 'My Program');
  const displayedLabel = active?.label ?? defaultLabel;
  const displayedLogo = active?.logo ?? settings?.brand?.logo_url ?? settings?.active_program?.logo_url ?? '/img/ybb-logo.png';

  return (
    <div ref={ref} className="relative inline-block max-w-full text-xs font-semibold tracking-wide">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="inline-flex max-w-[10rem] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 shadow-sm transition hover:border-primary/100 hover:text-primary sm:max-w-[20rem]"
      >
        <span className="relative h-6 w-6 overflow-hidden rounded-full bg-slate-100">
          <Image src={displayedLogo} alt={displayedLabel} fill className="object-contain" priority unoptimized />
        </span>
        <span className="min-w-0 truncate text-left normal-case">{displayedLabel}</span>
        <ChevronDown
          className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 text-[11px] shadow-lg">
          {normalizedPrograms.length > 0 ? normalizedPrograms.map(program => (
            <button
              key={program.id}
              type="button"
              onClick={() => {
                // Persist + announce here, once, rather than from an effect on
                // activeId, so exactly one change event fires per click.
                chooseActiveProgramId(program.id);
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
