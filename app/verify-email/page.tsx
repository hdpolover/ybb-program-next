'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmailLegacyRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';

  useEffect(() => {
    const next = token ? `/auth/verify-email?token=${encodeURIComponent(token)}` : '/auth/verify-email';
    router.replace(next);
  }, [router, token]);

  return null;
}
