'use client';

import { usePathname } from 'next/navigation';
import RegistrationCountdown from '@/components/ui/RegistrationCountdown';
import { shouldHideRegistrationPrompts } from '@/lib/registration/visibility';
import type { RegistrationPhase } from '@/lib/registration/status';

type RegistrationCountdownGateProps = {
  registrationDeadline?: string | null;
  activeProgramSlug?: string | null;
  countdownProgramName?: string | null;
  phase?: RegistrationPhase;
};

export default function RegistrationCountdownGate({
  registrationDeadline,
  activeProgramSlug,
  countdownProgramName,
  phase = 'open',
}: RegistrationCountdownGateProps) {
  const pathname = usePathname();

  if (shouldHideRegistrationPrompts(pathname, activeProgramSlug)) {
    return null;
  }

  // Registration is closed - the programme's allowRegistration kill switch,
  // or its window has passed. A countdown would invite an action the backend
  // refuses, which is the dead end the navbar CTA used to create too.
  if (phase === 'closed') {
    return null;
  }

  if (!registrationDeadline) {
    return null;
  }

  return <RegistrationCountdown targetDate={registrationDeadline} programName={countdownProgramName} phase={phase} />;
}
