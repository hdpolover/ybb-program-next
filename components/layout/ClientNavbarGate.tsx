'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

export default function ClientNavbarGate() {
  const pathname = usePathname();
  if (pathname?.startsWith('/login') || pathname?.startsWith('/dashboard')) return null;
  return <Navbar />;
}
