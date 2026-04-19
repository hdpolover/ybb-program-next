"use client";

import { Country } from "country-state-city";

interface Props {
  value: string;
}

export function CountryDisplay({ value }: Props) {
  if (!value) return <span className="text-slate-400">—</span>;
  const country = Country.getCountryByCode(value);
  if (!country) return <span>{value}</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden>{country.flag}</span>
      <span>{country.name}</span>
    </span>
  );
}
