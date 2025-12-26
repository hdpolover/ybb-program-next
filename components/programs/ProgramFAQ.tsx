'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export type FAQ = { q: string; a: string };

export default function ProgramFAQ({ groups }: { groups: { label: string; faqs: FAQ[] }[] }) {
  const [active, setActive] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className={jysSectionTheme.programFAQ.sectionWrapper}>
      <div className={jysSectionTheme.programFAQ.container}>
        <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" align="center" />

        {/* Tabs */}
        <div className={jysSectionTheme.programFAQ.tabsCard}>
          <div className={jysSectionTheme.programFAQ.tabsGrid}>
            {groups.map((g, i) => (
              <button
                key={g.label}
                type="button"
                onClick={() => {
                  setActive(i);
                  setOpenIdx(0);
                }}
                className={`${jysSectionTheme.programFAQ.tabButton} ${
                  i === active ? 'text-blue-950' : jysSectionTheme.programFAQ.tabInactive
                }`}
                aria-current={i === active}
              >
                <span className={jysSectionTheme.programFAQ.tabLabelInner}>
                  <HelpCircle className={jysSectionTheme.programFAQ.tabLabelIcon} />
                  <span>{g.label}</span>
                </span>
                {i === active ? (
                  <span className={jysSectionTheme.programFAQ.tabActiveUnderline} />
                ) : (
                  <span className={jysSectionTheme.programFAQ.tabDivider} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Accordions */}
        <div className={jysSectionTheme.programFAQ.faqListWrapper}>
          {groups[active]?.faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className={jysSectionTheme.programFAQ.faqCard}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className={jysSectionTheme.programFAQ.faqHeaderButton}
                  aria-expanded={isOpen}
                >
                  <span className={jysSectionTheme.programFAQ.faqQuestion}>{item.q}</span>
                  <ChevronDown
                    className={`${jysSectionTheme.programFAQ.faqChevron} ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen ? (
                  <div className={jysSectionTheme.programFAQ.faqBody}>
                    <p className={jysSectionTheme.programFAQ.faqAnswer}>{item.a}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
