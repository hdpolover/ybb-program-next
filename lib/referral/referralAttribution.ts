// lib/referral/referralAttribution.ts

export type ReferralAttribution = {
  active: boolean;
  referredByName: string | null;
};

type RegisteredProgramLike = {
  programId?: string;
};

/**
 * Ambassador attribution is only trustworthy when the backend both confirms
 * the code is valid AND returns a name to attribute it to. A `valid: true`
 * with a missing/blank name is treated as "no confident attribution" rather
 * than rendering a blank "Referred by" chip.
 */
export function resolveReferralActive(
  data: { valid?: boolean; referredByName?: string | null } | null | undefined,
): boolean {
  return (
    data?.valid === true &&
    typeof data.referredByName === 'string' &&
    data.referredByName.trim().length > 0
  );
}

/**
 * Scopes referral-code validation to the single program a participant
 * registered for. With zero or multiple registered programs we cannot tell
 * which one the code is meant for, so validation is left unscoped rather
 * than guessing (mirrors the same rule used for referral-code validation
 * during onboarding — see app/onboarding/page.tsx).
 */
export function pickScopedProgramId(
  registeredPrograms: RegisteredProgramLike[] | undefined,
): string | undefined {
  if (!registeredPrograms || registeredPrograms.length !== 1) return undefined;
  return registeredPrograms[0]?.programId;
}
