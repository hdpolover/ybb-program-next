'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';

interface CountdownProps {
  targetDate: string; // ISO date string
  // Set only when more than one program edition currently has open
  // registration, so the countdown names which edition it's counting down
  // for (see MEYS 6th/7th concurrent-active-programs bug). Undefined for
  // every brand with a single open program, which keeps this label exactly
  // as it reads today.
  programName?: string | null;
  // 'upcoming' means targetDate is the date registration OPENS, not closes.
  // Same clock, opposite sentence -- see lib/registration/deadline.ts.
  phase?: 'open' | 'upcoming';
}

export default function RegistrationCountdown({ targetDate, programName, phase = 'open' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        setIsExpired(true);
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (isExpired) {
    return null;
  }

  const verb = phase === 'upcoming' ? 'opens' : 'closes';

  return (
    <div className={componentsTheme.registrationCountdown.wrapper}>
      <div className={componentsTheme.registrationCountdown.overlay} />
      <div className={componentsTheme.registrationCountdown.container}>
        <div className={componentsTheme.registrationCountdown.labelWrapper}>
          <Clock className={componentsTheme.registrationCountdown.icon} />
          <span className={componentsTheme.registrationCountdown.labelDesktop}>
            {programName
              ? `${programName} registration ${verb} in:`
              : `Registration ${verb} in:`}
          </span>
          <span className={componentsTheme.registrationCountdown.labelMobile}>
            {phase === 'upcoming' ? 'Opens in:' : 'Closes in:'}
          </span>
        </div>
        <div className={componentsTheme.registrationCountdown.countdownGrid}>
          <div className={componentsTheme.registrationCountdown.timeCard}>
            <span className={componentsTheme.registrationCountdown.timeValue}>{timeLeft.days}</span>
            <span className={componentsTheme.registrationCountdown.timeLabel}>Days</span>
          </div>
          <span className={componentsTheme.registrationCountdown.separator}>:</span>
          <div className={componentsTheme.registrationCountdown.timeCard}>
            <span className={componentsTheme.registrationCountdown.timeValue}>{timeLeft.hours}</span>
            <span className={componentsTheme.registrationCountdown.timeLabel}>Hrs</span>
          </div>
          <span className={componentsTheme.registrationCountdown.separator}>:</span>
          <div className={componentsTheme.registrationCountdown.timeCard}>
            <span className={componentsTheme.registrationCountdown.timeValue}>{timeLeft.minutes}</span>
            <span className={componentsTheme.registrationCountdown.timeLabel}>Min</span>
          </div>
          <span className={componentsTheme.registrationCountdown.separatorDesktop}>:</span>
          <div className={componentsTheme.registrationCountdown.timeCard}>
            <span className={componentsTheme.registrationCountdown.timeValue}>{timeLeft.seconds}</span>
            <span className={componentsTheme.registrationCountdown.timeLabel}>Sec</span>
          </div>
        </div>
      </div>
    </div>
  );
}
