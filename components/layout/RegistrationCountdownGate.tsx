'use client';

import { usePathname } from 'next/navigation';
import RegistrationCountdown from '@/components/ui/RegistrationCountdown';
import { shouldHideRegistrationPrompts } from '@/lib/registration/visibility';

type RegistrationCountdownGateProps = {
  registrationDeadline?: string | null;
  activeProgramSlug?: string | null;
  countdownProgramName?: string | null;
  phase?: 'open' | 'upcoming';
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

  if (!registrationDeadline) {
    return null;
  }

  return <RegistrationCountdown targetDate={registrationDeadline} programName={countdownProgramName} phase={phase} />;
}
