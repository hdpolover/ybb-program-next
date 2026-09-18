// lib/referral/fieldLooksLikeReferral.ts

export type ReferralLikeField = {
  name?: string;
  label?: string;
  validationRules?: Record<string, unknown> | null;
};

/**
 * Dynamic form fields are admin-defined in the DB, so an ambassador referral
 * code field can arrive under any key. Detect it resiliently from the key,
 * the visible label, or an explicit admin `fieldKind` flag, rather than a
 * single rigid key pattern.
 *
 * The token must be a referral *code* token (referralcode / refcode /
 * ambassadorcode / ambassadorreferral), not the bare word "referral" alone:
 * admins also define unrelated "referral source" fields (e.g. "How did you
 * hear about us?", "Referral source detail"), and the bare-word check was
 * classifying those as ambassador-code fields too, corrupting their values
 * on save via the referral-code stripping logic.
 */
export function fieldLooksLikeReferral(field: ReferralLikeField): boolean {
  const kind = (field.validationRules as { fieldKind?: unknown } | null | undefined)?.fieldKind;
  if (typeof kind === 'string' && /referral|ambassador/i.test(kind)) return true;
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const looks = (s: string) =>
    s.includes('referralcode') ||
    s.includes('refcode') ||
    s.includes('ambassadorcode') ||
    s.includes('ambassadorreferral');
  return looks(normalize(field.name ?? '')) || looks(normalize(field.label ?? ''));
}
