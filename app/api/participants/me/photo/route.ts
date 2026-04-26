import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { resolveBrandDomainFromRequest } from '@/lib/server/envContext';

const baseApi = () =>
  (
    process.env.API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://staging-api.ybbhub.com'
  ).replace(/\/v1\/?$/, '');

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ statusCode: 401, message: 'Unauthorized' }, { status: 401 });
    }

    const brandDomain = resolveBrandDomainFromRequest(request);
    const base = baseApi();

    // Resolve userId, brandId, participantId from the JWT
    const meRes = await fetch(new URL('/v1/auth/me', base).toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      cache: 'no-store',
    });

    const meJson = (await meRes.json().catch(() => ({}))) as Record<string, unknown>;
    const meData = (meJson?.data ?? {}) as Record<string, unknown>;
    const userId = meData.userId as string | undefined;
    const brandId =
      (meData.brandId as string | undefined) || process.env.YBB_BRAND_ID || '';
    const participantId = meData.participantId as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { statusCode: 401, message: 'Cannot resolve user identity' },
        { status: 401 }
      );
    }

    // Parse incoming multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ statusCode: 400, message: 'No file provided' }, { status: 400 });
    }

    // Validate file type client-side already, but double-check here
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { statusCode: 400, message: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Forward file to backend storage service.
    // Node.js undici doesn't properly serialize `File` objects in outgoing FormData,
    // so read the bytes first and attach as a named Blob.
    const fileBytes = await file.arrayBuffer();
    const fileBlob = new Blob([fileBytes], { type: file.type });

    const uploadForm = new FormData();
    uploadForm.append('file', fileBlob, file.name || 'photo');
    uploadForm.append('user_id', userId);
    uploadForm.append('brand_id', brandId);
    uploadForm.append('bucket', 'avatars');
    if (participantId) uploadForm.append('participant_id', participantId);

    const uploadRes = await fetch(new URL('/v1/files/upload', base).toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      body: uploadForm,
    });

    const uploadJson = (await uploadRes.json().catch(() => ({}))) as Record<string, unknown>;

    if (!uploadRes.ok) {
      return NextResponse.json(
        {
          statusCode: uploadRes.status,
          message: (uploadJson?.message as string) ?? 'File upload failed',
        },
        { status: uploadRes.status }
      );
    }

    // The NestJS global interceptor wraps the controller response in { statusCode, data },
    // but the controller itself also returns { data: { file, url, path } },
    // so the actual payload is at uploadJson.data.data
    const outerData = (uploadJson?.data ?? {}) as Record<string, unknown>;
    const uploadData = (outerData?.data ?? outerData) as Record<string, unknown>;
    const fileInfo = (uploadData?.file ?? {}) as Record<string, unknown>;

    let fileUrl = (uploadData.url || fileInfo.url) as string | undefined;
    if (!fileUrl) {
      const fileId = (fileInfo.id ?? fileInfo.file_id) as string | undefined;
      if (fileId) {
        const publicBase = (
          process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.ybbhub.com'
        ).replace(/\/v1\/?$/, '');
        fileUrl = `${publicBase}/v1/files/${fileId}/download`;
      }
    }

    if (!fileUrl) {
      return NextResponse.json(
        { statusCode: 500, message: 'Storage returned no URL', debug: { uploadData } },
        { status: 500 }
      );
    }

    // Persist the new photo URL on the participant profile
    const updateRes = await fetch(new URL('/v1/participants/me', base).toString(), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'x-brand-domain': brandDomain,
      },
      body: JSON.stringify({ profilePictureUrl: fileUrl }),
    });

    if (!updateRes.ok) {
      const updateJson = (await updateRes.json().catch(() => ({}))) as Record<string, unknown>;
      return NextResponse.json(
        {
          statusCode: updateRes.status,
          message: (updateJson?.message as string) ?? 'Profile update failed',
        },
        { status: updateRes.status }
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: 'Profile picture updated',
      data: { profilePictureUrl: fileUrl },
    });
  } catch (error) {
    return NextResponse.json(
      { statusCode: 500, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
