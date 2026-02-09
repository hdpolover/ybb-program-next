'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';
import { DATA_NOT_ADDED } from '@/data/programs/shared/constants';

type FAQItem = { q: string; a: string };

type FAQGroup = {
  label: string;
  faqs: FAQItem[];
};

const MAIN_FAQ_GROUPS: FAQGroup[] = [
  {
    label: 'About JYS Program',
    faqs: [
      {
        q: 'What is the Japan Youth Summit (JYS)?',
        a: 'Japan Youth Summit (JYS) is an international youth program that brings together young leaders to discuss global issues, join capacity-building sessions, and experience cultural exchange in Japan.',
      },
      {
        q: 'Who can apply for the JYS program?',
        a: 'JYS is open to youth, students, and young professionals typically between 15 - 25 years old who are passionate about leadership, SDGs, and cross-cultural collaboration. Eligibility details may vary slightly by edition.',
      },
      {
        q: 'What are the main activities during the program?',
        a: 'Participants will join plenary sessions, panel discussions, cultural exchange activities, group projects, networking events, and city or campus visits depending on the final agenda.',
      },
      {
        q: 'Is the program conducted fully in Japan or hybrid/online?',
        a: 'The core activities are held on-site in Japan. However, some briefings, pre-departure orientations, or follow-up sessions may be conducted online.',
      },
      {
        q: 'Will I receive a certificate after the program?',
        a: 'Yes. Participants who complete the full program will receive an official certificate of participation issued by the organizing committee.',
      },
    ],
  },
  {
    label: 'Registration',
    faqs: [
      {
        q: 'How do I register for the JYS program?',
        a: 'You can register by filling in the official application form on our website. Make sure to complete all required fields and upload any requested documents before the deadline.',
      },
      {
        q: 'What documents are usually required for registration?',
        a: 'Commonly required documents include a CV or resume, a short motivation statement, a scanned ID or passport, and sometimes proof of student status or recommendation letters.',
      },
      {
        q: 'Can I edit my application after submitting it?',
        a: 'Minor updates may be possible before the deadline. Please contact the organizing team if you need to correct important information in your submitted application.',
      },
      {
        q: 'How will I know if I am accepted?',
        a: 'Notifications will be sent via email to the address you used during registration. Please check your inbox and spam folder regularly after the application period closes.',
      },
      {
        q: 'Is there a selection process or is it first come, first served?',
        a: 'Most JYS intakes are selective. Applications are reviewed based on motivation, relevance, and diversity considerations, not only on a first-come, first-served basis.',
      },
    ],
  },
  {
    label: 'Payments',
    faqs: [
      {
        q: 'What does the program fee cover?',
        a: 'The program fee generally covers accommodation, most meals during official activities, local transportation related to the program, learning materials, and entrance to scheduled venues. Flights and personal expenses are usually not included.',
      },
      {
        q: 'How can I pay the program fee?',
        a: 'Payment can typically be made via bank transfer or other official payment channels listed in your acceptance email. Detailed instructions and deadlines will be provided once you are accepted.',
      },
      {
        q: 'Are there any scholarships or financial aid options?',
        a: 'Depending on the edition, there may be fully-funded or partially-funded opportunities. Please check the program information page or announcements for the latest details on available scholarships.',
      },
      {
        q: 'Can I pay the fee in installments?',
        a: 'In some cases, installment plans are available within specific timelines. Please refer to the payment guidelines in your acceptance email or contact the finance team.',
      },
      {
        q: 'What is the refund policy if I can no longer attend?',
        a: 'Refund policies vary by edition, but generally, fees are partially refundable only within certain periods due to advance bookings and commitments. Full details will be stated in the terms and conditions.',
      },
    ],
  },
];

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
  const [activeTab, setActiveTab] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const apiGroups = useMemo((): FAQGroup[] => {
    if (!items) return [];
    if (items.length === 0) return [];

    const byCategory = new Map<string, FAQItem[]>();
    for (const it of items) {
      const category = (it.category || 'general').trim() || 'general';
      const bucket = byCategory.get(category) ?? [];
      bucket.push({ q: it.question, a: it.answer });
      byCategory.set(category, bucket);
    }

    return Array.from(byCategory.entries()).map(([label, faqs]) => ({ label, faqs }));
  }, [items]);

  const groups = apiGroups.length > 0 ? apiGroups : MAIN_FAQ_GROUPS;
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
    <section className={jysSectionTheme.faq.sectionWrapper}>
      <div className={jysSectionTheme.faq.container}>
        <SectionHeader eyebrow="FAQ" title={title ?? 'Frequently Asked Questions'} />
        <p className={jysSectionTheme.faq.subtitle}>
          {subtitle ??
            'Browse common questions about the Japan Youth Summit (JYS) program, registration process, and payment information.'}
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
              placeholder="Search for programs, registration, payment, etc."
              className={jysSectionTheme.faq.searchInput}
            />
          </div>
        </div>

        <div className={jysSectionTheme.faq.layoutGrid}>
          {/* Left: Tabs */}
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
                      <span
                        className={jysSectionTheme.faq.tabIndicatorIdle}
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
          <div className={jysSectionTheme.faq.faqListWrapper}>
            {items && items.length === 0 ? (
              <div className={jysSectionTheme.faq.emptyCard}>{DATA_NOT_ADDED}</div>
            ) : null}

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
                  {isOpen ? (
                    <div className={jysSectionTheme.faq.faqAnswer}>{item.a}</div>
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
