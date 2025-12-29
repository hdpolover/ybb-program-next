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

const FAQ_GROUPS: FAQGroup[] = [
  {
    label: 'Event Details',
    faqs: [
      {
        q: 'What is Japan Youth Summit?',
        a: 'Japan Youth Summit is an international youth program that brings together young leaders to collaborate, discuss global issues, and experience cultural exchange in Japan.',
      },
      {
        q: 'Where and when will the program take place?',
        a: 'The summit is scheduled to be held in Japan with detailed dates, venue, and agenda shared in the official guidebook and announcement channels.',
      },
      {
        q: 'Who can join Japan Youth Summit?',
        a: 'The program is open to youth and young professionals from various countries who are passionate about leadership, collaboration, and global citizenship.',
      },
    ],
  },
  {
    label: 'Registration',
    faqs: [
      {
        q: 'How do I apply for the program?',
        a: 'You can apply by filling in the registration form on the official website and following the instructions listed in the program guidebook.',
      },
      {
        q: 'Is there any selection process?',
        a: 'Yes. All applications will be reviewed based on motivation, alignment with program values, and potential impact in your community.',
      },
      {
        q: 'Can I edit my application after submission?',
        a: 'Minor corrections may be allowed before the deadline. Please refer to the guidebook or contact our support team for assistance.',
      },
    ],
  },
  {
    label: 'Payments',
    faqs: [
      {
        q: 'What does the program fee cover?',
        a: 'The fee generally includes program sessions, materials, on-site activities, and a certificate of participation. Travel, visa, and personal expenses are usually excluded unless stated otherwise.',
      },
      {
        q: 'Are there any scholarship or funded opportunities?',
        a: 'Some editions may provide self-funded and fully funded tracks. Please check the latest information on the website or guidebook for available schemes.',
      },
      {
        q: 'What payment methods are available?',
        a: 'Payment options such as bank transfer or other channels will be explained clearly in the payment instruction section and official announcements.',
      },
    ],
  },
];

export default function FAQ() {
  const [activeTab, setActiveTab] = useState(0);
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [query, setQuery] = useState('');

  const activeGroup = FAQ_GROUPS[activeTab];

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
        <SectionHeader eyebrow="FAQ" title="Got Questions? We've Got Answers." />
        <p className="mx-auto -mt-6 mb-8 max-w-2xl text-center text-sm text-slate-600">
          Explore frequently asked questions to better understand the program flow, requirements,
          and important information.
        </p>

        {/* Search bar */}
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
          {/* Left: Tabs */}
          <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] ring-1 ring-blue-100">
            <nav className="flex flex-col divide-y divide-slate-100">
              {FAQ_GROUPS.map((group, index) => {
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
                        : 'bg-white text-slate-500 hover:bg-pink-50 hover:text-blue-950'
                    }`}
                    aria-current={isActive}
                  >
                    {isActive ? (
                      <span className="h-9 w-0.5 rounded-full bg-pink-600" aria-hidden="true" />
                    ) : (
                      <span className="h-9 w-0.5" aria-hidden="true" />
                    )}
                    <span>{group.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: FAQ list */}
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
                  key={item.q}
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
                    <span className={jysSectionTheme.faq.toggleIcon}>
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
