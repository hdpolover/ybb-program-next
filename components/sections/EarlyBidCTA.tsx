'use client';

import { useEffect, useState } from 'react';
import { Hourglass, Users } from 'lucide-react';
import { componentsTheme } from '@/lib/theme/components';

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
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

export default function EarlyBidCTA() {
  const targetDate = new Date('2025-12-31T23:59:59Z');
  const [timeLeft, setTimeLeft] = useState<Countdown>(() => getTimeRemaining(targetDate));

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return (
    <section className={componentsTheme.applyEarlyBidCta.sectionWrapper}>
      {/* Shape buat background */}
      <div className={componentsTheme.applyEarlyBidCta.blurTop} />
      <div className={componentsTheme.applyEarlyBidCta.blurMiddle} />
      <div className={componentsTheme.applyEarlyBidCta.blurBottom} />

      <div className={componentsTheme.applyEarlyBidCta.container}>
        {/* Isi konten sectionnya */}
        <div className={componentsTheme.applyEarlyBidCta.leftCol}>
          <h2 className={componentsTheme.applyEarlyBidCta.title}>Early Bird Deadline</h2>
          <p className={componentsTheme.applyEarlyBidCta.subtitle}>
            Limited! Only Until 27 January 2025
          </p>

          <div className={componentsTheme.applyEarlyBidCta.statsRow}>
            <div className={componentsTheme.applyEarlyBidCta.statGroup}>
              <div className={componentsTheme.applyEarlyBidCta.statIconCircle}>
                <Users className={componentsTheme.applyEarlyBidCta.statIcon} />
              </div>
              <div>
                <p className={componentsTheme.applyEarlyBidCta.statValue}>187</p>
                <p className={componentsTheme.applyEarlyBidCta.statLabel}>Registrants</p>
              </div>
            </div>

            <div className={componentsTheme.applyEarlyBidCta.statsDivider} />

            <div className={componentsTheme.applyEarlyBidCta.statGroup}>
              <div className={componentsTheme.applyEarlyBidCta.statIconCircle}>
                <Hourglass className={componentsTheme.applyEarlyBidCta.statIcon} />
              </div>
              <div>
                <p className={componentsTheme.applyEarlyBidCta.statValue}>23</p>
                <p className={componentsTheme.applyEarlyBidCta.statLabel}>Seats Left Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: countdown timer */}
        <div className={componentsTheme.applyEarlyBidCta.rightCol}>
          <div className={componentsTheme.applyEarlyBidCta.countdownCard}>
            <div className="text-center">
              <p className={componentsTheme.applyEarlyBidCta.countdownEyebrow}>
                Early Bird Countdown
              </p>
            </div>

            <div className={componentsTheme.applyEarlyBidCta.countdownGrid}>
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map(item => (
                <div key={item.label} className={componentsTheme.applyEarlyBidCta.countdownItem}>
                  <span className={componentsTheme.applyEarlyBidCta.countdownValue}>
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className={componentsTheme.applyEarlyBidCta.countdownLabel}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className={componentsTheme.applyEarlyBidCta.note}>
              Once the timer hits zero, early bird benefits and priority consideration may no longer
              be available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
