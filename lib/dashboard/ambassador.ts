import { isRecord } from '@/lib/api/response';

export type AmbassadorReferralStatus =
  | 'referred'
  | 'registered'
  | 'applied'
  | 'accepted'
  | 'completed';

export type AmbassadorReferral = {
  id: string;
  participantId: string;
  participantName: string;
  status: AmbassadorReferralStatus;
  referredAt: string;
  registeredAt?: string;
  appliedAt?: string;
  acceptedAt?: string;
  completedAt?: string;
  daysToRegister?: number;
  daysToApply?: number;
  daysToAccept?: number;
  totalConversionDays?: number;
};

export type AmbassadorData = {
  id: string;
  referralCode: string;
  shareLink: string;
  totalReferrals: number;
  successfulReferrals: number;
  isActive: boolean;
  programName: string;
  referrals: AmbassadorReferral[];
};

function toOptionalDate(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function toReferralStatus(value: unknown): AmbassadorReferralStatus | null {
  return value === 'referred' ||
    value === 'registered' ||
    value === 'applied' ||
    value === 'accepted' ||
    value === 'completed'
    ? value
    : null;
}

function toAmbassadorReferral(value: unknown): AmbassadorReferral | null {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' ? value.id : null;
  const participantId = typeof value.participantId === 'string' ? value.participantId : null;
  const participantName =
    typeof value.participantName === 'string' && value.participantName.trim().length > 0
      ? value.participantName.trim()
      : null;
  const status = toReferralStatus(value.status);
  const referredAt = typeof value.referredAt === 'string' ? value.referredAt : null;

  if (!id || !participantId || !participantName || !status || !referredAt) {
    return null;
  }

  return {
    id,
    participantId,
    participantName,
    status,
    referredAt,
    registeredAt: toOptionalDate(value.registeredAt),
    appliedAt: toOptionalDate(value.appliedAt),
    acceptedAt: toOptionalDate(value.acceptedAt),
    completedAt: toOptionalDate(value.completedAt),
    daysToRegister: toOptionalNumber(value.daysToRegister),
    daysToApply: toOptionalNumber(value.daysToApply),
    daysToAccept: toOptionalNumber(value.daysToAccept),
    totalConversionDays: toOptionalNumber(value.totalConversionDays),
  };
}

export function toAmbassadorData(payload: unknown): AmbassadorData | null {
  if (!isRecord(payload)) return null;

  const id = typeof payload.id === 'string' ? payload.id : null;
  const referralCode = typeof payload.referralCode === 'string' ? payload.referralCode : null;
  const shareLink = typeof payload.shareLink === 'string' ? payload.shareLink : null;
  const totalReferrals =
    typeof payload.totalReferrals === 'number' && Number.isFinite(payload.totalReferrals)
      ? payload.totalReferrals
      : null;
  const successfulReferrals =
    typeof payload.successfulReferrals === 'number' && Number.isFinite(payload.successfulReferrals)
      ? payload.successfulReferrals
      : null;
  const isActive = typeof payload.isActive === 'boolean' ? payload.isActive : null;
  const programName = typeof payload.programName === 'string' ? payload.programName : null;
  const referrals = Array.isArray(payload.referrals)
    ? payload.referrals.map(toAmbassadorReferral).filter((value): value is AmbassadorReferral => value !== null)
    : [];

  if (
    !id ||
    !referralCode ||
    !shareLink ||
    totalReferrals === null ||
    successfulReferrals === null ||
    isActive === null ||
    !programName
  ) {
    return null;
  }

  return {
    id,
    referralCode,
    shareLink,
    totalReferrals,
    successfulReferrals,
    isActive,
    programName,
    referrals,
  };
}
