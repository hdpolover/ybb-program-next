'use client';

import { useRef, useState, useEffect } from 'react';
import { Pause, Play, VolumeX, Volume2, X } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

export default function RegistrationTutorial() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      try {
        await v.play();
      } catch {}
    } else {
      v.pause();
    }
  };

  const steps = [
    'Open the Japan Youth Summit registration page',
    'Fill in your personal details in the form',
    'Upload supporting documents (if any)',
    'Review all information and submit your application',
    'Save the receipt and check your email for confirmation',
  ];

  return (
    <section className="relative w-full bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader title="Experience Our Program in Action" />
        <p className="text-accent -mt-6 mb-8 text-center text-sm">
          Dive into amazing stories, epic moments, and the global community that’s ready to welcome
          you!
        </p>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {/* Card videonya ( Left ) */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(2,6,23,0.12)] ring-1 ring-slate-900/10">
            <div className="relative">
              <video
                ref={videoRef}
                className="block aspect-video w-full rounded-2xl object-cover"
                playsInline
                // autoplay dimatiin dulu, biar ga langsung jalan
                muted={muted}
                loop
                poster="/img/registrasibanner.png"
                src="/video/tutorialregist_web.mp4"
              />

              {/* Badge pojok kiri */}
              <div className="absolute left-4 top-4">
                <span className="bg-accent/90 text-accent-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow">
                  Video Tutorial
                </span>
              </div>

              {/* Tombol buka modal besar di tengah */}
              {!playing && (
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="absolute inset-0 z-10 grid place-items-center bg-black/0 hover:bg-black/10"
                  aria-label="Open video in modal"
                >
                  <span className="text-accent inline-grid h-14 w-14 place-items-center rounded-full bg-white/90 shadow">
                    <Play className="h-6 w-6" />
                  </span>
                </button>
              )}

              {/* controls dihapus biar simple, fokus ke modal pop-up */}
            </div>
          </div>

          {/* Step Stepnya ( Right ) */}
          <div className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(2,6,23,0.06)] ring-1 ring-slate-900/10">
            <div>
              <h3 className="text-xl font-extrabold text-blue-900">Steps</h3>
              <ol className="mt-4 space-y-3">
                {steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-accent text-accent-foreground mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-6 text-slate-700">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-6">
              <a
                href="#register"
                className="bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal video besar, lengkap dengan timeline/controls */}
      {open && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-5xl" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -right-3 -top-3 z-[71] inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow ring-1 ring-slate-200 hover:bg-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <video
              controls
              className="block w-full rounded-xl"
              poster="/img/registrasibanner.png"
              src="/video/tutorialregist.mp4"
            />
          </div>
        </div>
      )}
    </section>
  );
}
