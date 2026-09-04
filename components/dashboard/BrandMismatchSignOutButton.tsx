// components/dashboard/BrandMismatchSignOutButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

// Same sign-out call UserMenuPopover uses (POST /api/auth/logout, then
// /login) — deliberately NOT automatic. A brand mismatch is a presentation
// dead end, not a security event; only the participant's own click should
// ever end their session.
export default function BrandMismatchSignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      size="lg"
      className="min-w-[160px]"
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
