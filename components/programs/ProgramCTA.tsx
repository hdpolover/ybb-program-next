import { PROGRAMS_CTA_COPY } from '@/data/programs/sections/cta/programsCTA';

export default function ProgramCTA() {
  return (
    <section className="relative w-full overflow-hidden bg-[url('/img/programregist.png')] bg-cover bg-center bg-no-repeat py-12 text-[#172554] sm:py-16 lg:py-20">
      {/* Shape buat background */}
      <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      <div className="bg-accent/20 pointer-events-none absolute bottom-0 left-1/4 h-32 w-32 rounded-full blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* Isi konten sectionnya */}
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            {PROGRAMS_CTA_COPY.title}
          </h2>
          <p className="text-white-200 mt-4 max-w-xl">
            {PROGRAMS_CTA_COPY.body}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={PROGRAMS_CTA_COPY.primaryCta.href}
              className="hover:bg-accent/90 inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              {PROGRAMS_CTA_COPY.primaryCta.label}
            </a>
          </div>
        </div>

        {/* Right side: video guideline */}
        <div className="relative z-10 flex flex-col">
          <div className="rounded-2xl bg-white/95 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.45)] ring-1 ring-slate-200/70">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/5">
              <iframe
                src={PROGRAMS_CTA_COPY.video.src}
                title={PROGRAMS_CTA_COPY.video.title}
                className="absolute inset-0 h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="mt-3">
              <h3 className="text-base font-semibold text-blue-950">
                {PROGRAMS_CTA_COPY.video.heading}
              </h3>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                {PROGRAMS_CTA_COPY.video.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
