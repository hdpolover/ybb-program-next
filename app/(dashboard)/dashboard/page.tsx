"use client";

import { useDashboardData } from '@/components/dashboard/DashboardDataContext';
import AmbassadorDashboardSection from '@/components/dashboard/sections/AmbassadorDashboardSection';
import DashboardOverviewSection from '@/components/dashboard/sections/DashboardOverviewSection';
import DashboardPageSkeleton from '@/components/dashboard/ui/DashboardPageSkeleton';

export default function DashboardOverviewPage() {
  const { ambassadorData, isAmbassador, isAmbassadorDataLoading } = useDashboardData();

  if (isAmbassador && !ambassadorData) {
    return <DashboardPageSkeleton variant="ambassador" className="space-y-6" />;
  }

  if (isAmbassadorDataLoading) {
    return <DashboardPageSkeleton variant="overview-summary" className="space-y-6" />;
  }

  if (isAmbassador) {
    return <AmbassadorDashboardSection />;
  }

  return <DashboardOverviewSection />;
}
