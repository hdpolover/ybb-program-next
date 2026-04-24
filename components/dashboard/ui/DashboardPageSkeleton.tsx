import { cn } from "@/lib/utils";

type DashboardPageSkeletonVariant =
  | "payments-list"
  | "documents"
  | "submission-read"
  | "submission-edit"
  | "ambassador"
  | "overview-summary"
  | "overview-registration"
  | "overview-program-details"
  | "overview-guidebook"
  | "overview-notification";

interface DashboardPageSkeletonProps {
  variant?: DashboardPageSkeletonVariant;
  className?: string;
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-200/70", className)} aria-hidden="true" />;
}

function PaymentsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SkeletonBlock className="h-28" />
        <SkeletonBlock className="h-28" />
        <SkeletonBlock className="h-28" />
        <SkeletonBlock className="h-28" />
      </div>

      <SkeletonBlock className="h-20" />

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <SkeletonBlock className="h-6 w-52" />
            <SkeletonBlock className="h-4 w-72 max-w-full" />
          </div>
          <div className="flex gap-2">
            <SkeletonBlock className="h-10 w-28" />
            <SkeletonBlock className="h-10 w-44" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <SkeletonBlock className="h-10 w-full" />
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}

function DocumentsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <SkeletonBlock className="h-10 w-24" />
        <SkeletonBlock className="h-10 w-36" />
        <SkeletonBlock className="h-10 w-32" />
        <SkeletonBlock className="h-10 w-28" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <SkeletonBlock className="h-10 w-full" />
        <div className="mt-3 space-y-2">
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </div>

      <div className="space-y-3">
        <SkeletonBlock className="h-7 w-72 max-w-full" />
        <SkeletonBlock className="h-4 w-full" />
      </div>

      <div className="flex flex-wrap gap-2">
        <SkeletonBlock className="h-10 w-24" />
        <SkeletonBlock className="h-10 w-36" />
        <SkeletonBlock className="h-10 w-32" />
        <SkeletonBlock className="h-10 w-28" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <SkeletonBlock className="h-10 w-full" />
        <div className="mt-3 space-y-2">
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
          <SkeletonBlock className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}

function SubmissionReadSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-4 w-24 rounded-md" />
        <SkeletonBlock className="h-4 w-4 rounded-full" />
        <SkeletonBlock className="h-4 w-40 rounded-md" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <SkeletonBlock className="h-9 w-64" />
        <SkeletonBlock className="h-10 w-28" />
      </div>

      <SkeletonBlock className="h-32" />

      <div className="flex flex-wrap gap-2">
        <SkeletonBlock className="h-11 w-36 rounded-full" />
        <SkeletonBlock className="h-11 w-40 rounded-full" />
        <SkeletonBlock className="h-11 w-36 rounded-full" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <SkeletonBlock className="h-6 w-60" />
        <SkeletonBlock className="mt-2 h-4 w-80 max-w-full" />

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-28 md:col-span-2" />
        </div>
      </div>
    </div>
  );
}

function SubmissionEditSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-4 w-24 rounded-md" />
        <SkeletonBlock className="h-4 w-4 rounded-full" />
        <SkeletonBlock className="h-4 w-40 rounded-md" />
      </div>

      <SkeletonBlock className="h-9 w-64" />
      <SkeletonBlock className="h-28" />

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <SkeletonBlock className="h-6 w-52" />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-12" />
          <SkeletonBlock className="h-28 md:col-span-2" />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <SkeletonBlock className="h-11 w-32" />
          <SkeletonBlock className="h-11 w-40" />
        </div>
      </div>
    </div>
  );
}

function AmbassadorSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-64" />
        <SkeletonBlock className="h-4 w-52" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SkeletonBlock className="h-28" />
        <SkeletonBlock className="h-28" />
      </div>

      <SkeletonBlock className="h-36" />
      <SkeletonBlock className="h-24" />
    </div>
  );
}

function OverviewSummarySkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SkeletonBlock className="h-28" />
      <SkeletonBlock className="h-28" />
      <SkeletonBlock className="h-28" />
      <SkeletonBlock className="h-28" />
    </div>
  );
}

function OverviewRegistrationSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <SkeletonBlock className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-3">
          <SkeletonBlock className="h-6 w-64 max-w-full" />
          <SkeletonBlock className="h-4 w-48" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
          <SkeletonBlock className="h-11 w-48" />
        </div>
      </div>
    </div>
  );
}

function OverviewProgramDetailsSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-44" />
          <SkeletonBlock className="h-4 w-72 max-w-full" />
        </div>
        <SkeletonBlock className="h-9 w-24" />
      </div>

      <div className="mt-5 space-y-4">
        <SkeletonBlock className="h-2.5 w-full rounded-full" />
        <SkeletonBlock className="h-6 w-28 rounded-full" />
        <SkeletonBlock className="h-5 w-64 max-w-full" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function OverviewGuidebookSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <SkeletonBlock className="h-4 w-36" />
      <SkeletonBlock className="mt-3 h-6 w-60 max-w-full" />
      <SkeletonBlock className="mt-3 h-4 w-full" />
      <SkeletonBlock className="mt-2 h-4 w-5/6" />

      <div className="mt-5 space-y-3">
        <SkeletonBlock className="h-12" />
        <SkeletonBlock className="h-12" />
      </div>
    </div>
  );
}

function OverviewNotificationSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <SkeletonBlock className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-44" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
          </div>
        </div>
        <SkeletonBlock className="h-10 w-28" />
      </div>
    </div>
  );
}

export default function DashboardPageSkeleton({
  variant = "payments-list",
  className,
}: DashboardPageSkeletonProps) {
  return (
    <section className={className} role="status" aria-live="polite">
      <span className="sr-only">Loading dashboard page...</span>

      {variant === "payments-list" ? <PaymentsListSkeleton /> : null}
      {variant === "documents" ? <DocumentsSkeleton /> : null}
      {variant === "submission-read" ? <SubmissionReadSkeleton /> : null}
      {variant === "submission-edit" ? <SubmissionEditSkeleton /> : null}
      {variant === "ambassador" ? <AmbassadorSkeleton /> : null}
      {variant === "overview-summary" ? <OverviewSummarySkeleton /> : null}
      {variant === "overview-registration" ? <OverviewRegistrationSkeleton /> : null}
      {variant === "overview-program-details" ? <OverviewProgramDetailsSkeleton /> : null}
      {variant === "overview-guidebook" ? <OverviewGuidebookSkeleton /> : null}
      {variant === "overview-notification" ? <OverviewNotificationSkeleton /> : null}
    </section>
  );
}