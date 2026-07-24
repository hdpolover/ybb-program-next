import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { isRecord } from '@/lib/api/response';
import {
  pickScopedProgramId,
  resolveReferralActive,
  type ReferralAttribution,
} from '@/lib/referral/referralAttribution';

type ActiveRole = 'participant' | 'ambassador';

type RegisteredProgram = {
  programId: string;
  programName: string;
  programSlug: string;
  year?: number;
  applicationId?: string;
  applicationStatus?: string;
};

type AuthMeResponse = {
  statusCode?: number;
  message?: string;
  data?: {
    userId: string;
    email: string;
    brandId?: string;
    programCategoryId?: string;
    identities?: Array<{ provider: string; displayName?: string; lastUsedAt?: string }>;
    participantId?: string;
    registeredPrograms?: RegisteredProgram[];
    isProfileCompleted?: boolean;
    activeRole?: ActiveRole;
    referral?: ReferralAttribution;
  };
};

const NO_REFERRAL_ATTRIBUTION: ReferralAttribution = { active: false, referredByName: null };

/**
 * Resolves ambassador attribution for the referral code (if any) carried in
 * the ybb_referral_code cookie. Best-effort only: any missing cookie, non-ok
 * response, or thrown error falls back to "no attribution" rather than
 * failing the whole /me request — attribution is a nice-to-have UI hint, not
 * something /me should ever break over.
 */
async function resolveReferralAttribution(params: {
  referralCode: string | undefined;
  registeredPrograms: RegisteredProgram[] | undefined;
  accessToken: string;
  brandDomain: string;
}): Promise<ReferralAttribution> {
  const { referralCode, registeredPrograms, accessToken, brandDomain } = params;
  if (!referralCode || referralCode.trim().length === 0) return NO_REFERRAL_ATTRIBUTION;

  try {
    const programId = pickScopedProgramId(registeredPrograms);
    const apiUrl = new URL(
      `/v1/participants/ambassador/referral-attribution/${encodeURIComponent(referralCode)}`,
      getServerApiBaseUrl(),
    );
    if (programId) apiUrl.searchParams.set('programId', programId);

    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });

    if (!res.ok) return NO_REFERRAL_ATTRIBUTION;

    const json = await res.json().catch(() => null);
    const attribution = isRecord(json) && isRecord(json.data) ? json.data : null;
    const referredByName =
      typeof attribution?.referredByName === 'string' ? attribution.referredByName : null;
    const valid = attribution?.valid === true;

    if (!resolveReferralActive({ valid, referredByName })) return NO_REFERRAL_ATTRIBUTION;
    return { active: true, referredByName };
  } catch {
    return NO_REFERRAL_ATTRIBUTION;
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const activeRoleCookie = cookieStore.get('activeRole')?.value;
    const activeRole: ActiveRole | undefined =
      activeRoleCookie === 'ambassador' || activeRoleCookie === 'participant'
        ? activeRoleCookie
        : undefined;
    const referralCodeCookie = cookieStore.get('ybb_referral_code')?.value;
    const includeReferral =
      new URL(request.url).searchParams.get('includeReferral') === '1';

    const brandDomain = resolveBrandDomainFromRequest(request);

    if (!accessToken) {
      return NextResponse.json(
        {
          statusCode: 401,
          message: 'Unauthorized',
          data: null,
        },
        { status: 401 },
      );
    }

    const apiUrl = new URL('/v1/auth/me', getServerApiBaseUrl());
    const res = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });

    const json = (await res.json().catch(() => ({}))) as AuthMeResponse;
    if (!res.ok) {
      return NextResponse.json(
        {
          statusCode: json.statusCode ?? res.status,
          message: json.message ?? 'Failed to fetch profile',
          data: null,
        },
        { status: res.status },
      );
    }

    // Resolving attribution costs a second, sequential backend round-trip (it
    // needs registeredPrograms from the response above to scope the lookup), and
    // /me is fetched on every dashboard mount. Only pay for it when the caller
    // actually renders the "Referred by" chip — currently just onboarding.
    const referral = includeReferral
      ? await resolveReferralAttribution({
          referralCode: referralCodeCookie,
          registeredPrograms: json.data?.registeredPrograms,
          accessToken,
          brandDomain,
        })
      : undefined;

    const data = json.data
      ? { ...json.data, ...(activeRole ? { activeRole } : {}), ...(referral ? { referral } : {}) }
      : null;
    return NextResponse.json({ statusCode: 200, message: 'Success', data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        statusCode: 500,
        message,
        data: null,
      },
      { status: 500 },
    );
  }
}
