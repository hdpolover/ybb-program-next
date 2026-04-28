'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';
import { formatTokenLabel } from '@/lib/utils';
type FAQItem = { q: string; a: string };

type FAQGroup = {
  label: string;
  faqs: FAQItem[];
};

type MainFAQSectionProps = {
  title?: string;
  subtitle?: string;
  items?: Array<{
    id: string;
    question: string;
    answer: string;
    category: string | null;
  }>;
};

export default function MainFAQSection({ title, subtitle, items }: MainFAQSectionProps) {
  if (!items || items.length === 0) {
    return (
      <section className="relative w-full py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader eyebrow="FAQ" title={title || 'Frequently Asked Questions'} />
          {subtitle ? <p className={componentsTheme.faq.subtitle}>{subtitle}</p> : null}
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No FAQs available yet</h3>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500">
              Frequently asked questions will appear here once they are added. If you have a question, feel free to contact our support team.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const [activeTab, setActiveTab] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const apiGroups = useMemo((): FAQGroup[] => {
    const byCategory = new Map<string, FAQItem[]>();
    for (const it of items) {
      const category = (it.category || 'general').trim() || 'general';
      const bucket = byCategory.get(category) ?? [];
      bucket.push({ q: it.question, a: it.answer });
      byCategory.set(category, bucket);
    }

    return Array.from(byCategory.entries()).map(([label, faqs]) => ({
      label: formatTokenLabel(label, 'General'),
      faqs,
    }));
  }, [items]);

  const groups = apiGroups.length > 0 ? apiGroups : [];
  const activeGroup = groups[activeTab] ?? groups[0];

  const filteredFaqs = useMemo(() => {
    if (!activeGroup) return [];
    if (!query.trim()) return activeGroup.faqs;
    const qLower = query.toLowerCase();
    return activeGroup.faqs.filter(
      item => item.q.toLowerCase().includes(qLower) || item.a.toLowerCase().includes(qLower)
    );
  }, [activeGroup, query]);

  return (
    <section className={componentsTheme.faq.sectionWrapper}>
      <div className={componentsTheme.faq.container}>
        <SectionHeader eyebrow="FAQ" title={title ?? 'Frequently Asked Questions'} />
        <p className={componentsTheme.faq.subtitle}>
          {subtitle ??
            'Browse common questions about the program, registration process, and payment information.'}
        </p>

        {/* Search bar */}
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
              placeholder="Search for programs, registration, payment, etc."
              className={componentsTheme.faq.searchInput}
            />
          </div>
        </div>

        <div className={componentsTheme.faq.layoutGrid}>
          {/* Left: Tabs */}
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
                      <span
                        className={componentsTheme.faq.tabIndicatorIdle}
                        aria-hidden="true"
                      />
                    )}
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: FAQ list */}
          <div className={componentsTheme.faq.faqListWrapper}>
            {filteredFaqs.length === 0 ? (
              <div className={componentsTheme.faq.emptyCard}>
                No questions match your search. Try a different keyword or category.
              </div>
            ) : null}

            {filteredFaqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={item.q} className={componentsTheme.faq.faqItemCard}>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className={componentsTheme.faq.faqItemHeader}
                    aria-expanded={isOpen}
                  >
                    <span className={componentsTheme.faq.faqQuestion}>{item.q}</span>
                    <span className={componentsTheme.faq.toggleIcon}>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  {isOpen ? (
                    <div className={componentsTheme.faq.faqAnswer}>{item.a}</div>
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
