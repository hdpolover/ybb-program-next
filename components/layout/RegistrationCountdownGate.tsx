'use client';

import { usePathname } from 'next/navigation';
import RegistrationCountdown from '@/components/ui/RegistrationCountdown';

type RegistrationCountdownGateProps = {
  registrationDeadline?: string | null;
};

export default function RegistrationCountdownGate({ registrationDeadline }: RegistrationCountdownGateProps) {
  const pathname = usePathname();

  // Sembunyiin countdown klo di halaman yang mulai dari /dashboard atau /onboarding
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/onboarding')) {
    return null;
  }

  // Tanpa deadline beneran, jangan tampilin countdown palsu. Biar konsisten
  // sama StickyBottomBar yang juga sembunyi kalau gk ada tanggalnya.
  if (!registrationDeadline) {
    return null;
  }

  return <RegistrationCountdown targetDate={registrationDeadline} />;
}
