export default function MaintenancePage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-xl text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-pink-600">Maintenance</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          We&rsquo;ll be back soon
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Our website is currently undergoing scheduled maintenance. Please check back in a few minutes.
        </p>
      </div>
    </main>
  );
}
