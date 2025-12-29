"use client";

import { usePathname } from 'next/navigation';
import Footer from '@/components/sections/Footer';

export default function ClientFooterGate() {
  const pathname = usePathname();
  if (pathname?.startsWith('/login') || pathname?.startsWith('/dashboard')) return null;
  return <Footer />;
}
