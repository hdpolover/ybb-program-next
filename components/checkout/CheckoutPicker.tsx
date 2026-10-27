// components/checkout/CheckoutPicker.tsx
'use client';

import type { CartCategory } from '@/lib/checkout/cart';
import { formatAmount, type CheckoutConfig } from '@/lib/checkout/checkoutConfig';
import { findOption, type Selection } from '@/lib/checkout/selection';

const CATEGORIES: Array<{ value: CartCategory; label: string }> = [
  { value: 'self_funded', label: 'Self funded' },
  { value: 'fully_funded', label: 'Fully funded' },
];

const cardClass = (active: boolean, disabled = false) =>
  `flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
    active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 bg-white'
  } ${disabled ? 'cursor-not-allowed bg-slate-50 text-slate-400' : 'hover:border-primary/60'}`;

function formatClose(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

type Props = {
  config: CheckoutConfig;
  selection: Selection;
  notice: boolean;
  onEdition: (programSlug: string) => void;
  onCategory: (category: CartCategory) => void;
};

export default function CheckoutPicker({ config, selection, notice, onEdition, onCategory }: Props) {
  return (
    <div className="space-y-5">
      {notice ? (
        <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
          Your earlier selection is no longer available, so we picked the closest option. Please check it below.
        </p>
      ) : null}

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-semibold text-slate-900">Program edition</legend>
        {config.editions.map((edition) => {
          const close = formatClose(edition.registrationDates?.close);
          const active = edition.programSlug === selection.edition.programSlug;
          return (
            <label key={edition.programSlug} className={cardClass(active)}>
              <input
                type="radio"
                name="edition"
                checked={active}
                onChange={() => onEdition(edition.programSlug)}
                className="mt-0.5 h-4 w-4 text-primary focus:ring-primary/40"
              />
              <span>
                <span className="block font-semibold text-slate-900">{edition.programName}</span>
                {close ? <span className="block text-xs text-slate-500">Registration closes {close}</span> : null}
              </span>
            </label>
          );
        })}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-semibold text-slate-900">Funding type</legend>
        {CATEGORIES.map(({ value, label }) => {
          const option = findOption(selection.edition, value);
          const active = value === selection.option.category;
          return (
            <label key={value} className={cardClass(active, !option)}>
              <input
                type="radio"
                name="category"
                checked={active}
                disabled={!option}
                onChange={() => onCategory(value)}
                className="mt-0.5 h-4 w-4 text-primary focus:ring-primary/40"
              />
              <span className="flex flex-1 items-baseline justify-between gap-3">
                <span className="font-semibold">{label}</span>
                <span className="text-xs">{option ? formatAmount(option) : 'Not available'}</span>
              </span>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}
