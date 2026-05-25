'use client';

import { usePathname } from 'next/navigation';
import RegistrationCountdown from '@/components/ui/RegistrationCountdown';

type RegistrationCountdownGateProps = {
  registrationDeadline?: string | null;
};

export default function RegistrationCountdownGate({ registrationDeadline }: RegistrationCountdownGateProps) {
  const pathname = usePathname();

  // Sembunyiin countdown klo di halaman yang mulai dari /dashboard
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  // Pake tanggal mockup klo emg gk ada datanya
  const testDate = new Date();
  testDate.setDate(testDate.getDate() + 7); // 7 hari dari hari ini

  const targetDate = registrationDeadline || testDate.toISOString();

  return <RegistrationCountdown targetDate={targetDate} />;
}
