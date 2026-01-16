'use client';

import Image from 'next/image';
import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type AboutProgramProps = {
  about?: string;
  vision?: string;
  mission?: string;
};

export default function AboutProgram({ about, vision, mission }: AboutProgramProps) {
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
                  <p>{about}</p>
                </>
              ) : (
                <>
                  <p>
                    <span className={jysSectionTheme.aboutProgram.visionLabel}>Vision.</span>{' '}
                    {vision}
                  </p>
                  <p>
                    <span className={jysSectionTheme.aboutProgram.visionLabel}>Mission.</span>{' '}
                    {mission}
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
