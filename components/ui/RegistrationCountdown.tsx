'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';

interface CountdownProps {
  targetDate: string; // ISO date string
}

export default function RegistrationCountdown({ targetDate }: CountdownProps) {
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

  return (
    <div className={componentsTheme.registrationCountdown.wrapper}>
      <div className={componentsTheme.registrationCountdown.overlay} />
      <div className={componentsTheme.registrationCountdown.container}>
        <div className={componentsTheme.registrationCountdown.labelWrapper}>
          <Clock className={componentsTheme.registrationCountdown.icon} />
          <span className={componentsTheme.registrationCountdown.labelDesktop}>Registration closes in:</span>
          <span className={componentsTheme.registrationCountdown.labelMobile}>Closes in:</span>
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
