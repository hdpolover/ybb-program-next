'use client';
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className = '',
  size = 'md',
  showLabels = true
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'countdown-sm';
      case 'lg':
        return 'countdown-lg';
      default:
        return 'countdown-md';
    }
  };

  if (isExpired) {
    return (
      <div className={`countdown-timer ${getSizeClass()} ${className}`}>
        <div className="countdown-item">
          <span className="countdown-expired">Event Started!</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`countdown-timer ${getSizeClass()} ${className}`}>
      <div className="countdown-item">
        <span className="countdown-number">{timeLeft.days}</span>
        {showLabels && <span className="countdown-label">Days</span>}
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-item">
        <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
        {showLabels && <span className="countdown-label">Hours</span>}
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-item">
        <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
        {showLabels && <span className="countdown-label">Minutes</span>}
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-item">
        <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
        {showLabels && <span className="countdown-label">Seconds</span>}
      </div>
    </div>
  );
};

export default CountdownTimer;