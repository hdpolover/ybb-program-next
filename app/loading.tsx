export default function Loading() {
  return (
    <main className="bg-slate-50/60">
      <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col gap-10 px-6 py-16 lg:px-8">
        {/* Hero skeleton */}
        <section className="space-y-4 animate-pulse">
          <div className="h-8 w-40 rounded-full bg-slate-200" />
          <div className="h-10 w-3/4 rounded-lg bg-slate-200" />
          <div className="h-4 w-2/3 rounded-lg bg-slate-200" />
        </section>

        {/* Cards / sections skeleton */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="h-56 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-56 rounded-2xl bg-slate-200 animate-pulse" />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
        </section>

        <section className="h-40 rounded-2xl bg-slate-200 animate-pulse" />
      </div>
    </main>
  );
}
