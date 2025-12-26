'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Calendar, MapPin, Square, CheckCircle2, Star } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function FullyFundedOverviewSection() {
  const [tab, setTab] = useState('details');

  return (
    <section className={jysSectionTheme.applyOverview.sectionWrapper}>
      <div className={jysSectionTheme.applyOverview.container}>
        <div className={jysSectionTheme.applyOverview.layoutGrid}>
          {/* Kiri: card dengan tab */}
          <div className={jysSectionTheme.applyOverview.leftCol}>
            <div className={jysSectionTheme.applyOverview.leftCard}>
              {/* Tabs header */}
              <div className={jysSectionTheme.applyOverview.tabsHeader}>
                <button
                  type="button"
                  className={`${jysSectionTheme.applyOverview.tabButtonBase} ${
                    tab === 'details'
                      ? jysSectionTheme.applyOverview.tabButtonActive
                      : jysSectionTheme.applyOverview.tabButtonInactive
                  }`}
                  onClick={() => setTab('details')}
                >
                  Program Details
                  {tab === 'details' && (
                    <span className={jysSectionTheme.applyOverview.tabActiveUnderline} />
                  )}
                </button>
                <button
                  type="button"
                  className={`${jysSectionTheme.applyOverview.tabButtonBase} ${
                    tab === 'benefits'
                      ? jysSectionTheme.applyOverview.tabButtonActive
                      : jysSectionTheme.applyOverview.tabButtonInactive
                  }`}
                  onClick={() => setTab('benefits')}
                >
                  Benefits
                  {tab === 'benefits' && (
                    <span className={jysSectionTheme.applyOverview.tabActiveUnderline} />
                  )}
                </button>
              </div>

              {/* Tab content */}
              {tab === 'details' && (
                <div className={jysSectionTheme.applyOverview.detailsContentWrapper}>
                  {/* Description */}
                  <div className={jysSectionTheme.applyOverview.descriptionBlock}>
                    <h3 className={jysSectionTheme.applyOverview.sectionHeading}>Description</h3>
                    <p>
                      Japan Youth Summit (JYS) 2026 is an international youth forum that brings
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
                  <div className={jysSectionTheme.applyOverview.descriptionBlock}>
                    <h3 className={jysSectionTheme.applyOverview.sectionHeading}>Requirements</h3>
                    <ul className={jysSectionTheme.applyOverview.requirementsList}>
                      <li className={jysSectionTheme.applyOverview.requirementItem}>
                        <CheckCircle2 className={jysSectionTheme.applyOverview.requirementIcon} />
                        <span>Complete registration form and documentation</span>
                      </li>
                      <li className={jysSectionTheme.applyOverview.requirementItem}>
                        <CheckCircle2 className={jysSectionTheme.applyOverview.requirementIcon} />
                        <span>Submit detailed essays and applications</span>
                      </li>
                      <li className={jysSectionTheme.applyOverview.requirementItem}>
                        <CheckCircle2 className={jysSectionTheme.applyOverview.requirementIcon} />
                        <span>Participate in interviews and evaluations</span>
                      </li>
                      <li className={jysSectionTheme.applyOverview.requirementItem}>
                        <CheckCircle2 className={jysSectionTheme.applyOverview.requirementIcon} />
                        <span>Agree to follow all program and funding guidelines</span>
                      </li>
                    </ul>
                  </div>

                  {/* Benefits (If Selected) */}
                  <div className={jysSectionTheme.applyOverview.descriptionBlock}>
                    <h3 className={jysSectionTheme.applyOverview.sectionHeading}>
                      Benefits (If Selected)
                    </h3>
                    <ul className={jysSectionTheme.applyOverview.benefitsList}>
                      <li className={jysSectionTheme.applyOverview.benefitsItem}>
                        <Star className={jysSectionTheme.applyOverview.benefitsIcon} />
                        <span>Full reimbursement of eligible program payments</span>
                      </li>
                      <li className={jysSectionTheme.applyOverview.benefitsItem}>
                        <Star className={jysSectionTheme.applyOverview.benefitsIcon} />
                        <span>Enhanced recognition as a Fully Funded delegate</span>
                      </li>
                      <li className={jysSectionTheme.applyOverview.benefitsItem}>
                        <Star className={jysSectionTheme.applyOverview.benefitsIcon} />
                        <span>Same program experience as Self Funded participants</span>
                      </li>
                      <li className={jysSectionTheme.applyOverview.benefitsItem}>
                        <Star className={jysSectionTheme.applyOverview.benefitsIcon} />
                        <span>Opportunities for post-program collaboration and features</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {tab === 'benefits' && (
                <div className={jysSectionTheme.applyOverview.benefitsTabContent}>
                  <p>WM HILMI FARREL WKWKKWWKKW</p>
                </div>
              )}
            </div>
          </div>

          {/* Kanan: kartu program seperti contoh */}
          <div className={jysSectionTheme.applyOverview.rightColWrapper}>
            <div className={jysSectionTheme.applyOverview.rightCard}>
              {/* Gambar cover */}
              <div className={jysSectionTheme.applyOverview.coverWrapper}>
                <Image
                  src="/img/jys26posters.png"
                  alt="Japan Youth Summit 2026 cover"
                  width={260}
                  height={360}
                  className={jysSectionTheme.applyOverview.coverImage}
                  priority
                />
              </div>

              {/* Info program */}
              <div className={jysSectionTheme.applyOverview.infoList}>
                <div className={jysSectionTheme.applyOverview.infoRow}>
                  <MapPin className={jysSectionTheme.applyOverview.infoIcon} />
                  <div>
                    <p className={jysSectionTheme.applyOverview.infoLabel}>Location</p>
                    <p className={jysSectionTheme.applyOverview.infoValue}>
                      Osaka &amp; Kyoto, Japan
                    </p>
                  </div>
                </div>

                <div className={jysSectionTheme.applyOverview.infoGrid}>
                  <div className={jysSectionTheme.applyOverview.infoRow}>
                    <CalendarDays className={jysSectionTheme.applyOverview.infoIcon} />
                    <div>
                      <p className={jysSectionTheme.applyOverview.infoLabel}>Duration</p>
                      <p className={jysSectionTheme.applyOverview.infoValue}>5 Days</p>
                    </div>
                  </div>
                  <div className={jysSectionTheme.applyOverview.infoRow}>
                    <Square className={jysSectionTheme.applyOverview.infoIcon} />
                    <div>
                      <p className={jysSectionTheme.applyOverview.infoLabel}>Program Format</p>
                      <p className={jysSectionTheme.applyOverview.infoValue}>On-site in Japan</p>
                    </div>
                  </div>
                </div>

                <div className={jysSectionTheme.applyOverview.infoRow}>
                  <Calendar className={jysSectionTheme.applyOverview.infoIcon} />
                  <div>
                    <p className={jysSectionTheme.applyOverview.infoLabel}>Event Dates</p>
                    <p className={jysSectionTheme.applyOverview.infoValue}>02 – 06 February 2026</p>
                  </div>
                </div>
              </div>

              {/* Tombol guidebook */}
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href="#guidebook-en"
                  className={`${jysSectionTheme.homeRegistration.guideSecondary} flex w-full items-center justify-center gap-2 text-sm`}
                >
                  <span className="text-lg">🇬🇧</span>
                  <span>Read Guidebook (Eng)</span>
                </a>
                <a
                  href="#guidebook-id"
                  className={`${jysSectionTheme.homeRegistration.guidePrimary} flex w-full items-center justify-center gap-2 text-sm`}
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
