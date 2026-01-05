"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Sederhana dulu: program hardcoded, nanti bisa disambung ke data user
const PROGRAMS = [
  {
    id: "jys-2025",
    label: "JYS 2025 Participant",
    logo: "/img/jys.png",
  },
  {
    id: "kys-2026",
    label: "KYS 2026 Participant",
    logo: "/img/KYSlogo.png",
  },
];

export default function ProgramSelector() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(PROGRAMS[0]?.id ?? "");
  const ref = useRef<HTMLDivElement | null>(null);

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

  const active = PROGRAMS.find(p => p.id === activeId) ?? PROGRAMS[0];

  return (
    <div ref={ref} className="relative inline-block text-xs font-semibold uppercase tracking-wide">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700 shadow-sm transition hover:border-pink-500 hover:text-pink-700"
      >
        <span className="relative h-6 w-6 overflow-hidden rounded-full bg-slate-100">
          <Image src={active.logo} alt={active.label} fill className="object-contain" />
        </span>
        <span>{active.label}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 text-[11px] shadow-lg">
          {PROGRAMS.map(program => (
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
          ))}
        </div>
      ) : null}
    </div>
  );
}
