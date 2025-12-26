'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

const YOUTUBE_EMBED_URL =
  'https://www.youtube.com/embed/q4ieBBM4V30?rel=0&modestbranding=1&playsinline=1';

const REEL_VIDEO_SRCS: string[] = [
  '/video/SaveClip.App_AQM8CTaKHjkC8K6MIseTTv3e2p8qoEL7r_0_gfi0wSa3bSdkl0zBEwts6rXxewKmHwuRWRh9FWz-HlJFWHP8cd9u6tAMf9jptNZXaBA.mp4',
  '/video/SaveClip.App_AQMBaLsDgPx9QZ-EEEfNctaieJHhjQJhKLL3xgumdAYy07fPSXkjgX7VA7rIWkZstvYnqeboAxfWPHzc21GBY6ps0iErGunaaseOyKk.mp4',
  '/video/SaveClip.App_AQMCZl1a0_M81xqyUPV0dhlt7wM16OZk0O5ik7Z5nOTWXgsNTJML8SGqIcPVzWPNNNNuwIA-J2K-zJo3dKBTUptHe0qRvOEOiGPiTBY.mp4',
  '/video/SaveClip.App_AQMcWrYQtIZNMv0lDLIN6foU6Wx8b1Dvnme0VQkFTVe_G9ExUdTmxN8xz6uKtEq-FS2VgCViNjEkEhMXZUvmD_01v40cjKkCUwZ8gbs.mp4',
  '/video/SaveClip.App_AQMreRhPyfjP-9R9L3co-zIg0yznt3G8_fLbnBkajB12m9HuaXiy7oTq88IetosoHy_bBXZ5oxXSbSwr1iQuccYik7T3fvOk-mpREwo.mp4',
  '/video/SaveClip.App_AQNDWWsiddSgss2UjZqf2gJgvTt5U4dEYlZ4m350_QLYneQoSFQnATGVoO3fyG3wBGeHCfHV6M-f2vpqJMnuOnP9XyVRDslvEIzZI4k.mp4',
  '/video/SaveClip.App_AQNIWtV-7kHmpqvx3oQkmFjE_dd8GNeV7BPloOoGnMcQGKo5jCyGhyh_cGhreFYcdHd4MNnjBDcp1lNoh4_VrG0YQ9VvlBLKdHYNQhY.mp4',
  '/video/SaveClip.App_AQNZBdfDaJSPdCvNRrruVBsBaKkPzmFqe4d3EROSR7nAIJIu8d1GAUxtJ4u8ySQfUS6q_emLriWqbTibzWTePC5e9O82SQDkRHmZlZo.mp4',
  '/video/SaveClip.App_AQNobetE9JVBLHcMl0_l4AalmhrGuykWsK_46H3tDH8T2StUZ8q_B8cW2000LAmX6ZbvVUC4rP6ufo0tFowpJdoApa-Ko-uR15GiW3Q.mp4',
  '/video/SaveClip.App_AQNxVal44UBAgILPK_pm5cTRdb3fnOSOogtMKa40fqV0nQVm8xXymJxMwLkYPAAntZIqBWy9tP6izMVnvZEH7YsT1e_moZuVoWucNcw.mp4',
  '/video/SaveClip.App_AQOJgKee4na1A8JXpiiuO2gzm_njcNP8tljDZQBv7Um7wwaJePUVkBsCagItfuU-LO2ecpSsia1TY8MBTAA3wMPr04ueHHzEkrwbboo.mp4',
  '/video/SaveClip.App_AQORmaX00Q-lkNIXPkBJoBJxi6XURLtND5AVwmBPkkzYUbYI6Qs3j-qvnctTV52H-Kjqi-mlTBDOH6iqIGRjGLFynSZTgLn8B6_6sBY.mp4',
  '/video/SaveClip.App_AQOiqi0lvsG3xPkbg5EJYagAFS4__tJ-MMy4U-fn-iRs1LS7uRwwRyMnVKqkSy1P82HME00xuhHy3qvpcpoVnneAR_fAHeEYTGcxnwY.mp4',
  '/video/SaveClip.App_AQOnr8Yxl7g9y7Txuixvs8MTRD6muJN_Obrt_SjLq8rd1cExLrDa4op6q_qHmXAWGcKHhScZjDylNlTVLZ-lNpTO2JUbPiHUrpXXS18.mp4',
  '/video/SaveClip.App_AQOz2nftYmxUBHvUk3peXyOx3s6RLaFTmq9nTrmocCHJt9ZvGGEelTeXDQfVPAgysGKJVU9RGEloBlU1fsqFjHOMmgXmQBdHAx7a5ps.mp4',
  '/video/SaveClip.App_AQOz2nftYmxUBHvUk3peXyOx3s6RLaFTmq9nTrmocCHJt9ZvGGEelTeXDQfVPAgysGKJVU9RGEloBlU1fsqFjHOMmgXmQBdHAx7a5ps (1).mp4',
  '/video/SaveClip.App_AQP46ortMHkodjR4ZsA-KFxcZ2rvqqsZhuUWqoJTdmJoJtvjwTt6JebJFUHw3Yuy_xRTw2ZLRM8RhRqGGw12b8lvAtvGuMMx_j_JoxY.mp4',
  '/video/SaveClip.App_AQP5zwwjDXKpfmphpwYfd0vJjqxF7YUQgte2K2XuR0xK8dYNHoXQOuK-WWvV5LNf46hqZUzBF07JbROJId4N-PHDMeBGL2GhRRpIg4I.mp4',
  '/video/SaveClip.App_AQP6l0MC5PVXX2UEnrpGvdMYXJCmSFfCRGVBpJviNNIUIY4ZujgoZXv0CZ-1Xa7RYlZ7mSBipxcfYM6lJTXJY9l7kAohfIOcpznP36g.mp4',
  '/video/SaveClip.App_AQP6ljMMiH0Tp0gJXKz4frYF8uXfcMV0PEQ1dwSu6nudcWIQd87GW-mAd5wmwmvyfm7192AqNy36tyt9ZgxYkLxdAjfQHh1mUPdIGs0.mp4',
  '/video/SaveClip.App_AQPII1fi4muHAS1a_PyrH6GLYeBoyN9x11YA9HEx6V8Nl_PPK5CGsfdugCDZATE4EiI2CiXD-TCmI78JRwbwBYNgnGV01TwzIEx7RpQ.mp4',
  '/video/SaveClip.App_AQPMTo86rS6VMrDdot_mvDrQLf1hXU9zyfeDvgZfNoxOltrScAnQuXGZ-QbTfiHf-ygM52LrDMl3Ie0jE791ngptAjnVa75AP6COIVs.mp4',
  '/video/SaveClip.App_AQPh8Et86oK-fs8TpPpnFRJFVdju6trsOk6utKT1eK60ZDQ24jdH723h4zRFgSZHGZ_T8fZiv99dMoZsZy4HPoPYEsapuyi2qWa7a00.mp4',
];

