"use client";

import { useDashboardData } from '@/components/dashboard/DashboardDataContext';
import AmbassadorDashboardSection from '@/components/dashboard/sections/AmbassadorDashboardSection';
import DashboardOverviewSection from '@/components/dashboard/sections/DashboardOverviewSection';
import DashboardPageSkeleton from '@/components/dashboard/ui/DashboardPageSkeleton';

export default function DashboardOverviewPage() {
  const { ambassadorData, isAmbassadorDataLoading } = useDashboardData();

  if (isAmbassadorDataLoading) {
    return <DashboardPageSkeleton variant="overview-summary" className="space-y-6" />;
  }

  if (ambassadorData?.isActive) {
    return <AmbassadorDashboardSection />;
  }

  return <DashboardOverviewSection />;
}
