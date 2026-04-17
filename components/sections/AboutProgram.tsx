'use client';

import Image from 'next/image';
import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

type AboutProgramProps = {
  about?: string;
  vision?: string;
  mission?: string;
  images?: { url: string; caption?: string }[];
};

export default function AboutProgram({ about, vision, mission, images }: AboutProgramProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'vision'>('about');

  const imageMain = images?.[0]?.url ?? '/img/program-overview-1.png';
  const imageSecondary = images?.[1]?.url ?? '/img/program-overview-2.png';
  const imageThird = images?.[2]?.url ?? '/img/programoverview.png';

  const isHtmlContent = (value?: string) => {
    if (!value) return false;
    const trimmed = value.trim();
    return trimmed.startsWith('<') && trimmed.includes('</');
  };

  return (
    <section className={componentsTheme.aboutProgram.sectionWrapper}>
      <div className={componentsTheme.aboutProgram.blurTop} />
      <div className={componentsTheme.aboutProgram.blurBottom} />
      <div className={componentsTheme.aboutProgram.container}>
        <div className={componentsTheme.aboutProgram.layoutGrid}>
          {/* Left: Konten dengan Tabs */}
          <div className={componentsTheme.aboutProgram.leftCol}>
            <SectionHeader align="left" eyebrow="Program Overview" title="About Our Program" />

            {/* Tabs */}
            <div className={componentsTheme.aboutProgram.tabContainer}>
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`${componentsTheme.aboutProgram.tabButtonBase} ${
                  activeTab === 'about'
                    ? componentsTheme.aboutProgram.tabButtonActive
                    : componentsTheme.aboutProgram.tabButtonInactive
                }`}
              >
                About Us
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vision')}
                className={`${componentsTheme.aboutProgram.tabButtonBase} ${
                  activeTab === 'vision'
                    ? componentsTheme.aboutProgram.tabButtonActive
                    : componentsTheme.aboutProgram.tabButtonInactive
                }`}
              >
                Vision &amp; Mission
              </button>
            </div>

            <div className="mt-6 sm:hidden">
              <div className={componentsTheme.aboutProgram.collageWrapper}>
                <div className={componentsTheme.aboutProgram.collageGrid}>
                  <div
                    className={`${componentsTheme.aboutProgram.collageLargeCard} col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto`}
                  >
                    <Image
                      src={imageMain}
                      alt="Japan Youth Summit main program"
                      fill
                      sizes="100vw"
                      className={componentsTheme.aboutProgram.collageImage}
                    />
                  </div>

                  <div
                    className={`${componentsTheme.aboutProgram.collageSmallCard} col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto`}
                  >
                    <Image
                      src={imageSecondary}
                      alt="Japan Youth Summit activity"
                      fill
                      sizes="50vw"
                      className={componentsTheme.aboutProgram.collageImage}
                    />
                  </div>
                  <div
                    className={`${componentsTheme.aboutProgram.collageSmallCard} col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto`}
                  >
                    <Image
                      src={imageThird}
                      alt="Japan Youth Summit highlight"
                      fill
                      sizes="50vw"
                      className={componentsTheme.aboutProgram.collageImage}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`hidden sm:block ${componentsTheme.aboutProgram.contentWrapper}`}>
              {activeTab === 'about' ? (
                <>
                  {isHtmlContent(about) ? (
                    <div
                      className={componentsTheme.aboutProgram.richText}
                      dangerouslySetInnerHTML={{ __html: about ?? '' }}
                    />
                  ) : (
                    <p>{about}</p>
                  )}
                </>
              ) : (
                <>
                  {isHtmlContent(vision) ? (
                    <div
                      className={componentsTheme.aboutProgram.richText}
                      dangerouslySetInnerHTML={{ __html: vision ?? '' }}
                    />
                  ) : (
                    <p>
                      <span className={componentsTheme.aboutProgram.visionLabel}>Vision.</span>{' '}
                      {vision}
                    </p>
                  )}
                  {isHtmlContent(mission) ? (
                    <div
                      className={componentsTheme.aboutProgram.richText}
                      dangerouslySetInnerHTML={{ __html: mission ?? '' }}
                    />
                  ) : (
                    <p>
                      <span className={componentsTheme.aboutProgram.visionLabel}>Mission.</span>{' '}
                      {mission}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className={`hidden sm:block ${componentsTheme.aboutProgram.ctaWrapper}`}>
              <a
                href="/apply"
                className={`${componentsTheme.aboutProgram.ctaButton} w-full justify-center`}
              >
                I Want To Join
              </a>
            </div>
          </div>

          {/* Right: Kolase Gambar */}
          <div className={`hidden sm:flex ${componentsTheme.aboutProgram.rightCol}`}>
            <div className={componentsTheme.aboutProgram.collageWrapper}>
              <div className={componentsTheme.aboutProgram.collageGrid}>
                {/* Gambar besar kiri */}
                <div
                  className={`${componentsTheme.aboutProgram.collageLargeCard} col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto`}
                >
                  <Image
                    src={imageMain}
                    alt="Japan Youth Summit main program"
                    fill
                    sizes="(min-width:1024px) 420px, 100vw"
                    className={componentsTheme.aboutProgram.collageImage}
                  />
                </div>

                {/* Dua gambar kecil kanan */}
                <div
                  className={`${componentsTheme.aboutProgram.collageSmallCard} col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto`}
                >
                  <Image
                    src={imageSecondary}
                    alt="Japan Youth Summit activity"
                    fill
                    sizes="(min-width:1024px) 260px, 50vw"
                    className={componentsTheme.aboutProgram.collageImage}
                  />
                </div>
                <div
                  className={`${componentsTheme.aboutProgram.collageSmallCard} col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto`}
                >
                  <Image
                    src={imageThird}
                    alt="Japan Youth Summit highlight"
                    fill
                    sizes="(min-width:1024px) 260px, 50vw"
                    className={componentsTheme.aboutProgram.collageImage}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`sm:hidden ${componentsTheme.aboutProgram.contentWrapper}`}>
            {activeTab === 'about' ? (
              <>
                {isHtmlContent(about) ? (
                  <div
                    className={componentsTheme.aboutProgram.richText}
                    dangerouslySetInnerHTML={{ __html: about ?? '' }}
                  />
                ) : (
                  <p>{about}</p>
                )}
              </>
            ) : (
              <>
                {isHtmlContent(vision) ? (
                  <div
                    className={componentsTheme.aboutProgram.richText}
                    dangerouslySetInnerHTML={{ __html: vision ?? '' }}
                  />
                ) : (
                  <p>
                    <span className={componentsTheme.aboutProgram.visionLabel}>Vision.</span>{' '}
                    {vision}
                  </p>
                )}
                {isHtmlContent(mission) ? (
                  <div
                    className={componentsTheme.aboutProgram.richText}
                    dangerouslySetInnerHTML={{ __html: mission ?? '' }}
                  />
                ) : (
                  <p>
                    <span className={componentsTheme.aboutProgram.visionLabel}>Mission.</span>{' '}
                    {mission}
                  </p>
                )}
              </>
            )}

            <div className={componentsTheme.aboutProgram.ctaWrapper}>
              <a
                href="/apply"
                className={`${componentsTheme.aboutProgram.ctaButton} w-full justify-center`}
              >
                I Want To Join
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
