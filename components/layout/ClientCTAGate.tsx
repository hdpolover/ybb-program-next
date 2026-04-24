'use client';

import { usePathname } from 'next/navigation';
import { PromoCTASlot } from '@/components/sections/PromoCTAContext';

export default function ClientCTAGate() {
  const pathname = usePathname();
  if (
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/verify-email') ||
    pathname?.startsWith('/onboarding') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/programs') ||
    // Hide CTA on partners detail slug pages, but keep it on main /partners
    (pathname?.startsWith('/partners/') && pathname !== '/partners')
  ) {
    return null;
  }
  return <PromoCTASlot />;
}
