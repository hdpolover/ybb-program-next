import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getServerApiBaseUrl } from '@/lib/server/apiBaseUrl';
import { getCsrfGuardRejection } from '@/lib/server/bffSecurity';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

type MeResponse = {
  data?: {
    userId?: string;
    brandId?: string;
    participantId?: string;
  };
};

export async function POST(request: Request) {
  try {
    const csrfRejection = getCsrfGuardRejection(request);
    if (csrfRejection) return csrfRejection;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized', data: null }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ statusCode: 400, message: 'No file provided', data: null }, { status: 400 });
    }

    const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
    if (!allowedMime.has(file.type)) {
      return NextResponse.json(
        { statusCode: 400, message: 'Only JPG, PNG, WEBP, or PDF files are allowed', data: null },
        { status: 400 },
      );
    }

    const maxSizeInBytes = 8 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { statusCode: 400, message: 'File size must be 8MB or less', data: null },
        { status: 400 },
      );
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const base = getServerApiBaseUrl();

    const meRes = await fetch(new URL('/v1/auth/me', base).toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });
    const meJson = (await meRes.json().catch(() => null)) as MeResponse | null;
    const meData = meJson?.data;
    const userId = meData?.userId;
    const brandId = meData?.brandId || process.env.YBB_BRAND_ID;
    const participantId = meData?.participantId;

    if (!userId || !brandId) {
      return NextResponse.json(
        { statusCode: 401, message: 'Cannot resolve upload identity', data: null },
        { status: 401 },
      );
    }

    const fileBytes = await file.arrayBuffer();
    const fileBlob = new Blob([fileBytes], { type: file.type });

    const uploadForm = new FormData();
    uploadForm.append('file', fileBlob, file.name || `payment-proof-${Date.now()}`);
    uploadForm.append('user_id', userId);
    uploadForm.append('brand_id', brandId);
    uploadForm.append('bucket', 'documents');
    if (participantId) uploadForm.append('participant_id', participantId);

    const uploadRes = await fetch(new URL('/v1/files/upload', base).toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      body: uploadForm,
    });
    const uploadJson = (await uploadRes.json().catch(() => null)) as
      | {
          message?: string;
          data?: {
            data?: {
              url?: string;
              file?: { id?: string; url?: string; name?: string };
            };
          };
        }
      | null;

    if (!uploadRes.ok) {
      return NextResponse.json(
        { statusCode: uploadRes.status, message: uploadJson?.message ?? 'Upload failed', data: null },
        { status: uploadRes.status },
      );
    }

    const outer = uploadJson?.data;
    const payload =
      outer?.data ??
      (outer as { url?: string; file?: { id?: string; url?: string; name?: string } } | undefined);
    const fileInfo = payload?.file;
    const fileId = fileInfo?.id ?? '';
    let fileUrl = payload?.url ?? fileInfo?.url ?? '';

    if (!fileUrl && fileId) {
      const publicBase = (process.env.NEXT_PUBLIC_API_URL || getServerApiBaseUrl()).replace(/\/v1\/?$/, '');
      fileUrl = `${publicBase}/v1/files/${fileId}/download`;
    }

    if (!fileId || !fileUrl) {
      return NextResponse.json(
        { statusCode: 500, message: 'Storage response is missing file metadata', data: null },
        { status: 500 },
      );
    }

    return NextResponse.json({
      statusCode: 201,
      message: 'Payment proof uploaded',
      data: {
        fileId,
        fileUrl,
        fileName: file.name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { statusCode: 500, message: error instanceof Error ? error.message : 'Internal Server Error', data: null },
      { status: 500 },
    );
  }
}
