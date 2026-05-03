import { NextResponse } from 'next/server';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

type SubmitPartnershipEnquiryBody = {
  brandId?: string;
  programId?: string;
  partnershipType?: string;
  subCategory?: string;
  fullName?: string;
  email?: string;
  whatsappNumber?: string;
  company?: string;
  subject?: string;
  description?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitPartnershipEnquiryBody;

    if (!body?.fullName || !body?.email || !body?.partnershipType) {
      return NextResponse.json(
        { statusCode: 400, message: 'fullName, email, and partnershipType are required', data: null },
        { status: 400 },
      );
    }

    if (!body.brandId && !body.programId) {
      return NextResponse.json(
        { statusCode: 400, message: 'Either brandId or programId is required', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const apiBase = (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com').replace(/\/v1\/?$/, '');
    const apiUrl = new URL('/v1/public/brands/default/partnerships/enquiry', apiBase);

    const response = await fetch(apiUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify({
        brandId: body.brandId,
        programId: body.programId,
        partnershipType: body.partnershipType,
        subCategory: body.subCategory,
        fullName: body.fullName,
        email: body.email,
        whatsappNumber: body.whatsappNumber,
        company: body.company,
        subject: body.subject,
        description: body.description,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        {
          statusCode: (payload as { statusCode?: number })?.statusCode ?? response.status,
          message: (payload as { message?: string })?.message ?? 'Failed to submit enquiry',
          data: null,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      statusCode: 201,
      message: 'Enquiry submitted successfully',
      data: null,
    });
  } catch {
    return NextResponse.json({ statusCode: 500, message: 'Internal Server Error', data: null }, { status: 500 });
  }
}