const REELS_PAGE_SIZE = 4;

export default function AlumniStoriesSection() {
  const [startIndex, setStartIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  const total = REEL_VIDEO_SRCS.length;
  const visibleReels = REEL_VIDEO_SRCS.slice(startIndex, startIndex + REELS_PAGE_SIZE).concat(
    startIndex + REELS_PAGE_SIZE > total
      ? REEL_VIDEO_SRCS.slice(0, (startIndex + REELS_PAGE_SIZE) % total)
      : []
  );

  const handleNext = () => {
    setStartIndex(prev => (prev + REELS_PAGE_SIZE) % total);
  };

  const handlePrev = () => {
    setStartIndex(prev => (prev - REELS_PAGE_SIZE + total) % total);
  };

  const markLoaded = (src: string) => {
    setLoaded(prev => ({ ...prev, [src]: true }));
  };
  return (
    <section className={jysSectionTheme.alumniStories.sectionWrapper}>
      <div className={jysSectionTheme.alumniStories.card}>
        <SectionHeader eyebrow="Alumni Stories" title="What our Alumni says..." />

        <div className={jysSectionTheme.alumniStories.layoutGrid}>
          {/* Left: main YouTube video */}
          <div>
            <div className={jysSectionTheme.alumniStories.mainVideoWrapper}>
              <iframe
                src={YOUTUBE_EMBED_URL}
                title="Japan Youth Summit alumni testimonial"
                className={jysSectionTheme.alumniStories.mainIframe}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          {/* Right: Instagram-style reels from local video files */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className={jysSectionTheme.alumniStories.reelsTitle}>More alumni moments</p>
              <div className="inline-flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                  aria-label="Previous alumni videos"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                  aria-label="Next alumni videos"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className={jysSectionTheme.alumniStories.reelsGrid}>
              {visibleReels.map(src => (
                <figure key={src} className={jysSectionTheme.alumniStories.reelItem}>
                  {!loaded[src] && <div className={jysSectionTheme.alumniStories.reelSkeleton} />}
                  <video
                    src={src}
                    className={jysSectionTheme.alumniStories.reelVideo}
                    controls
                    playsInline
                    preload="metadata"
                    onLoadedData={() => markLoaded(src)}
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
