'use client';

import { usePathname } from 'next/navigation';
import StickyBottomBar from '@/components/ui/StickyBottomBar';
import { shouldHideRegistrationPrompts } from '@/lib/registration/visibility';
import type { RegistrationPhase } from '@/lib/registration/status';

type StickyBottomBarGateProps = {
  deadline?: string | null;
  registerUrl?: string;
  activeProgramSlug?: string | null;
  phase?: RegistrationPhase;
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

  // Registration is closed - the programme's allowRegistration kill switch,
  // or its window has passed. A sticky Register bar would invite an action the backend
  // refuses, which is the dead end the navbar CTA used to create too.
  if (phase === 'closed') {
    return null;
  }

  return <StickyBottomBar deadline={deadline} registerUrl={registerUrl || '/login?mode=signup'} phase={phase} />;
}
