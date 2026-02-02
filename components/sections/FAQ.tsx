'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { HOME_FAQ_COPY } from '@/data/home/sections/faq/homeFaq';

export default function FAQ() {
  const [activeTab, setActiveTab] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const groups = HOME_FAQ_COPY.groups;
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
        <SectionHeader eyebrow="FAQ" title={HOME_FAQ_COPY.title} />
        <p className={jysSectionTheme.faq.subtitle}>
          {HOME_FAQ_COPY.subtitle}
        </p>

        {/* Bar pencarian */}
        <div className={jysSectionTheme.faq.searchWrapper}>
          <div className={jysSectionTheme.faq.searchInner}>
            <Search className={jysSectionTheme.faq.searchIcon} />
            <input
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setOpenIdx(0);
              }}
              placeholder="Search for program, registration, payments, etc."
              className={jysSectionTheme.faq.searchInput}
            />
          </div>
        </div>

        <div className={jysSectionTheme.faq.layoutGrid}>
          {/* Kiri: Tab */}
          <div className={jysSectionTheme.faq.tabsCard}>
            <nav className={jysSectionTheme.faq.tabsNav}>
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
                    className={`${jysSectionTheme.faq.tabButtonBase} ${
                      isActive
                        ? jysSectionTheme.faq.tabButtonActive
                        : jysSectionTheme.faq.tabButtonInactive
                    }`}
                    aria-current={isActive}
                  >
                    {isActive ? (
                      <span
                        className={jysSectionTheme.faq.tabIndicatorActive}
                        aria-hidden="true"
                      />
                    ) : (
                      <span className={jysSectionTheme.faq.tabIndicatorIdle} aria-hidden="true" />
                    )}
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Kanan: Daftar FAQ */}
          <div className={jysSectionTheme.faq.faqListWrapper}>
            {filteredFaqs.length === 0 ? (
              <div className={jysSectionTheme.faq.emptyCard}>
                No questions match your search. Try a different keyword or category.
              </div>
            ) : null}

            {filteredFaqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={`${item.q}-${idx}`}
                  className={jysSectionTheme.faq.faqItemCard}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className={jysSectionTheme.faq.faqItemHeader}
                    aria-expanded={isOpen}
                  >
                    <span className={jysSectionTheme.faq.faqQuestion}>
                      {item.q}
                    </span>
                    <span className={jysSectionTheme.faq.toggleIcon}>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  {isOpen ? (
                    <div className={jysSectionTheme.faq.faqAnswer}>
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
