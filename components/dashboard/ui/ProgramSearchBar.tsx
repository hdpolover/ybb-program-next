"use client";

import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

export type ProgramOption = {
  id: string;
  name: string;
};

interface ProgramSearchBarProps {
  programs: ProgramOption[];
  selectedProgramId?: string;
  onSelectProgram?: (programId: string) => void;
  searchTags?: string[];
}

export default function ProgramSearchBar({
  programs,
  selectedProgramId,
  onSelectProgram,
  searchTags = ["albums", "artists", "playlists", "music"],
}: ProgramSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedProgram = programs.find(p => p.id === selectedProgramId);

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-4 rounded-xl border border-slate-300 bg-white px-4 py-3">
        {/* Search Icon */}
        <Search className="h-6 w-6 text-slate-700" />
        
        {/* Search Input Area */}
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-sm text-slate-700">Search for</span>
          <div className="flex items-center gap-2">
            <span className="text-base text-slate-700">
              {selectedProgram ? "award, scholarship, etc..." : "Select a program..."}
            </span>
          </div>
          
          {/* Tags */}
          <div className="flex items-center gap-3 pt-1">
            {searchTags.map((tag, index) => (
              <button
                key={index}
                className="text-xs font-normal text-slate-700 hover:text-primary transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Program Selector Dropdown */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-base text-slate-900"
        >
          <span className="font-medium">{selectedProgram?.name || "Select program"}</span>
          <ChevronDown className={`h-6 w-6 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="max-h-64 overflow-y-auto py-2">
            {programs.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">
                No programs available
              </div>
            ) : (
              programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => {
                    onSelectProgram?.(program.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm hover:bg-slate-50 transition-colors ${
                    program.id === selectedProgramId ? "bg-primary/10 text-primary font-medium" : "text-slate-700"
                  }`}
                >
                  {program.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
