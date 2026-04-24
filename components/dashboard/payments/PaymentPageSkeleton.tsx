import { componentsTheme } from '@/lib/theme/components';
import { cn } from '@/lib/utils';

type PaymentPageSkeletonVariant = 'make-payment' | 'payment-detail';

interface PaymentPageSkeletonProps {
  variant?: PaymentPageSkeletonVariant;
}

const paymentsTheme = componentsTheme.dashboardPayments;

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-xl bg-slate-200/70', className)} aria-hidden="true" />;
}

function MakePaymentBodySkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-4">
        <SkeletonBlock className="h-4 w-56" />
        <SkeletonBlock className="mt-3 h-3.5 w-full" />
        <SkeletonBlock className="mt-2 h-3.5 w-2/3" />
      </div>

      <div className="space-y-3">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-4 w-96 max-w-full" />
        <SkeletonBlock className="h-4 w-36" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SkeletonBlock className="h-24" />
        <SkeletonBlock className="h-24" />
      </div>

      <SkeletonBlock className="h-5 w-[min(38rem,100%)]" />

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-5 w-52" />
          <SkeletonBlock className="h-5 w-20" />
        </div>
        <SkeletonBlock className="h-4 w-72 max-w-full" />
        <div className="grid gap-3 sm:grid-cols-2">
          <SkeletonBlock className="h-28" />
          <SkeletonBlock className="h-28" />
        </div>
        <SkeletonBlock className="h-5 w-48" />
        <SkeletonBlock className="h-14" />
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <SkeletonBlock className="h-5 w-44" />
        <SkeletonBlock className="h-16" />
        <SkeletonBlock className="h-14" />
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <SkeletonBlock className="h-5 w-52" />
        <div className="grid gap-3 sm:grid-cols-2">
          <SkeletonBlock className="h-11" />
          <SkeletonBlock className="h-11" />
          <SkeletonBlock className="h-11" />
          <SkeletonBlock className="h-11" />
          <SkeletonBlock className="h-24 sm:col-span-2" />
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <SkeletonBlock className="h-5 w-36" />
        <SkeletonBlock className="h-12" />
        <SkeletonBlock className="h-12" />
      </div>

      <div className="flex justify-end">
        <SkeletonBlock className="h-11 w-44" />
      </div>
    </div>
  );
}

function PaymentDetailBodySkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <SkeletonBlock className="h-5 w-44" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="mt-4 h-36" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="mt-4 h-56" />
          <SkeletonBlock className="mt-4 h-10" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <SkeletonBlock className="h-5 w-28" />
          <SkeletonBlock className="mt-4 h-10" />
          <SkeletonBlock className="mt-3 h-10" />
        </div>
      </div>
    </div>
  );
}

export default function PaymentPageSkeleton({ variant = 'make-payment' }: PaymentPageSkeletonProps) {
  return (
    <section className={paymentsTheme.sectionWrapper} role="status" aria-live="polite">
      <span className="sr-only">Loading payment page...</span>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-4 w-20 rounded-md" />
          <SkeletonBlock className="h-4 w-4 rounded-full" />
          <SkeletonBlock className="h-4 w-32 rounded-md" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <SkeletonBlock className="h-10 w-52" />
          <SkeletonBlock className="h-10 w-40" />
        </div>

        {variant === 'make-payment' ? <MakePaymentBodySkeleton /> : <PaymentDetailBodySkeleton />}
      </div>
    </section>
  );
}
