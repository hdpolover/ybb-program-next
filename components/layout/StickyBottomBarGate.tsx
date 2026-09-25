'use client';

import { usePathname } from 'next/navigation';
import StickyBottomBar from '@/components/ui/StickyBottomBar';
import { shouldHideRegistrationPrompts } from '@/lib/registration/visibility';
import { useSelectedEdition } from '@/components/sections/SelectedEditionContext';
import type { EditionCountdown } from '@/lib/registration/deadline';
import type { RegistrationPhase } from '@/lib/registration/status';

type StickyBottomBarGateProps = {
  deadline?: string | null;
  registerUrl?: string;
  activeProgramSlug?: string | null;
  phase?: RegistrationPhase;
  /** See RegistrationCountdownGate's prop of the same name -- same source,
   * same reasoning, so the top banner and this sticky bar can never disagree
   * about which edition is selected. */
  editionCountdowns?: EditionCountdown[];
};

export default function StickyBottomBarGate({
  deadline,
  registerUrl,
  activeProgramSlug,
  phase = 'open',
  editionCountdowns,
}: StickyBottomBarGateProps) {
  const pathname = usePathname();
  const selectedEdition = useSelectedEdition();

  if (shouldHideRegistrationPrompts(pathname, activeProgramSlug)) {
    return null;
  }

  // Registration is closed - the programme's allowRegistration kill switch,
  // or its window has passed. A sticky Register bar would invite an action the backend
  // refuses, which is the dead end the navbar CTA used to create too. This is
  // a BRAND-wide switch and deliberately not overridden by tab selection.
  if (phase === 'closed') {
    return null;
  }

  const selected = editionCountdowns?.find(
    (edition) => edition.programId === selectedEdition?.selectedProgramId,
  );

  // No matching edition (single-program brand, cached payload with no
  // editions, or the id genuinely isn't in the list) falls through to the
  // brand-wide props exactly as before this fix. A selected edition with no
  // open/upcoming window gets a null deadline, which StickyBottomBar already
  // treats as "unmount" -- the same no-deadline behaviour the brand-wide path
  // has always had, rather than showing a sibling edition's clock.
  const effectiveDeadline = selected ? selected.deadline : deadline;
  const effectiveRegisterUrl = selected ? selected.registerUrl : registerUrl;
  const clockPhase = (selected ?? { phase }).phase === 'upcoming' ? 'upcoming' : 'open';

  return (
    <StickyBottomBar
      deadline={effectiveDeadline}
      registerUrl={effectiveRegisterUrl || '/login?mode=signup'}
      phase={clockPhase}
    />
  );
}
