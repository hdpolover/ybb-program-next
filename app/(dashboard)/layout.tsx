// app/(dashboard)/layout.tsx
//
// Server-side wrapper around the dashboard's own client layout
// (app/(dashboard)/dashboard/layout.tsx). Runs the brand-mismatch check once,
// before any dashboard chrome renders, so a participant signed in on the
// wrong brand domain never sees this brand's header/sidebar/dashboard flash
// before failing deep inside a page (see lib/server/dashboardBrandGuard.ts).
import { getDashboardBrandGuard } from '@/lib/server/dashboardBrandGuard';
import BrandMismatchState from '@/components/dashboard/BrandMismatchState';

export default async function DashboardBrandGuardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const guard = await getDashboardBrandGuard();

  if (guard.type === 'mismatch') {
    return (
      <BrandMismatchState
        hostBrandName={guard.hostBrandName}
        sessionBrand={guard.sessionBrand}
        registerUrl={guard.registerUrl}
      />
    );
  }

  return <>{children}</>;
}
