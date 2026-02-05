'use client';

import { createContext, useContext } from 'react';

export type PortalDashboardSummary = {
  greeting?: string;
  activeApplication?: {
    id?: string;
    programName?: string;
    status?: string;
    category?: string;
    canSwitchCategory?: boolean;
    progress?: number;
    currentStep?: string;
    daysUntilDeadline?: number;
  };
  alerts?: Array<{
    id?: string;
    type?: string;
    title?: string;
    message?: string;
    actionLabel?: string;
    actionUrl?: string;
  }>;
  recentAnnouncements?: Array<{
    id?: string;
    title?: string;
    preview?: string;
    date?: string;
    isRead?: boolean;
  }>;
  stats?: Record<string, unknown>;
};

type DashboardDataContextValue = {
  dashboardSummary: PortalDashboardSummary | null;
};

const DashboardDataContext = createContext<DashboardDataContextValue>({ dashboardSummary: null });

export function DashboardDataProvider({
  dashboardSummary,
  children,
}: {
  dashboardSummary: PortalDashboardSummary | null;
  children: React.ReactNode;
}) {
  return (
    <DashboardDataContext.Provider value={{ dashboardSummary }}>{children}</DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  return useContext(DashboardDataContext);
}
