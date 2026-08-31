'use client';

import { useState } from 'react';
import { componentsTheme } from '@/lib/theme/components';

export type ProgramYearOption = {
  year: number;
  slug: string;
  name: string;
};

type YearTabToggleProps = {
  programs: ProgramYearOption[];
  defaultYear?: number;
  onYearChange: (program: ProgramYearOption) => void;
};

export default function YearTabToggle({
  programs,
  defaultYear,
  onYearChange,
}: YearTabToggleProps) {
  const [selectedYear, setSelectedYear] = useState(
    defaultYear || (programs.length > 0 ? programs[0].year : new Date().getFullYear())
  );

  const handleYearChange = (program: ProgramYearOption) => {
    setSelectedYear(program.year);
    onYearChange(program);
  };

  if (programs.length <= 1) {
    return null;
  }

  return (
    <div className={componentsTheme.yearTabToggle.wrapper}>
      {programs.map((program) => (
        <button
          key={program.year}
          onClick={() => handleYearChange(program)}
          className={`${componentsTheme.yearTabToggle.tab} ${
            selectedYear === program.year
              ? componentsTheme.yearTabToggle.tabActive
              : componentsTheme.yearTabToggle.tabInactive
          }`}
        >
          {program.year}
        </button>
      ))}
    </div>
  );
}
