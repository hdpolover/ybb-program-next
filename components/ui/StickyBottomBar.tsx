'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';
import { trackInitiateCheckout } from '@/lib/analytics/metaPixel';

interface StickyBottomBarProps {
  deadline?: string | null;
  registerUrl?: string;
}

export default function StickyBottomBar({ deadline, registerUrl }: StickyBottomBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
        return;
      }

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

  if (!isVisible || (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0)) {
    return null;
  }

  return (
    <div
      className={componentsTheme.stickyBottomBar.wrapper}
      style={{
        animation: shouldAnimate ? 'slideUp 0.3s ease-out forwards' : 'none'
      }}
    >
      <div className={componentsTheme.stickyBottomBar.container}>
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
        <a
          href={registerUrl || '#'}
          className={componentsTheme.stickyBottomBar.registerButton}
          onClick={() => trackInitiateCheckout()}
        >
          Register Now
        </a>
      </div>
    </div>
  );
}
