"use client";

import { useMemo, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { ChevronDown, Search } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import type { ProgramFaqsSection } from '@/types/programs';

type FAQ = { q: string; a: string };

type FAQGroup = {
  label: string;
  fqs: FAQ[];
};

type ProgramFAQProps = {
  fqs?: ProgramFaqsSection['content'];
  // kalau mau kirim data FAQ yang sudah dikelompokkan dari luar
  groupsOverride?: FAQGroup[];
};

export default function ProgramFAQ({ fqs, groupsOverride }: ProgramFAQProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const title = fqs?.title || "Got Questions? We've Got Answers.";
  const items = fqs?.items ?? [];

  const groups: FAQGroup[] = useMemo(() => {
    if (groupsOverride && groupsOverride.length) return groupsOverride;
    if (!items.length) return [];
    const byCategory = new Map<string, FAQ[]>();
    for (const item of items) {
      const key = item.category || 'General';
      const list = byCategory.get(key) ?? [];
      list.push({ q: item.question, a: item.answer });
      byCategory.set(key, list);
    }
    return Array.from(byCategory.entries()).map(([label, faqs]) => ({ label, fqs: faqs }));
  }, [items]);

  if (!fqs && !groupsOverride) return null;

  if (groups.length === 0) {
    return (
      <section className="relative w-full py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader eyebrow="FAQ" title={title} />
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-slate-600">
            No FAQ data available yet.
          </p>
        </div>
      </section>
    );
  }

  const activeGroup = groups[activeTab];

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return activeGroup.fqs;
    const qLower = query.toLowerCase();
    return activeGroup.fqs.filter(
      item => item.q.toLowerCase().includes(qLower) || item.a.toLowerCase().includes(qLower),
    );
  }, [activeGroup, query]);

  return (
    <section className="relative w-full py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title={title} />
        <p className="mx-auto -mt-6 mb-8 max-w-2xl text-center text-sm text-slate-600">
          Explore frequently asked questions to better understand the program flow, requirements, and important information.
        </p>

        {/* search bar buat filter FAQ */}
        <div className="mx-auto mb-8 max-w-3xl">
          <div className="relative flex items-center overflow-hidden rounded-full bg-white px-4 py-2 shadow-[0_10px_35px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setOpenIdx(0);
              }}
              placeholder="Search for program, registration, payments, etc."
              className="ml-3 w-full border-none bg-transparent text-sm text-blue-950 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
          {/* Kiri: tab kategori FAQ */}
          <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-blue-100">
            <nav className="flex flex-col divide-y divide-slate-100">
              {groups.map((group, index) => {
                const isActive = index === activeTab;
                return (
                  <button
                    key={group.label}
                    type="button"
                    onClick={() => {
                      setActiveTab(index);
                      setOpenIdx(0);
                    }}
                    className={`relative flex items-center gap-3 px-5 py-4 text-left text-sm font-semibold transition-colors sm:px-6 sm:text-base ${
                      isActive
                        ? 'bg-white text-blue-950'
                        : 'bg-white text-slate-500 hover:bg-primary/10 hover:text-blue-950'
                    }`}
                    aria-current={isActive}
                  >
                    {isActive ? (
                      <span className="h-9 w-0.5 rounded-full bg-primary" aria-hidden="true" />
                    ) : (
                      <span className="h-9 w-0.5" aria-hidden="true" />
                    )}
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Kanan: isi pertanyaan FAQ */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl bg-white px-5 py-6 text-sm text-slate-600 shadow-[0_10px_35px_rgba(15,23,42,0.08)] ring-1 ring-slate-200 sm:px-6">
                No questions match your search. Try a different keyword or category.
              </div>
            ) : null}

            {filteredFaqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={`${item.q}-${idx}`}
                  className="overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.1)] ring-1 ring-slate-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-extrabold text-blue-950 sm:text-lg">
                      {item.q}
                    </span>
                    <span className={componentsTheme.faq.toggleIcon}>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="px-5 pb-5 text-sm leading-6 text-slate-700 sm:px-6">
                      {item.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
