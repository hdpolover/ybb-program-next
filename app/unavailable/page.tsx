// app/unavailable/page.tsx
// Brand-neutral fallback shown by the middleware when no brand resolves for the
// requested domain (see middleware.ts). Intentionally free of brand context.

export default function UnavailablePage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-xl text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-primary">
          Site unavailable
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          This site isn&rsquo;t available
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          We couldn&rsquo;t find a program for this address. The link may be mistyped, or the
          site may not be set up yet. Please double-check the URL or contact the organizer.
        </p>
      </div>
    </main>
  );
}
