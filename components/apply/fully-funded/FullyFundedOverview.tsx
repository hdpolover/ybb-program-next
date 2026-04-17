'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Calendar, MapPin, Square, CheckCircle2, Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

export default function FullyFundedOverviewSection() {
  const [tab, setTab] = useState('details');

  return (
    <section className={componentsTheme.applyOverview.sectionWrapper}>
      <div className={componentsTheme.applyOverview.container}>
        <div className={componentsTheme.applyOverview.layoutGrid}>
          {/* Kiri: card dengan tab */}
          <div className={componentsTheme.applyOverview.leftCol}>
            <div className={componentsTheme.applyOverview.leftCard}>
              {/* Tabs header */}
              <div className={componentsTheme.applyOverview.tabsHeader}>
                <button
                  type="button"
                  className={`${componentsTheme.applyOverview.tabButtonBase} ${
                    tab === 'details'
                      ? componentsTheme.applyOverview.tabButtonActive
                      : componentsTheme.applyOverview.tabButtonInactive
                  }`}
                  onClick={() => setTab('details')}
                >
                  Program Details
                  {tab === 'details' && (
                    <span className={componentsTheme.applyOverview.tabActiveUnderline} />
                  )}
                </button>
                <button
                  type="button"
                  className={`${componentsTheme.applyOverview.tabButtonBase} ${
                    tab === 'benefits'
                      ? componentsTheme.applyOverview.tabButtonActive
                      : componentsTheme.applyOverview.tabButtonInactive
                  }`}
                  onClick={() => setTab('benefits')}
                >
                  Benefits
                  {tab === 'benefits' && (
                    <span className={componentsTheme.applyOverview.tabActiveUnderline} />
                  )}
                </button>
              </div>

              {/* Tab content */}
              {tab === 'details' && (
                <div className={componentsTheme.applyOverview.detailsContentWrapper}>
                  {/* Description */}
                  <div className={componentsTheme.applyOverview.descriptionBlock}>
                    <h3 className={componentsTheme.applyOverview.sectionHeading}>Description</h3>
                    <p>
                      This program is an international youth forum that brings
                      together passionate young leaders to discuss, design, and drive collaborative
                      solutions for a more sustainable and inclusive future in Asia and beyond.
                    </p>
                    <p>
                      Throughout the program, participants will engage in panel discussions,
                      cultural exchanges, and hands-on workshops guided by experienced mentors and
                      practitioners.
                    </p>
                    <p>
                      The summit is also a space to build long-term friendships and cross-border
                      collaborations, with delegates expected to return home with clearer action
                      plans and stronger international networks.
                    </p>
                  </div>

                  {/* Requirements */}
                  <div className={componentsTheme.applyOverview.descriptionBlock}>
                    <h3 className={componentsTheme.applyOverview.sectionHeading}>Requirements</h3>
                    <ul className={componentsTheme.applyOverview.requirementsList}>
                      <li className={componentsTheme.applyOverview.requirementItem}>
                        <CheckCircle2 className={componentsTheme.applyOverview.requirementIcon} />
                        <span>Complete registration form and documentation</span>
                      </li>
                      <li className={componentsTheme.applyOverview.requirementItem}>
                        <CheckCircle2 className={componentsTheme.applyOverview.requirementIcon} />
                        <span>Submit detailed essays and applications</span>
                      </li>
                      <li className={componentsTheme.applyOverview.requirementItem}>
                        <CheckCircle2 className={componentsTheme.applyOverview.requirementIcon} />
                        <span>Participate in interviews and evaluations</span>
                      </li>
                      <li className={componentsTheme.applyOverview.requirementItem}>
                        <CheckCircle2 className={componentsTheme.applyOverview.requirementIcon} />
                        <span>Agree to follow all program and funding guidelines</span>
                      </li>
                    </ul>
                  </div>

                  {/* Benefits (If Selected) */}
                  <div className={componentsTheme.applyOverview.descriptionBlock}>
                    <h3 className={componentsTheme.applyOverview.sectionHeading}>
                      Benefits (If Selected)
                    </h3>
                    <ul className={componentsTheme.applyOverview.benefitsList}>
                      <li className={componentsTheme.applyOverview.benefitsItem}>
                        <Star className={componentsTheme.applyOverview.benefitsIcon} />
                        <span>Full reimbursement of eligible program payments</span>
                      </li>
                      <li className={componentsTheme.applyOverview.benefitsItem}>
                        <Star className={componentsTheme.applyOverview.benefitsIcon} />
                        <span>Enhanced recognition as a Fully Funded delegate</span>
                      </li>
                      <li className={componentsTheme.applyOverview.benefitsItem}>
                        <Star className={componentsTheme.applyOverview.benefitsIcon} />
                        <span>Same program experience as Self Funded participants</span>
                      </li>
                      <li className={componentsTheme.applyOverview.benefitsItem}>
                        <Star className={componentsTheme.applyOverview.benefitsIcon} />
                        <span>Opportunities for post-program collaboration and features</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {tab === 'benefits' && (
                <div className={componentsTheme.applyOverview.benefitsTabContent}>
                  <p>WM HILMI FARREL WKWKKWWKKW</p>
                </div>
              )}
            </div>
          </div>

          {/* Kanan: kartu program seperti contoh */}
          <div className={componentsTheme.applyOverview.rightColWrapper}>
            <div className={componentsTheme.applyOverview.rightCard}>
              {/* Gambar cover */}
              <div className={componentsTheme.applyOverview.coverWrapper}>
                <Image
                  src="/img/program-cover.png"
                  alt="Program cover"
                  width={260}
                  height={360}
                  className={componentsTheme.applyOverview.coverImage}
                  priority
                />
              </div>

              {/* Info program */}
              <div className={componentsTheme.applyOverview.infoList}>
                <div className={componentsTheme.applyOverview.infoRow}>
                  <MapPin className={componentsTheme.applyOverview.infoIcon} />
                  <div>
                    <p className={componentsTheme.applyOverview.infoLabel}>Location</p>
                    <p className={componentsTheme.applyOverview.infoValue}>
                      Osaka &amp; Kyoto, Japan
                    </p>
                  </div>
                </div>

                <div className={componentsTheme.applyOverview.infoGrid}>
                  <div className={componentsTheme.applyOverview.infoRow}>
                    <CalendarDays className={componentsTheme.applyOverview.infoIcon} />
                    <div>
                      <p className={componentsTheme.applyOverview.infoLabel}>Duration</p>
                      <p className={componentsTheme.applyOverview.infoValue}>5 Days</p>
                    </div>
                  </div>
                  <div className={componentsTheme.applyOverview.infoRow}>
                    <Square className={componentsTheme.applyOverview.infoIcon} />
                    <div>
                      <p className={componentsTheme.applyOverview.infoLabel}>Program Format</p>
                      <p className={componentsTheme.applyOverview.infoValue}>On-site in Japan</p>
                    </div>
                  </div>
                </div>

                <div className={componentsTheme.applyOverview.infoRow}>
                  <Calendar className={componentsTheme.applyOverview.infoIcon} />
                  <div>
                    <p className={componentsTheme.applyOverview.infoLabel}>Event Dates</p>
                    <p className={componentsTheme.applyOverview.infoValue}>02 – 06 February 2026</p>
                  </div>
                </div>
              </div>

              {/* Tombol guidebook */}
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href="#guidebook-en"
                  className={`${componentsTheme.homeRegistration.guideSecondary} flex w-full items-center justify-center gap-2 text-sm`}
                >
                  <span className="text-lg">🇬🇧</span>
                  <span>Read Guidebook (Eng)</span>
                </a>
                <a
                  href="#guidebook-id"
                  className={`${componentsTheme.homeRegistration.guidePrimary} flex w-full items-center justify-center gap-2 text-sm`}
                >
                  <span className="text-lg">🇮🇩</span>
                  <span>Read Guidebook (Ind)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
