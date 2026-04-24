"use client";

import { usePathname } from 'next/navigation';
import Footer from '@/components/sections/Footer';

export default function ClientFooterGate() {
  const pathname = usePathname();
  if (
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/forgot-password') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/verify-email') ||
    pathname?.startsWith('/onboarding') ||
    pathname?.startsWith('/dashboard')
  ) {
    return null;
  }
  return <Footer />;
}
