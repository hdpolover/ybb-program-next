'use client';

import { usePathname } from 'next/navigation';
import RegistrationCountdown from '@/components/ui/RegistrationCountdown';
import { shouldHideRegistrationPrompts } from '@/lib/registration/visibility';
import { useSelectedEdition } from '@/components/sections/SelectedEditionContext';
import type { EditionCountdown } from '@/lib/registration/deadline';
import type { RegistrationPhase } from '@/lib/registration/status';

type RegistrationCountdownGateProps = {
  registrationDeadline?: string | null;
  activeProgramSlug?: string | null;
  countdownProgramName?: string | null;
  phase?: RegistrationPhase;
  /** One entry per HomeRegistrationStrip tab (empty on a single-program
   * brand, or on a payload cached before editions existed). When the
   * SelectedEditionProvider above this gate carries a matching id, its
   * deadline/name/phase override the brand-wide props above -- that's the
   * MEYS 2026/2027 fix: without this, switching tabs updated the fee cards
   * but left this banner pinned to whichever edition won brand-wide. */
  editionCountdowns?: EditionCountdown[];
};

export default function RegistrationCountdownGate({
  registrationDeadline,
  activeProgramSlug,
  countdownProgramName,
  phase = 'open',
  editionCountdowns,
}: RegistrationCountdownGateProps) {
  const pathname = usePathname();
  const selectedEdition = useSelectedEdition();

  if (shouldHideRegistrationPrompts(pathname, activeProgramSlug)) {
    return null;
  }

  // Registration is closed - the programme's allowRegistration kill switch,
  // or its window has passed. A countdown would invite an action the backend
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
  // brand-wide props exactly as before this fix.
  const deadline = selected ? selected.deadline : registrationDeadline;
  const programName = selected ? selected.programName : countdownProgramName;
  // The selected edition having no open/upcoming window (`selected.phase ===
  // 'closed'`) is handled by the `!deadline` check below, same as the
  // brand-wide no-deadline case -- it must NOT flip the child's phase to
  // 'closed', which RegistrationCountdown doesn't even accept (its phase prop
  // is 'open' | 'upcoming' only, for the clock's own wording).
  const clockPhase = (selected ?? { phase }).phase === 'upcoming' ? 'upcoming' : 'open';

  if (!deadline) {
    return null;
  }

  return <RegistrationCountdown targetDate={deadline} programName={programName} phase={clockPhase} />;
}
