'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { componentsTheme } from '@/lib/theme/components';

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
  thumbnailUrl: string;
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

const extractYouTubeId = (videoUrl: string): string => {
  if (!videoUrl) return '';
  const watchParam = 'watch?v=';
  const idx = videoUrl.indexOf(watchParam);
  if (idx !== -1) return videoUrl.slice(idx + watchParam.length).split('&')[0];
  // handle youtu.be/ID
  const shortIdx = videoUrl.indexOf('youtu.be/');
  if (shortIdx !== -1) return videoUrl.slice(shortIdx + 9).split('?')[0];
  return '';
};

const toEmbedUrl = (videoUrl: string): string => {
  const id = extractYouTubeId(videoUrl);
  if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
  return videoUrl;
};

const toThumbnailUrl = (videoUrl: string): string => {
  const id = extractYouTubeId(videoUrl);
  if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  return '';
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
        thumbnailUrl: video.thumbnail?.trim() || toThumbnailUrl(video.video_url),
      })),
    }))
    .sort((a, b) => b.year - a.year);
};

export default function VideoSection({ title, subtitle, tabs }: ProgramHighlightVideosProps) {
  if (!tabs || tabs.length === 0) return null;

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
    <section className={componentsTheme.videoSection.sectionWrapper}>
      <div className={componentsTheme.videoSection.card}>
        <SectionHeader
          eyebrow="Program Highlights Video"
          title={title ?? 'Experience Our Program in Action'}
        />
        <p className={componentsTheme.videoSection.subtitle}>
          {subtitle ??
            'Watch the journey of Japan Youth Summit delegates – from keynote sessions and cultural experiences to collaboration and real impact projects in Japan.'}
        </p>

        <div className={componentsTheme.videoSection.inner}>
          {/* Kiri: video utama */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900/10">
              {currentVideo ? (
                <iframe
                  src={currentVideo.embedUrl}
                  title={currentVideo.title}
                  className={componentsTheme.videoSection.mainIframe}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
                  Video coming soon
                </div>
              )}
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 sm:text-base">
                  {currentVideo ? truncateTitle(currentVideo.title) : 'Video coming soon'}
                </p>
                <p className="text-xs text-slate-500">
                  {currentVideo ? currentVideo.description : 'Stay tuned, video will be added soon.'}
                </p>
              </div>
              <span className={`${componentsTheme.videoSection.badge} shrink-0`}>Program {year}</span>
            </div>
          </div>

          {/* Kanan: daftar playlist */}
          <div>
            <div className={componentsTheme.videoSection.yearTabsWrapper}>
              {normalizedTabs.map(tab => (
                <button
                  key={tab.year}
                  type="button"
                  onClick={() => {
                    setYear(tab.year);
                    setCurrentIndex(0);
                  }}
                  className={`${componentsTheme.videoSection.yearTab} ${
                    year === tab.year ? componentsTheme.videoSection.yearTabActive : ''
                  }`}
                >
                  {tab.year}
                </button>
              ))}
            </div>

            <div className={componentsTheme.videoSection.listWrapper}>
              {currentVideos.map((video, index) => {
                const isActive = index === currentIndex;
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`${componentsTheme.videoSection.listCard} ${
                      isActive ? componentsTheme.videoSection.listCardActive : ''
                    }`}
                  >
                    <div className={componentsTheme.videoSection.thumbnailWrapper}>
                      {video.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xs text-slate-400">
                          No preview
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={componentsTheme.videoSection.listTitle}>
                        {truncateTitle(video.title)}
                      </p>
                      <p className={componentsTheme.videoSection.listMeta}>{video.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
