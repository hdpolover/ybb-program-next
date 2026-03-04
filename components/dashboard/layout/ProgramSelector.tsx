"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RegisteredProgram = {
  programId: string;
  programName: string;
  programSlug: string;
  year?: number;
};

function abbreviateProgramName(name: string): string {
  const cleaned = (name || '').trim();
  if (!cleaned) return '';

  const tokens = cleaned
    .split(/\s+/)
    .map(t => t.replace(/[^A-Za-z]/g, ''))
    .filter(Boolean);

  if (tokens.length === 0) return '';

  return tokens
    .slice(0, 4)
    .map(t => t[0]!.toUpperCase())
    .join('');
}

export default function ProgramSelector({
  programs,
}: {
  programs?: RegisteredProgram[];
}) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const ref = useRef<HTMLDivElement | null>(null);

  const normalizedPrograms = (programs ?? [])
    .filter(p => !!p?.programId)
    .map(p => ({
      id: p.programId,
      programName: p.programName,
      year: p.year,
      label: `${abbreviateProgramName(p.programName)}${p.year ? ` ${p.year}` : ''} Participant`.trim(),
      logo: "/img/jysfix.png",
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
      stored = window.localStorage.getItem('ybb_active_program_id') || '';
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
      window.localStorage.setItem('ybb_active_program_id', activeId);
    } catch {
      // ignore
    }
  }, [activeId]);

  const active = normalizedPrograms.find(p => p.id === activeId) ?? normalizedPrograms[0] ?? null;
  const displayedLabel = active?.label ?? 'Participant';
  const displayedLogo = active?.logo ?? '/img/jysfix.png';

  return (
    <div ref={ref} className="relative inline-block text-xs font-semibold uppercase tracking-wide">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 shadow-sm transition hover:border-primary/100 hover:text-primary"
      >
        <span className="relative h-6 w-6 overflow-hidden rounded-full bg-slate-100">
          <Image src={displayedLogo} alt={displayedLabel} fill className="object-contain" />
        </span>
        <span>{displayedLabel}</span>
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
                <Image src={program.logo} alt={program.label} fill className="object-contain" />
              </span>
              <span>{program.label}</span>
            </button>
          )) : (
            <div className="px-3 py-2 text-left font-medium text-slate-500">Participant</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
