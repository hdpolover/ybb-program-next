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
  const [activeTab, setActiveTab] = useState<'vision' | 'mission'>('vision');

  const imageMain = images?.[0]?.url ?? '/img/programoverview.png';
  const imageSecondary = images?.[1]?.url ?? '/img/bgprogramoverview.png';
  const imageThird = images?.[2]?.url ?? '/img/programoverview.png';

  const isHtmlContent = (value?: string) => {
    if (!value) return false;
    const trimmed = value.trim();
    return trimmed.startsWith('<') && trimmed.includes('</');
  };

  const decodePossiblyEncodedHtml = (value: string): string => {
    if (!value.includes("&lt;")) return value;
    return value
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&amp;/gi, "&");
  };

  const sanitizeRichHtml = (value: string): string => {
    return value
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
      .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
      .replace(/\son\w+="[^"]*"/gi, "")
      .replace(/\son\w+='[^']*'/gi, "")
      .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, "");
  };

  const renderContent = (value?: string) => {
    if (!value) return null;
    if (!isHtmlContent(value)) return <p>{value}</p>;
    const safeHtml = sanitizeRichHtml(decodePossiblyEncodedHtml(value));
    return <div className={componentsTheme.aboutProgram.richText} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
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

            <div className={`hidden sm:block ${componentsTheme.aboutProgram.contentWrapper}`}>
              {renderContent(about)}
            </div>
            <div className={`sm:hidden ${componentsTheme.aboutProgram.contentWrapper} min-h-0`}>
              {renderContent(about)}
            </div>

            {/* Tabs for Vision / Mission */}
            <div className={componentsTheme.aboutProgram.tabContainer}>
              <button
                type="button"
                onClick={() => setActiveTab('vision')}
                className={`${componentsTheme.aboutProgram.tabButtonBase} ${
                  activeTab === 'vision'
                    ? componentsTheme.aboutProgram.tabButtonActive
                    : componentsTheme.aboutProgram.tabButtonInactive
                }`}
              >
                Vision
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mission')}
                className={`${componentsTheme.aboutProgram.tabButtonBase} ${
                  activeTab === 'mission'
                    ? componentsTheme.aboutProgram.tabButtonActive
                    : componentsTheme.aboutProgram.tabButtonInactive
                }`}
              >
                Mission
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
              {activeTab === 'vision' ? renderContent(vision) : renderContent(mission)}
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
            <div>{activeTab === 'vision' ? renderContent(vision) : renderContent(mission)}</div>

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
