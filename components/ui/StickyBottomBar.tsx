'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { formatDayMonthWib } from '@/lib/format/deadline';
import { trackInitiateCheckout } from '@/lib/analytics/metaPixel';

interface StickyBottomBarProps {
  deadline?: string | null;
  registerUrl?: string;
  // 'upcoming' means `deadline` is the date registration OPENS. The bar must
  // not offer a register link then -- signing up would create an account and
  // then tell the user registration "has closed" (see
  // lib/auth/programRegistrationClosed.ts).
  phase?: 'open' | 'upcoming';
}

export default function StickyBottomBar({ deadline, registerUrl, phase = 'open' }: StickyBottomBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasReachedTarget, setHasReachedTarget] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShouldAnimate(true), 50);
      return () => clearTimeout(timer);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- toggles a DIFFERENT state (shouldAnimate) than the dep (isVisible, driven by a scroll listener in a separate effect); cannot feed back into its own dependency.
      setShouldAnimate(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!deadline) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setHasReachedTarget(true);
        return;
      }
      setHasReachedTarget(false);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!isVisible || !deadline) return null;

  // A countdown that has run out is only the end of the story while
  // registration was OPEN. When the target was the OPENING instant, reaching
  // zero means registration just started -- and the phase prop is baked at
  // server render behind a 120s cache (HOME_CACHE_TTL), so unmounting here
  // deleted the loudest register CTA on the site for up to two minutes on a
  // fresh request, and indefinitely in a tab that was already open.
  const isOpeningNow = hasReachedTarget && phase === 'upcoming';
  if (hasReachedTarget && !isOpeningNow) return null;

  // Pinned to WIB, not the viewer's zone: see formatDayMonthWib.
  const opensLabel = phase === 'upcoming' ? formatDayMonthWib(deadline) : null;

  return (
    <div
      className={componentsTheme.stickyBottomBar.wrapper}
      style={{
        animation: shouldAnimate ? 'slideUp 0.3s ease-out forwards' : 'none'
      }}
    >
      <div className={componentsTheme.stickyBottomBar.container}>
        {!hasReachedTarget && (
          <div className={componentsTheme.stickyBottomBar.countdownSection}>
            <Clock className={componentsTheme.stickyBottomBar.icon} />
            <div className={componentsTheme.stickyBottomBar.timeGrid}>
              <div className={componentsTheme.stickyBottomBar.timeCard}>
                <span className={componentsTheme.stickyBottomBar.timeValue}>{timeLeft.days}</span>
                <span className={componentsTheme.stickyBottomBar.timeLabel}>Days</span>
              </div>
              <div className={componentsTheme.stickyBottomBar.timeCard}>
                <span className={componentsTheme.stickyBottomBar.timeValue}>{timeLeft.hours}</span>
                <span className={componentsTheme.stickyBottomBar.timeLabel}>Hrs</span>
              </div>
              <div className={componentsTheme.stickyBottomBar.timeCard}>
                <span className={componentsTheme.stickyBottomBar.timeValue}>{timeLeft.minutes}</span>
                <span className={componentsTheme.stickyBottomBar.timeLabel}>Mins</span>
              </div>
              <div className={componentsTheme.stickyBottomBar.timeCard}>
                <span className={componentsTheme.stickyBottomBar.timeValue}>{timeLeft.seconds}</span>
                <span className={componentsTheme.stickyBottomBar.timeLabel}>Secs</span>
              </div>
            </div>
          </div>
        )}
        {phase === 'upcoming' && !isOpeningNow ? (
          <span className={componentsTheme.stickyBottomBar.registerButtonPending}>
            {opensLabel ? `Opens ${opensLabel}` : 'Opens soon'}
          </span>
        ) : (
          <a
            href={registerUrl || '#'}
            className={componentsTheme.stickyBottomBar.registerButton}
            onClick={() => trackInitiateCheckout()}
          >
            Register Now
          </a>
        )}
      </div>
    </div>
  );
}
