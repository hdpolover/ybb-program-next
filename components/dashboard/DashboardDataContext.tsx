'use client';

import { createContext, useContext } from 'react';
import type { AmbassadorData, AmbassadorReferral, AmbassadorReferralStatus } from '@/lib/dashboard/ambassador';

export type PortalDashboardMoney = {
  amount: number;
  currency: string;
};

export type PortalDashboardStats = {
  applicationsCount: number;
  completedProgramsCount: number;
  certificatesCount: number;
  totalRequired: PortalDashboardMoney;
};

export type PortalDashboardGuidebook = {
  label?: string;
  url?: string;
};

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
    guidebooks?: PortalDashboardGuidebook[];
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
  stats?: PortalDashboardStats;
};

export type AuthMeData = {
  userId: string;
  email: string;
  brandId?: string;
  programCategoryId?: string;
  participantId?: string;
  registeredPrograms?: Array<{
    programId: string;
    programName: string;
    programSlug: string;
    year?: number;
    applicationId?: string;
    applicationStatus?: string;
  }>;
  isProfileCompleted?: boolean;
};

export type ParticipantOnboardingData = {
  profileCompletionPercentage?: number;
  displayName?: string;
  fullName?: string;
  originCity?: string;
  originState?: string;
  originCountry?: string;
};

export type ParticipantMeData = {
  id?: string;
  profileCompletionPercentage?: number;
  displayName?: string;
  fullName?: string;
  profilePictureUrl?: string;
};

export type { AmbassadorData, AmbassadorReferral, AmbassadorReferralStatus };

type DashboardDataContextValue = {
  dashboardSummary: PortalDashboardSummary | null;
  isDashboardSummaryLoading: boolean;
  me: AuthMeData | null;
  onboarding: ParticipantOnboardingData | null;
  participantProfile: ParticipantMeData | null;
  ambassadorData: AmbassadorData | null;
  isAmbassador: boolean;
  isAmbassadorDataLoading: boolean;
};

const DashboardDataContext = createContext<DashboardDataContextValue>({
  dashboardSummary: null,
  isDashboardSummaryLoading: false,
  me: null,
  onboarding: null,
  participantProfile: null,
  ambassadorData: null,
  isAmbassador: false,
  isAmbassadorDataLoading: false,
});

export function DashboardDataProvider({
  dashboardSummary,
  isDashboardSummaryLoading,
  me,
  onboarding,
  participantProfile,
  ambassadorData,
  isAmbassador,
  isAmbassadorDataLoading,
  children,
}: {
  dashboardSummary: PortalDashboardSummary | null;
  isDashboardSummaryLoading: boolean;
  me: AuthMeData | null;
  onboarding: ParticipantOnboardingData | null;
  participantProfile: ParticipantMeData | null;
  ambassadorData: AmbassadorData | null;
  isAmbassador: boolean;
  isAmbassadorDataLoading: boolean;
  children: React.ReactNode;
}) {
  return (
    <DashboardDataContext.Provider
      value={{
        dashboardSummary,
        isDashboardSummaryLoading,
        me,
        onboarding,
        participantProfile,
        ambassadorData,
        isAmbassador,
        isAmbassadorDataLoading,
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  return useContext(DashboardDataContext);
}
