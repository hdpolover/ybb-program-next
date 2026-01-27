'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type ApiVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
};

type ApiVideoTab = {
  year: number;
  program_name: string;
  videos: ApiVideo[];
};

type NormalizedVideoItem = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
};

type NormalizedTab = {
  year: number;
  programName: string;
  videos: NormalizedVideoItem[];
};

type ProgramHighlightVideosProps = {
  title?: string;
  subtitle?: string;
  tabs?: ApiVideoTab[];
};

const toEmbedUrl = (videoUrl: string): string => {
  if (!videoUrl) return '';
  // helper kecil aja: ubah URL https://www.youtube.com/watch?v=ID jadi https://www.youtube.com/embed/ID?rel=0
  const watchParam = 'watch?v=';
  const idx = videoUrl.indexOf(watchParam);
  if (idx !== -1) {
    const id = videoUrl.slice(idx + watchParam.length).split('&')[0];
    return `https://www.youtube.com/embed/${id}?rel=0`;
  }
  return videoUrl;
};

const normalizeTabs = (tabs?: ApiVideoTab[]): NormalizedTab[] => {
  if (!tabs || tabs.length === 0) return [];
  return tabs
    .map<NormalizedTab>(tab => ({
      year: tab.year,
      programName: tab.program_name,
      videos: tab.videos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        embedUrl: toEmbedUrl(video.video_url),
      })),
    }))
    .sort((a, b) => b.year - a.year);
};

export default function VideoSection({ title, subtitle, tabs }: ProgramHighlightVideosProps) {
  const normalizedTabs = normalizeTabs(tabs);
  const initialYear = normalizedTabs[0]?.year ?? new Date().getFullYear();
  const [year, setYear] = useState<number>(initialYear);
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeTab =
    normalizedTabs.find(tab => tab.year === year) ?? normalizedTabs[0] ?? undefined;
  const currentVideos = activeTab?.videos ?? [];
  const currentVideo = currentVideos[currentIndex] ?? currentVideos[0];

  const truncateTitle = (title: string, maxWords = 8) => {
    const words = title.split(' ');
    if (words.length <= maxWords) return title;
    return `${words.slice(0, maxWords).join(' ')}...`;
  };

  return (
    <section className={jysSectionTheme.videoSection.sectionWrapper}>
      <div className={jysSectionTheme.videoSection.card}>
        <SectionHeader
          eyebrow="Program Highlights Video"
          title={title ?? 'Experience Our Program in Action'}
        />
        <p className={jysSectionTheme.videoSection.subtitle}>
          {subtitle ??
            'Watch the journey of Japan Youth Summit delegates – from keynote sessions and cultural experiences to collaboration and real impact projects in Japan.'}
        </p>

        <div className={jysSectionTheme.videoSection.inner}>
          {/* Kiri: video utama */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900/10">
              {currentVideo ? (
                <iframe
                  src={currentVideo.embedUrl}
                  title={currentVideo.title}
                  className={jysSectionTheme.videoSection.mainIframe}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                  Video coming soon
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 sm:text-base">
                  {currentVideo ? truncateTitle(currentVideo.title) : 'Video coming soon'}
                </p>
                <p className="text-xs text-slate-500">
                  {currentVideo ? currentVideo.description : 'Stay tuned, video will be added soon.'}
                </p>
              </div>
              <span className={jysSectionTheme.videoSection.badge}>JYS Program {year}</span>
            </div>
          </div>

          {/* Kanan: daftar playlist */}
          <div>
            <div className={jysSectionTheme.videoSection.yearTabsWrapper}>
              {normalizedTabs.map(tab => (
                <button
                  key={tab.year}
                  type="button"
                  onClick={() => {
                    setYear(tab.year);
                    setCurrentIndex(0);
                  }}
                  className={`${jysSectionTheme.videoSection.yearTab} ${
                    year === tab.year ? jysSectionTheme.videoSection.yearTabActive : ''
                  }`}
                >
                  {tab.year}
                </button>
              ))}
            </div>

            <div className={jysSectionTheme.videoSection.listWrapper}>
              {currentVideos.map((video, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`${jysSectionTheme.videoSection.listCard} ${
                      isActive ? jysSectionTheme.videoSection.listCardActive : ''
                    }`}
                  >
                    <div className={jysSectionTheme.videoSection.thumbnailWrapper}>
                      <iframe
                        src={`${video.embedUrl}&mute=1`}
                        title={video.title}
                        className={jysSectionTheme.videoSection.mainIframe}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={jysSectionTheme.videoSection.listTitle}>
                        {truncateTitle(video.title)}
                      </p>
                      <p className={jysSectionTheme.videoSection.listMeta}>{video.description}</p>
                    </div>
                  </button>
                );
              })}
              {/* Placeholder "coming soon" kalau videonya masih kurang dari 4 item */}
              {Array.from({ length: Math.max(0, 4 - currentVideos.length) }).map((_, idx) => (
                <div
                  key={`placeholder-${idx}`}
                  className={`${jysSectionTheme.videoSection.listCard} opacity-60`}
                >
                  <div className={jysSectionTheme.videoSection.thumbnailWrapper}>
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      Video coming soon
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className={jysSectionTheme.videoSection.listTitle}>Coming soon</p>
                    <p className={jysSectionTheme.videoSection.listMeta}>
                      Slot video akan segera diisi.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
