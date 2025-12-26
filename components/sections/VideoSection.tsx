'use client';

import { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

type VideoItem = {
  id: string;
  title: string;
  embedUrl: string;
  duration: string;
};

type YearKey = '2025' | '2024';

const videosByYear: Record<YearKey, VideoItem[]> = {
  '2025': [
    {
      id: 'jys-2025-1',
      title:
        'OFFICIAL AFTER MOVIE OF JAPAN YOUTH SUMMIT 2025 - OSAKA by Youth Break the Boundaries',
      embedUrl: 'https://www.youtube.com/embed/4kXjhC9NbaA?rel=0',
      duration: 'JYS 2025 • Highlight video',
    },
    {
      id: 'jys-2025-2',
      title:
        'OFFICIAL WELCOMING VIDEO OF JAPAN YOUTH SUMMIT 2025 - OSAKA by Youth Break the Boundaries',
      embedUrl: 'https://www.youtube.com/embed/Vc_0-stmHNQ?rel=0',
      duration: 'JYS 2025 • Cultural experience',
    },
    {
      id: 'jys-2025-3',
      title: 'Japan Youth Summit 2025 — Day 1 & Day 2 Recap | Osaka, Japan',
      embedUrl: 'https://www.youtube.com/embed/lmXJuz26lQI?rel=0',
      duration: 'JYS 2025 • Collaboration & sessions',
    },
    {
      id: 'jys-2025-4',
      title: 'Welcoming Attendees of 28 Countries for Japan Youth Summit 2025!',
      embedUrl: 'https://www.youtube.com/embed/cjAa7zojwcs?rel=0',
      duration: 'JYS 2025 • Journey & stories',
    },
  ],
  // TODO: Ganti isi 2024 dengan video JYS 2024 asli saat sudah siap
  '2024': [
    {
      id: 'jys-2024-1',
      title: 'Japan Youth Summit 2024 - After Movie',
      embedUrl: 'https://www.youtube.com/embed/cXjitjeimBc?rel=0',
      duration: 'JYS 2024 • Highlight video',
    },
    {
      id: 'jys-2024-2',
      title: 'JAPAN YOUTH SUMMIT 2024 - RECAP VIDEO',
      embedUrl: 'https://www.youtube.com/embed/eYGhT1LGubc?rel=0',
      duration: 'JYS 2024 • Cultural experience',
    },
    {
      id: 'jys-2024-3',
      title: 'JAPAN YOUTH SUMMIT 2024 - OPENING VIDEO',
      embedUrl: 'https://www.youtube.com/embed/W0rjb6SGL10?rel=0',
      duration: 'JYS 2024 • Collaboration & sessions',
    },
    {
      id: 'jys-2024-4',
      title: 'JAPAN YOUTH SUMMIT 2024 - DAY 3',
      embedUrl: 'https://www.youtube.com/embed/sl95b7dUQYM?rel=0',
      duration: 'JYS 2024 • Journey & stories',
    },
  ],
};

export default function VideoSection() {
  const [year, setYear] = useState<YearKey>('2025');
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideos = videosByYear[year];
  const currentVideo = currentVideos[currentIndex];

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
          title="Experience Our Program in Action"
        />
        <p className={jysSectionTheme.videoSection.subtitle}>
          Watch the journey of Japan Youth Summit delegates – from keynote sessions and cultural
          experiences to collaboration and real impact projects in Japan.
        </p>

        <div className={jysSectionTheme.videoSection.inner}>
          {/* Left: main video */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900/10">
              <iframe
                src={currentVideo.embedUrl}
                title={currentVideo.title}
                className={jysSectionTheme.videoSection.mainIframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 sm:text-base">
                  {truncateTitle(currentVideo.title)}
                </p>
                <p className="text-xs text-slate-500">{currentVideo.duration}</p>
              </div>
              <span className={jysSectionTheme.videoSection.badge}>JYS Program {year}</span>
            </div>
          </div>

          {/* Right: playlist list */}
          <div>
            <div className={jysSectionTheme.videoSection.yearTabsWrapper}>
              {(['2025', '2024'] as YearKey[]).map(y => (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    setYear(y);
                    setCurrentIndex(0);
                  }}
                  className={`${jysSectionTheme.videoSection.yearTab} ${
                    year === y ? jysSectionTheme.videoSection.yearTabActive : ''
                  }`}
                >
                  {y}
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
                      <p className={jysSectionTheme.videoSection.listMeta}>{video.duration}</p>
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
