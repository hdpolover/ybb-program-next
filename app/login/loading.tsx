export default function LoginLoading() {
  return (
    <div className="fixed inset-0 grid grid-cols-1 overflow-hidden lg:grid-cols-[40%_60%]">
      {/* Left panel skeleton */}
      <div className="relative hidden lg:flex items-center justify-center bg-slate-50 p-6">
        <div className="relative h-[calc(100vh-3rem)] w-full overflow-hidden rounded-[32px] bg-slate-200 animate-pulse" />
      </div>
      
      {/* Right panel skeleton */}
      <div className="flex items-center justify-center px-6 py-10 lg:px-16">
        <div className="w-full px-8 space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 rounded-lg bg-slate-200 animate-pulse" />
            <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <div className="h-3 w-12 rounded bg-slate-200 animate-pulse" />
              <div className="h-12 w-full rounded-xl bg-slate-200 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
              <div className="h-12 w-full rounded-xl bg-slate-200 animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="h-12 w-full rounded-xl bg-slate-300 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
