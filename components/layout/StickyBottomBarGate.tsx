'use client';

import { usePathname } from 'next/navigation';
import StickyBottomBar from '@/components/ui/StickyBottomBar';
import { shouldHideRegistrationPrompts } from '@/lib/registration/visibility';

type StickyBottomBarGateProps = {
  deadline?: string | null;
  registerUrl?: string;
  activeProgramSlug?: string | null;
  phase?: 'open' | 'upcoming';
};

export default function StickyBottomBarGate({
  deadline,
  registerUrl,
  activeProgramSlug,
  phase = 'open',
}: StickyBottomBarGateProps) {
  const pathname = usePathname();

  if (shouldHideRegistrationPrompts(pathname, activeProgramSlug)) {
    return null;
  }

  return <StickyBottomBar deadline={deadline} registerUrl={registerUrl || '/login?mode=signup'} phase={phase} />;
}
