'use client';

import { useEffect, useState } from 'react';
import { Hourglass, Users } from 'lucide-react';
import { jysSectionTheme } from '@/lib/theme/jys-components';

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
    <section className={jysSectionTheme.applyEarlyBidCta.sectionWrapper}>
      {/* Shape buat background */}
      <div className={jysSectionTheme.applyEarlyBidCta.blurTop} />
      <div className={jysSectionTheme.applyEarlyBidCta.blurMiddle} />
      <div className={jysSectionTheme.applyEarlyBidCta.blurBottom} />

      <div className={jysSectionTheme.applyEarlyBidCta.container}>
        {/* Isi konten sectionnya */}
        <div className={jysSectionTheme.applyEarlyBidCta.leftCol}>
          <h2 className={jysSectionTheme.applyEarlyBidCta.title}>Early Bird Deadline</h2>
          <p className={jysSectionTheme.applyEarlyBidCta.subtitle}>
            Limited! Only Until 27 January 2025
          </p>

          <div className={jysSectionTheme.applyEarlyBidCta.statsRow}>
            <div className={jysSectionTheme.applyEarlyBidCta.statGroup}>
              <div className={jysSectionTheme.applyEarlyBidCta.statIconCircle}>
                <Users className={jysSectionTheme.applyEarlyBidCta.statIcon} />
              </div>
              <div>
                <p className={jysSectionTheme.applyEarlyBidCta.statValue}>187</p>
                <p className={jysSectionTheme.applyEarlyBidCta.statLabel}>Registrants</p>
              </div>
            </div>

            <div className={jysSectionTheme.applyEarlyBidCta.statsDivider} />

            <div className={jysSectionTheme.applyEarlyBidCta.statGroup}>
              <div className={jysSectionTheme.applyEarlyBidCta.statIconCircle}>
                <Hourglass className={jysSectionTheme.applyEarlyBidCta.statIcon} />
              </div>
              <div>
                <p className={jysSectionTheme.applyEarlyBidCta.statValue}>23</p>
                <p className={jysSectionTheme.applyEarlyBidCta.statLabel}>Seats Left Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: countdown timer */}
        <div className={jysSectionTheme.applyEarlyBidCta.rightCol}>
          <div className={jysSectionTheme.applyEarlyBidCta.countdownCard}>
            <div className="text-center">
              <p className={jysSectionTheme.applyEarlyBidCta.countdownEyebrow}>
                Early Bird Countdown
              </p>
            </div>

            <div className={jysSectionTheme.applyEarlyBidCta.countdownGrid}>
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map(item => (
                <div key={item.label} className={jysSectionTheme.applyEarlyBidCta.countdownItem}>
                  <span className={jysSectionTheme.applyEarlyBidCta.countdownValue}>
                    {String(item.value).padStart(2, '0')}
                  </span>
                  <span className={jysSectionTheme.applyEarlyBidCta.countdownLabel}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <p className={jysSectionTheme.applyEarlyBidCta.note}>
              Once the timer hits zero, early bird benefits and priority consideration may no longer
              be available.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
