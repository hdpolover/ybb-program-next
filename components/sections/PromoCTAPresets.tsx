import React from 'react';
import PromoCTA from './PromoCTA';
import ProgramsFurtherInformationSection from '@/components/programs/ProgramsFurtherInformation';

export function getCTAPreset(pathname: string | null | undefined) {
  const p = pathname || '/';
  // Order matters: match most specific first
  if (p.startsWith('/apply/fully-funded') || p.startsWith('/apply/self-funded')) {
    return <ProgramsFurtherInformationSection />;
  }
  if (p.startsWith('/programs')) {
    return (
      <section className="relative w-full overflow-hidden bg-[url('/img/bg3strip.png')] bg-cover bg-center py-12 text-white sm:py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Ready to join the next cohort?
          </h2>
          <p className="mt-3 max-w-2xl text-white/90">
            Register for upcoming programs or explore more opportunities tailored for youth leaders.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/login"
              className="hover:bg-accent/90 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition"
            >
              Register Now
            </a>
            <a
              href="/programs"
              className="rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              See All Programs
            </a>
          </div>
        </div>
      </section>
    );
  }
  if (p.startsWith('/insights')) {
    return (
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-accent to-fuchsia-600 py-12 text-white sm:py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Get the latest insights
          </h2>
          <p className="mt-3 max-w-2xl text-white/90">
            Stay ahead with analytics, stories, and learnings from our community.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/insights"
              className="hover:bg-accent/5 rounded-md bg-white px-5 py-3 text-sm font-semibold text-accent shadow-sm transition"
            >
              Browse Insights
            </a>
            <a
              href="/programs"
              className="rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              See Programs
            </a>
          </div>
        </div>
      </section>
    );
  }
  // Default fallback
  return <PromoCTA />;
}
