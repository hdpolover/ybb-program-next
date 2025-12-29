'use client';

import Image from 'next/image';
import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

export default function AboutProgram() {
  const [activeTab, setActiveTab] = useState<'about' | 'vision'>('about');

  const imageMain = '/img/jysprogram.png';
  const imageSecondary = '/img/jysprogram1.jpg';
  const imageThird = '/img/programoverview.png';

  return (
    <section className={jysSectionTheme.aboutProgram.sectionWrapper}>
      <div className={jysSectionTheme.aboutProgram.blurTop} />
      <div className={jysSectionTheme.aboutProgram.blurBottom} />
      <div className={jysSectionTheme.aboutProgram.container}>
        <div className={jysSectionTheme.aboutProgram.layoutGrid}>
          {/* Left: Konten dengan Tabs */}
          <div className={jysSectionTheme.aboutProgram.leftCol}>
            <SectionHeader align="left" eyebrow="Program Overview" title="About Our Program" />

            {/* Tabs */}
            <div className={jysSectionTheme.aboutProgram.tabContainer}>
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`${jysSectionTheme.aboutProgram.tabButtonBase} ${
                  activeTab === 'about'
                    ? jysSectionTheme.aboutProgram.tabButtonActive
                    : jysSectionTheme.aboutProgram.tabButtonInactive
                }`}
              >
                About Us
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vision')}
                className={`${jysSectionTheme.aboutProgram.tabButtonBase} ${
                  activeTab === 'vision'
                    ? jysSectionTheme.aboutProgram.tabButtonActive
                    : jysSectionTheme.aboutProgram.tabButtonInactive
                }`}
              >
                Vision &amp; Mission
              </button>
            </div>

            <div className={jysSectionTheme.aboutProgram.contentWrapper}>
              {activeTab === 'about' ? (
                <>
                  <p>
                    Japan Youth Summit (by the Youth Break the Boundaries Foundation) is an
                    international youth summit and innovation competition that brings together
                    emerging leaders from around the world. Participants collaborate on real impact
                    projects and share ideas across culture and disciplines.
                  </p>
                  <p>
                    The program is designed for young people who want to sharpen their leadership,
                    expand their global network, and contribute to solutions for the Sustainable
                    Development Goals (SDGs). Throughout the summit, delegates join keynote
                    sessions, workshops, and collaborative activities in Japan.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className={jysSectionTheme.aboutProgram.visionLabel}>Vision.</span> To
                    empower a generation of young leaders who are ready to champion innovation,
                    collaboration, and sustainable impact on a global scale.
                  </p>
                  <p>
                    <span className={jysSectionTheme.aboutProgram.visionLabel}>Mission.</span> Japan
                    Youth Summit creates a space where youth can explore global issues through the
                    SDGs, design concrete initiatives in education, economy, infrastructure, cities,
                    and climate, and grow long-term collaboration with mentors and institutions from
                    different countries. Together, these pillars invite every delegate to align
                    their personal journey with a bigger global impact story.
                  </p>
                </>
              )}
            </div>

            <div className={jysSectionTheme.aboutProgram.ctaWrapper}>
              <a
                href="/apply"
                className={`${jysSectionTheme.aboutProgram.ctaButton} w-full justify-center`}
              >
                I Want To Join
              </a>
            </div>
          </div>

          {/* Right: Kolase Gambar */}
          <div className={jysSectionTheme.aboutProgram.rightCol}>
            <div className={jysSectionTheme.aboutProgram.collageWrapper}>
              <div className={jysSectionTheme.aboutProgram.collageGrid}>
                {/* Gambar besar kiri */}
                <div className={jysSectionTheme.aboutProgram.collageLargeCard}>
                  <Image
                    src={imageMain}
                    alt="Japan Youth Summit main program"
                    fill
                    sizes="(min-width:1024px) 420px, 100vw"
                    className={jysSectionTheme.aboutProgram.collageImage}
                  />
                </div>

                {/* Dua gambar kecil kanan */}
                <div className={jysSectionTheme.aboutProgram.collageSmallCard}>
                  <Image
                    src={imageSecondary}
                    alt="Japan Youth Summit activity"
                    fill
                    sizes="(min-width:1024px) 260px, 50vw"
                    className={jysSectionTheme.aboutProgram.collageImage}
                  />
                </div>
                <div className={jysSectionTheme.aboutProgram.collageSmallCard}>
                  <Image
                    src={imageThird}
                    alt="Japan Youth Summit highlight"
                    fill
                    sizes="(min-width:1024px) 260px, 50vw"
                    className={jysSectionTheme.aboutProgram.collageImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
