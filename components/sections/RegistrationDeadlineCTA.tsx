'use client';

import { useEffect, useState } from 'react';
import { Hourglass, Users } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { formatDeadlineLocal, formatDeadlineWib } from '@/lib/format/deadline';
import { useHydrated } from '@/hooks/useHydrated';

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type RegistrationDeadlineCTAProps = {
  deadlineIso?: string | null;
  registrantsCount?: number | null;
  seatsLeftCount?: number | null;
};

function getTimeRemaining(target: Date): Countdown {
  const total = target.getTime() - new Date().getTime();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function RegistrationDeadlineCTA({
  deadlineIso,
  registrantsCount = null,
  seatsLeftCount = null,
}: RegistrationDeadlineCTAProps) {
  // Use 0 (epoch) as fallback when no deadline is provided — countdown will display zeros
  const targetMs = deadlineIso ? new Date(deadlineIso).getTime() : 0;
  const getCountdown = () => getTimeRemaining(new Date(targetMs));
  const [timeLeft, setTimeLeft] = useState<Countdown>(() => getCountdown());
  // false during SSR/first client render; true once hydrated. Before hydration
  // the viewer's timezone is unknown, so fall back to a labelled WIB render —
  // see hooks/useHydrated.ts.
  const hydrated = useHydrated();
  const deadlineLabel = deadlineIso
    ? (() => {
        const result = hydrated
          ? formatDeadlineLocal(deadlineIso, { withTime: false })
          : formatDeadlineWib(deadlineIso, { withTime: false });
        return result === '—' ? 'to be announced' : result;
      })()
    : 'to be announced';

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getCountdown());
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- getCountdown is stable; targetMs is the real dep
  }, [targetMs]);
  return (
    <section className={componentsTheme.applyRegistrationDeadlineCta.sectionWrapper}>
      {/* Shape buat background */}
      <div className={componentsTheme.applyRegistrationDeadlineCta.blurTop} />
      <div className={componentsTheme.applyRegistrationDeadlineCta.blurMiddle} />
      <div className={componentsTheme.applyRegistrationDeadlineCta.blurBottom} />

      <div className={componentsTheme.applyRegistrationDeadlineCta.container}>
        {/* Isi konten sectionnya */}
        <div className={componentsTheme.applyRegistrationDeadlineCta.leftCol}>
          <h2 className={componentsTheme.applyRegistrationDeadlineCta.title}>Registration Deadline</h2>
          <p className={componentsTheme.applyRegistrationDeadlineCta.subtitle} suppressHydrationWarning>
            Registration closes {deadlineLabel}
          </p>

          {(registrantsCount !== null || seatsLeftCount !== null) && (
            <div className={componentsTheme.applyRegistrationDeadlineCta.statsRow}>
              {registrantsCount !== null && (
                <div className={componentsTheme.applyRegistrationDeadlineCta.statGroup}>
                  <div className={componentsTheme.applyRegistrationDeadlineCta.statIconCircle}>
                    <Users className={componentsTheme.applyRegistrationDeadlineCta.statIcon} />
                  </div>
                  <div>
                    <p className={componentsTheme.applyRegistrationDeadlineCta.statValue}>{registrantsCount}</p>
                    <p className={componentsTheme.applyRegistrationDeadlineCta.statLabel}>Registrants</p>
                  </div>
                </div>
              )}

              {registrantsCount !== null && seatsLeftCount !== null && (
                <div className={componentsTheme.applyRegistrationDeadlineCta.statsDivider} />
              )}

              {seatsLeftCount !== null && (
                <div className={componentsTheme.applyRegistrationDeadlineCta.statGroup}>
                  <div className={componentsTheme.applyRegistrationDeadlineCta.statIconCircle}>
                    <Hourglass className={componentsTheme.applyRegistrationDeadlineCta.statIcon} />
                  </div>
                  <div>
                    <p className={componentsTheme.applyRegistrationDeadlineCta.statValue}>{seatsLeftCount}</p>
                    <p className={componentsTheme.applyRegistrationDeadlineCta.statLabel}>Seats Left Available</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: countdown timer */}
        <div className={componentsTheme.applyRegistrationDeadlineCta.rightCol}>
          <div className={componentsTheme.applyRegistrationDeadlineCta.countdownCard}>
            <div className="text-center">
              <p className={componentsTheme.applyRegistrationDeadlineCta.countdownEyebrow}>
                Time Left To Register
              </p>
            </div>

            <div className={componentsTheme.applyRegistrationDeadlineCta.countdownGrid}>
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map(item => (
                <div key={item.label} className={componentsTheme.applyRegistrationDeadlineCta.countdownItem}>
                  <span className={componentsTheme.applyRegistrationDeadlineCta.countdownValue}>
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className={componentsTheme.applyRegistrationDeadlineCta.countdownLabel}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className={componentsTheme.applyRegistrationDeadlineCta.note}>
              Applications close when the timer reaches zero.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
