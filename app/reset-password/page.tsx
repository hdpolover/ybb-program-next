'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordLegacyRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';

  useEffect(() => {
    const next = token ? `/auth/reset-password?token=${encodeURIComponent(token)}` : '/auth/forgot-password';
    router.replace(next);
  }, [router, token]);

  return null;
}
