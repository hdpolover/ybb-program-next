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

const fallbackTabs: NormalizedTab[] = [
  {
    year: 2025,
    programName: 'Japan Youth Summit 2025',
    videos: [
      {
        id: 'jys-2025-1',
        title:
          'OFFICIAL AFTER MOVIE OF JAPAN YOUTH SUMMIT 2025 - OSAKA by Youth Break the Boundaries',
        description: 'JYS 2025 \u2022 Highlight video',
        thumbnail: 'https://img.youtube.com/vi/4kXjhC9NbaA/maxresdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/4kXjhC9NbaA?rel=0',
      },
      {
        id: 'jys-2025-2',
        title:
          'OFFICIAL WELCOMING VIDEO OF JAPAN YOUTH SUMMIT 2025 - OSAKA by Youth Break the Boundaries',
        description: 'JYS 2025 \u2022 Cultural experience',
        thumbnail: 'https://img.youtube.com/vi/Vc_0-stmHNQ/maxresdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/Vc_0-stmHNQ?rel=0',
      },
      {
        id: 'jys-2025-3',
        title: 'Japan Youth Summit 2025 \u2014 Day 1 & Day 2 Recap | Osaka, Japan',
        description: 'JYS 2025 \u2022 Collaboration & sessions',
        thumbnail: 'https://img.youtube.com/vi/lmXJuz26lQI/maxresdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/lmXJuz26lQI?rel=0',
      },
      {
        id: 'jys-2025-4',
        title: 'Welcoming Attendees of 28 Countries for Japan Youth Summit 2025!',
        description: 'JYS 2025 \u2022 Journey & stories',
        thumbnail: 'https://img.youtube.com/vi/cjAa7zojwcs/maxresdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/cjAa7zojwcs?rel=0',
      },
    ],
  },
  {
    year: 2024,
    programName: 'Japan Youth Summit 2024',
    videos: [
      {
        id: 'jys-2024-1',
        title: 'Japan Youth Summit 2024 - After Movie',
        description: 'JYS 2024 \u2022 Highlight video',
        thumbnail: 'https://img.youtube.com/vi/cXjitjeimBc/maxresdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/cXjitjeimBc?rel=0',
      },
      {
        id: 'jys-2024-2',
        title: 'JAPAN YOUTH SUMMIT 2024 - RECAP VIDEO',
        description: 'JYS 2024 \u2022 Cultural experience',
        thumbnail: 'https://img.youtube.com/vi/eYGhT1LGubc/maxresdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/eYGhT1LGubc?rel=0',
      },
      {
        id: 'jys-2024-3',
        title: 'JAPAN YOUTH SUMMIT 2024 - OPENING VIDEO',
        description: 'JYS 2024 \u2022 Collaboration & sessions',
        thumbnail: 'https://img.youtube.com/vi/W0rjb6SGL10/maxresdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/W0rjb6SGL10?rel=0',
      },
      {
        id: 'jys-2024-4',
        title: 'JAPAN YOUTH SUMMIT 2024 - DAY 3',
        description: 'JYS 2024 \u2022 Journey & stories',
        thumbnail: 'https://img.youtube.com/vi/sl95b7dUQYM/maxresdefault.jpg',
        embedUrl: 'https://www.youtube.com/embed/sl95b7dUQYM?rel=0',
      },
    ],
  },
];

const toEmbedUrl = (videoUrl: string): string => {
  if (!videoUrl) return '';
  // very small helper: https://www.youtube.com/watch?v=ID -> https://www.youtube.com/embed/ID?rel=0
  const watchParam = 'watch?v=';
  const idx = videoUrl.indexOf(watchParam);
  if (idx !== -1) {
    const id = videoUrl.slice(idx + watchParam.length).split('&')[0];
    return `https://www.youtube.com/embed/${id}?rel=0`;
  }
  return videoUrl;
};

const normalizeTabs = (tabs?: ApiVideoTab[]): NormalizedTab[] => {
  if (!tabs || tabs.length === 0) return fallbackTabs;
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
          {/* Left: main video */}
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

          {/* Right: playlist list */}
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
              {/* Coming soon placeholders if less than 4 videos */}
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
