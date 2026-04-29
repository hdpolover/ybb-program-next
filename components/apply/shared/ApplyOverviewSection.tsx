'use client';

import { useState } from 'react';
import { Calendar, CalendarDays, CheckCircle2, MapPin, Square, Star } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import type { ApplyOverviewData } from '@/lib/apply/page-data';

type ApplyOverviewSectionProps = {
  data: ApplyOverviewData;
};

export default function ApplyOverviewSection({ data }: ApplyOverviewSectionProps) {
  const [tab, setTab] = useState<'details' | 'benefits'>('details');

  return (
    <section className={componentsTheme.applyOverview.sectionWrapper}>
      <div className={componentsTheme.applyOverview.container}>
        <div className={componentsTheme.applyOverview.layoutGrid}>
          <div className={componentsTheme.applyOverview.leftCol}>
            <div className={componentsTheme.applyOverview.leftCard}>
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

              {tab === 'details' && (
                <div className={componentsTheme.applyOverview.detailsContentWrapper}>
                  <div className={componentsTheme.applyOverview.descriptionBlock}>
                    <h3 className={componentsTheme.applyOverview.sectionHeading}>Description</h3>
                    <p>{data.description}</p>
                  </div>

                  <div className={componentsTheme.applyOverview.descriptionBlock}>
                    <h3 className={componentsTheme.applyOverview.sectionHeading}>Requirements</h3>
                    <ul className={componentsTheme.applyOverview.requirementsList}>
                      {data.requirements.length > 0 ? (
                        data.requirements.map((item, idx) => (
                          <li key={`${item}-${idx}`} className={componentsTheme.applyOverview.requirementItem}>
                            <CheckCircle2 className={componentsTheme.applyOverview.requirementIcon} />
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className={componentsTheme.applyOverview.requirementItem}>
                          <CheckCircle2 className={componentsTheme.applyOverview.requirementIcon} />
                          <span>Requirements will be announced by the program team.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {tab === 'benefits' && (
                <div className={componentsTheme.applyOverview.benefitsTabContent}>
                  <ul className={componentsTheme.applyOverview.benefitsList}>
                    {data.benefits.length > 0 ? (
                      data.benefits.map((item, idx) => (
                        <li key={`${item}-${idx}`} className={componentsTheme.applyOverview.benefitsItem}>
                          <Star className={componentsTheme.applyOverview.benefitsIcon} />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className={componentsTheme.applyOverview.benefitsItem}>
                        <Star className={componentsTheme.applyOverview.benefitsIcon} />
                        <span>Benefits will be announced by the program team.</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className={componentsTheme.applyOverview.rightColWrapper}>
            <div className={componentsTheme.applyOverview.rightCard}>
              <div className={componentsTheme.applyOverview.infoList}>
                <div className={componentsTheme.applyOverview.infoRow}>
                  <MapPin className={componentsTheme.applyOverview.infoIcon} />
                  <div>
                    <p className={componentsTheme.applyOverview.infoLabel}>Location</p>
                    <p className={componentsTheme.applyOverview.infoValue}>{data.location}</p>
                  </div>
                </div>

                <div className={componentsTheme.applyOverview.infoGrid}>
                  <div className={componentsTheme.applyOverview.infoRow}>
                    <CalendarDays className={componentsTheme.applyOverview.infoIcon} />
                    <div>
                      <p className={componentsTheme.applyOverview.infoLabel}>Duration</p>
                      <p className={componentsTheme.applyOverview.infoValue}>{data.duration}</p>
                    </div>
                  </div>
                  <div className={componentsTheme.applyOverview.infoRow}>
                    <Square className={componentsTheme.applyOverview.infoIcon} />
                    <div>
                      <p className={componentsTheme.applyOverview.infoLabel}>Program Format</p>
                      <p className={componentsTheme.applyOverview.infoValue}>{data.programFormat}</p>
                    </div>
                  </div>
                </div>

                <div className={componentsTheme.applyOverview.infoRow}>
                  <Calendar className={componentsTheme.applyOverview.infoIcon} />
                  <div>
                    <p className={componentsTheme.applyOverview.infoLabel}>Event Dates</p>
                    <p className={componentsTheme.applyOverview.infoValue}>{data.eventDates}</p>
                  </div>
                </div>
              </div>

              {data.guidebooks.length > 0 && (
                <div className="mt-5 flex flex-col gap-3">
                  {data.guidebooks.map((guidebook, idx) => (
                    <a
                      key={`${guidebook.url}-${idx}`}
                      href={guidebook.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`${
                        idx === 0
                          ? componentsTheme.homeRegistration.guideSecondary
                          : componentsTheme.homeRegistration.guidePrimary
                      } flex w-full items-center justify-center gap-2 text-sm`}
                    >
                      <span>{guidebook.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export type { ApplyOverviewSectionProps };
