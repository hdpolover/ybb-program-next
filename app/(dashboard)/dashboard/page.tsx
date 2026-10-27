"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '@/components/dashboard/DashboardDataContext';
import AmbassadorDashboardSection from '@/components/dashboard/sections/AmbassadorDashboardSection';
import DashboardOverviewSection from '@/components/dashboard/sections/DashboardOverviewSection';
import DashboardPageSkeleton from '@/components/dashboard/ui/DashboardPageSkeleton';
import { PAY_INTENT_LANDING_PATH, readPayIntent } from '@/lib/checkout/payIntent';

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { ambassadorData, isAmbassador, isAmbassadorDataLoading } = useDashboardData();

  // Sign-in paths all end here; a pending "pick a fee and pay" intent wins.
  useEffect(() => {
    if (!isAmbassador && readPayIntent()) router.replace(PAY_INTENT_LANDING_PATH);
  }, [isAmbassador, router]);

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
