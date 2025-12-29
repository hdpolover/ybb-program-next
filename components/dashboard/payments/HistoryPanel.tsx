'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import HistoryList, { type HistoryItem } from './HistoryList';
import { Funnel } from 'lucide-react';

const FILTERS = [
  { key: 'all', label: 'All Activities' },
  { key: 'created', label: 'Created' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'rejected', label: 'Rejected' },
] as const;

export default function HistoryPanel({ items, pageSize = 1 }: { items: HistoryItem[]; pageSize?: number }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');
  const [open, setOpen] = useState(false); // buka/tutup dropdown
  const ref = useRef<HTMLDivElement | null>(null);

  // Tutup kalo klik di luar
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(it => it.status === filter);
  }, [items, filter]);

  return (
    <div className="rounded-2xl bg-white p-0 shadow-[0_8px_30px_rgba(2,6,23,0.06)] ring-1 ring-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-blue-950">Payment History</p>
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            aria-expanded={open}
          >
            <Funnel className="h-4 w-4" /> Filter
          </button>
          <div
            className={`absolute right-0 z-10 mt-2 w-44 transition-all duration-200 ${
              open ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1'
            }`}
            role="menu"
          >
            <div className="rounded-md border border-slate-200 bg-white p-1 shadow-lg">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => {
                    setFilter(f.key);
                    setOpen(false);
                  }}
                  className={`block w-full rounded-md px-3 py-1.5 text-left text-xs font-medium hover:bg-slate-50 ${
                    filter === f.key ? 'bg-slate-50 text-blue-700' : 'text-slate-700'
                  }`}
                  type="button"
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <HistoryList items={filtered} pageSize={pageSize} />
    </div>
  );
}
