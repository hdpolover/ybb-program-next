'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

type AboutProgramProps = {
  about?: string;
  vision?: string;
  mission?: string;
  images?: { url: string; caption?: string }[];
  backgroundImageUrl?: string;
};

export default function AboutProgram({ about, vision, mission, images, backgroundImageUrl }: AboutProgramProps) {
  const [activeTab, setActiveTab] = useState<'vision' | 'mission'>('vision');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const imageMain = images?.[0]?.url;
  const imageSecondary = images?.[1]?.url;
  const imageThird = images?.[2]?.url;
  const ABOUT_PREVIEW_MAX_CHARS = 520;

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

  const decodedAbout = about ? decodePossiblyEncodedHtml(about) : '';
  const aboutContainsList = /<(ul|ol|li)\b/i.test(decodedAbout);
  const aboutPlainText = decodedAbout
    ? decodedAbout
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
    : '';
  const shouldShowReadMore = aboutPlainText.length > ABOUT_PREVIEW_MAX_CHARS && !aboutContainsList;

  useEffect(() => {
    if (!isAboutModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAboutModalOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isAboutModalOpen]);

  return (
    <section
      className={componentsTheme.aboutProgram.sectionWrapper}
      style={backgroundImageUrl ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : undefined}
    >
      <div className={componentsTheme.aboutProgram.blurTop} />
      <div className={componentsTheme.aboutProgram.blurBottom} />
      <div className={componentsTheme.aboutProgram.container}>
        <div className={componentsTheme.aboutProgram.layoutGrid}>
          {/* Left: Konten dengan Tabs */}
          <div className={componentsTheme.aboutProgram.leftCol}>
            <SectionHeader align="left" eyebrow="Program Overview" title="About Our Program" />

            <div className={componentsTheme.aboutProgram.contentWrapper}>
              <div
                className={shouldShowReadMore ? componentsTheme.aboutProgram.aboutPreviewWrapper : undefined}
              >
                <div
                  className={
                    shouldShowReadMore ? componentsTheme.aboutProgram.contentPreviewClamp : undefined
                  }
                  style={
                    shouldShowReadMore
                      ? {
                          WebkitMaskImage:
                            'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
                          maskImage: 'linear-gradient(to bottom, black 0%, black 72%, transparent 100%)',
                        }
                      : undefined
                  }
                >
                  {renderContent(about)}
                </div>
              </div>
              {shouldShowReadMore && (
                <button
                  type="button"
                  onClick={() => setIsAboutModalOpen(true)}
                  className={componentsTheme.aboutProgram.readMoreButton}
                >
                  Read more
                </button>
              )}
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
                  {imageMain ? (
                    <Image
                      src={imageMain}
                      alt="Japan Youth Summit main program"
                      fill
                      sizes="(min-width:1024px) 420px, 100vw"
                      className={componentsTheme.aboutProgram.collageImage}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/10 rounded-xl" />
                  )}
                </div>

                {/* Dua gambar kecil kanan */}
                <div
                  className={`${componentsTheme.aboutProgram.collageSmallCard} col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto`}
                >
                  {imageSecondary ? (
                    <Image
                      src={imageSecondary}
                      alt="Japan Youth Summit activity"
                      fill
                      sizes="(min-width:1024px) 260px, 50vw"
                      className={componentsTheme.aboutProgram.collageImage}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/10 rounded-xl" />
                  )}
                </div>
                <div
                  className={`${componentsTheme.aboutProgram.collageSmallCard} col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto`}
                >
                  {imageThird ? (
                    <Image
                      src={imageThird}
                      alt="Japan Youth Summit highlight"
                      fill
                      sizes="(min-width:1024px) 260px, 50vw"
                      className={componentsTheme.aboutProgram.collageImage}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/10 rounded-xl" />
                  )}
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

          <div className="mt-6 sm:hidden">
            <div className={componentsTheme.aboutProgram.collageWrapper}>
              <div className={componentsTheme.aboutProgram.collageGrid}>
                <div
                  className={`${componentsTheme.aboutProgram.collageLargeCard} col-start-2 row-start-1 sm:col-start-auto sm:row-start-auto`}
                >
                  {imageMain ? (
                    <Image
                      src={imageMain}
                      alt="Japan Youth Summit main program"
                      fill
                      sizes="100vw"
                      className={componentsTheme.aboutProgram.collageImage}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/10 rounded-xl" />
                  )}
                </div>

                <div
                  className={`${componentsTheme.aboutProgram.collageSmallCard} col-start-1 row-start-1 sm:col-start-auto sm:row-start-auto`}
                >
                  {imageSecondary ? (
                    <Image
                      src={imageSecondary}
                      alt="Japan Youth Summit activity"
                      fill
                      sizes="50vw"
                      className={componentsTheme.aboutProgram.collageImage}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/10 rounded-xl" />
                  )}
                </div>
                <div
                  className={`${componentsTheme.aboutProgram.collageSmallCard} col-start-1 row-start-2 sm:col-start-auto sm:row-start-auto`}
                >
                  {imageThird ? (
                    <Image
                      src={imageThird}
                      alt="Japan Youth Summit highlight"
                      fill
                      sizes="50vw"
                      className={componentsTheme.aboutProgram.collageImage}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-primary/10 rounded-xl" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAboutModalOpen && (
        <div
          className={componentsTheme.aboutProgram.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="About Our Program"
          onClick={() => setIsAboutModalOpen(false)}
        >
          <div className={componentsTheme.aboutProgram.modalCard} onClick={e => e.stopPropagation()}>
            <div className={componentsTheme.aboutProgram.modalHeader}>
              <h3 className={componentsTheme.aboutProgram.modalTitle}>About Our Program</h3>
              <button
                type="button"
                onClick={() => setIsAboutModalOpen(false)}
                className={componentsTheme.aboutProgram.modalCloseButton}
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div className={componentsTheme.aboutProgram.modalBody}>{renderContent(about)}</div>
          </div>
        </div>
      )}
    </section>
  );
}
