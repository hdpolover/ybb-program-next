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

type DashboardDataContextValue = {
  dashboardSummary: PortalDashboardSummary | null;
  me: AuthMeData | null;
  onboarding: ParticipantOnboardingData | null;
  participantProfile: ParticipantMeData | null;
};

const DashboardDataContext = createContext<DashboardDataContextValue>({
  dashboardSummary: null,
  me: null,
  onboarding: null,
  participantProfile: null,
});

export function DashboardDataProvider({
  dashboardSummary,
  me,
  onboarding,
  participantProfile,
  children,
}: {
  dashboardSummary: PortalDashboardSummary | null;
  me: AuthMeData | null;
  onboarding: ParticipantOnboardingData | null;
  participantProfile: ParticipantMeData | null;
  children: React.ReactNode;
}) {
  return (
    <DashboardDataContext.Provider value={{ dashboardSummary, me, onboarding, participantProfile }}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  return useContext(DashboardDataContext);
}
