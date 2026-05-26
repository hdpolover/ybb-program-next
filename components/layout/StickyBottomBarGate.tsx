'use client';

import { usePathname } from 'next/navigation';
import StickyBottomBar from '@/components/ui/StickyBottomBar';

type StickyBottomBarGateProps = {
  deadline?: string | null;
  registerUrl?: string;
};

export default function StickyBottomBarGate({ deadline, registerUrl }: StickyBottomBarGateProps) {
  const pathname = usePathname();

  // Hide on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return <StickyBottomBar deadline={deadline} registerUrl={registerUrl || '/register'} />;
}
