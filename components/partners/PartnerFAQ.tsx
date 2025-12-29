'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type FAQItem = { q: string; a: string };

type FAQGroup = {
  label: string;
  faqs: FAQItem[];
};

const PARTNER_FAQ_GROUPS: FAQGroup[] = [
  {
    label: 'Partnership Packages',
    faqs: [
      {
        q: 'What types of partnership packages are available?',
        a: 'We offer flexible partnership tiers for community partners, academic institutions, corporations, and media partners. Each package includes different levels of visibility, branding, and engagement opportunities.',
      },
      {
        q: 'Can we customize a partnership package?',
        a: "Yes. While we provide standard tiers, we are happy to tailor specific benefits, activities, and deliverables based on your organization's objectives and capacity.",
      },
      {
        q: 'Is there a minimum commitment period?',
        a: 'Most partnerships are designed per program cycle (one edition of YBB programs), but we also welcome multi-year collaborations for long-term impact.',
      },
    ],
  },
  {
    label: 'Sponsorship & Benefits',
    faqs: [
      {
        q: 'What visibility will our brand receive as a sponsor?',
        a: 'Depending on the tier, sponsors may receive logo placement on event materials, website, social media campaigns, stage acknowledgements, and dedicated highlight content.',
      },
      {
        q: 'Can sponsors support in-kind instead of financial contributions?',
        a: 'Absolutely. We collaborate with partners providing venues, experts, media coverage, scholarships, or other in-kind resources that directly support program delivery.',
      },
      {
        q: 'Will we receive impact reports after the program?',
        a: 'Yes. Partners receive a post-program summary including participant profiles, key outcomes, media reach, and highlights of collaborative activities.',
      },
    ],
  },
  {
    label: 'Process & Agreement',
    faqs: [
      {
        q: 'How do we start a partnership discussion?',
        a: 'You can fill out the partnership inquiry form or contact our partnership team via email. We will schedule a call to understand your goals and propose a suitable collaboration model.',
      },
      {
        q: 'What does the partnership agreement look like?',
        a: 'We formalize collaborations through a simple Memorandum of Understanding (MoU) or agreement that clearly outlines objectives, roles, timelines, and benefits for both parties.',
      },
      {
        q: 'How early should we confirm our sponsorship?',
        a: 'Ideally, sponsors confirm at least 6–8 weeks before the program date to maximize branding opportunities and integration into our campaigns.',
      },
    ],
  },
];

export default function PartnerFAQSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const activeGroup = PARTNER_FAQ_GROUPS[activeTab];

  const filteredFaqs = useMemo(() => {
    if (!query.trim()) return activeGroup.faqs;
    const qLower = query.toLowerCase();
    return activeGroup.faqs.filter(
      item => item.q.toLowerCase().includes(qLower) || item.a.toLowerCase().includes(qLower)
    );
  }, [activeGroup, query]);

  return (
    <section className={jysSectionTheme.faq.sectionWrapper}>
      <div className={jysSectionTheme.faq.container}>
        <SectionHeader eyebrow="Partner FAQ" title="Questions about Partner & Sponsorship" />
        <p className={jysSectionTheme.faq.subtitle}>
          Find quick answers about partnership packages, sponsorship benefits, and how to start
          collaborating with YBB.
        </p>

        {/* Search bar */}
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
              placeholder="Search for partnership packages, sponsorship, process, etc."
              className={jysSectionTheme.faq.searchInput}
            />
          </div>
        </div>

        <div className={jysSectionTheme.faq.layoutGrid}>
          {/* Left: Tabs */}
          <div className={jysSectionTheme.faq.tabsCard}>
            <nav className={jysSectionTheme.faq.tabsNav}>
              {PARTNER_FAQ_GROUPS.map((group, index) => {
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
                      <span className={jysSectionTheme.faq.tabIndicatorActive} aria-hidden="true" />
                    ) : (
                      <span className={jysSectionTheme.faq.tabIndicatorIdle} aria-hidden="true" />
                    )}
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: FAQ list */}
          <div className={jysSectionTheme.faq.faqListWrapper}>
            {filteredFaqs.length === 0 ? (
              <div className={jysSectionTheme.faq.emptyCard}>
                No questions match your search. Try a different keyword or category.
              </div>
            ) : null}

            {filteredFaqs.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={item.q} className={jysSectionTheme.faq.faqItemCard}>
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className={jysSectionTheme.faq.faqItemHeader}
                    aria-expanded={isOpen}
                  >
                    <span className={jysSectionTheme.faq.faqQuestion}>{item.q}</span>
                    <span className={jysSectionTheme.faq.toggleIcon}>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </button>
                  {isOpen ? <div className={jysSectionTheme.faq.faqAnswer}>{item.a}</div> : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
