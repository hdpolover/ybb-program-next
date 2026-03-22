'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import type { FaqItem } from '@/types/faqs';

export type FaqGroup = {
  label: string;
  faqs: { q: string; a: string }[];
};

export type FAQProps = {
  title?: string;
  subtitle?: string;
  /** API FAQ items — will be grouped by category */
  apiItems?: FaqItem[];
  /** Pre-grouped FAQ items (overrides apiItems) */
  groups?: FaqGroup[];
};

/**
 * Group flat API FAQ items by category into the group format the UI expects.
 */
function groupFaqsByCategory(items: FaqItem[]): FaqGroup[] {
  const grouped = new Map<string, { q: string; a: string }[]>();
  for (const item of items) {
    const cat = item.category || 'General';
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push({ q: item.question, a: item.answer });
  }
  return Array.from(grouped.entries()).map(([label, faqs]) => ({ label, faqs }));
}

export default function FAQ({ title, subtitle, apiItems, groups: groupsProp }: FAQProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const groups = groupsProp
    ?? (apiItems && apiItems.length > 0 ? groupFaqsByCategory(apiItems) : []);

  if (!groups.length) return null;

  const sectionTitle = title ?? "Got Questions? We've Got Answers.";
  const sectionSubtitle = subtitle ?? 'Explore frequently asked questions to better understand the program flow, requirements, and important information.';
  const activeGroup = groups[activeTab];

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return activeGroup.faqs;
    const qLower = query.toLowerCase();
    return activeGroup.faqs.filter(
      item => item.q.toLowerCase().includes(qLower) || item.a.toLowerCase().includes(qLower)
    );
  }, [activeGroup, query]);

  return (
    <section className="relative w-full py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title={sectionTitle} />
        <p className={componentsTheme.faq.subtitle}>
          {sectionSubtitle}
        </p>

        {/* Bar pencarian */}
        <div className={componentsTheme.faq.searchWrapper}>
          <div className={componentsTheme.faq.searchInner}>
            <Search className={componentsTheme.faq.searchIcon} />
            <input
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setOpenIdx(0);
              }}
              placeholder="Search for program, registration, payments, etc."
              className={componentsTheme.faq.searchInput}
            />
          </div>
        </div>

        <div className={componentsTheme.faq.layoutGrid}>
          {/* Kiri: Tab */}
          <div className={componentsTheme.faq.tabsCard}>
            <nav className={componentsTheme.faq.tabsNav}>
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
                    className={`${componentsTheme.faq.tabButtonBase} ${
                      isActive
                        ? componentsTheme.faq.tabButtonActive
                        : componentsTheme.faq.tabButtonInactive
                    }`}
                    aria-current={isActive}
                  >
                    {isActive ? (
                      <span
                        className={componentsTheme.faq.tabIndicatorActive}
                        aria-hidden="true"
                      />
                    ) : (
                      <span className={componentsTheme.faq.tabIndicatorIdle} aria-hidden="true" />
                    )}
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Kanan: Daftar FAQ */}
          <div className={componentsTheme.faq.faqListWrapper}>
            {filteredFaqs.length === 0 ? (
              <div className={componentsTheme.faq.emptyCard}>
                No questions match your search. Try a different keyword or category.
              </div>
            ) : null}

            {filteredFaqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={`${item.q}-${idx}`}
                  className={componentsTheme.faq.faqItemCard}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className={componentsTheme.faq.faqItemHeader}
                    aria-expanded={isOpen}
                  >
                    <span className={componentsTheme.faq.faqQuestion}>
                      {item.q}
                    </span>
                    <span className={componentsTheme.faq.toggleIcon}>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  {isOpen ? (
                    <div className={componentsTheme.faq.faqAnswer}>
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
