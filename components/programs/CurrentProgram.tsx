'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Calendar, MapPin, Square } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

function useCountdown(target: Date) {
  const targetMs = useMemo(() => target.getTime(), [target]);
  const [now, setNow] = useState<number>(() => targetMs);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function CurrentProgram() {
  return (
    <section className={jysSectionTheme.programsCurrent.sectionWrapper}>
      <div className={jysSectionTheme.programsCurrent.container}>
        <div className={jysSectionTheme.programsCurrent.layoutGrid}>
          {/* Kiri: deskripsi panjang + theme */}
          <div className={jysSectionTheme.programsCurrent.leftCol}>
            <SectionHeader eyebrow="Active Program" title="Japan Youth Summit 2026" align="left" />
            <p className={jysSectionTheme.programsCurrent.bodyParagraph}>
              Japan Youth Summit (JYS) 2026 is an international youth forum that brings together
              passionate young leaders to discuss, design, and drive collaborative solutions for a
              more sustainable and inclusive future in Asia and beyond. Throughout the program,
              participants will engage in panel discussions, cultural exchanges, and hands-on
              workshops guided by experienced mentors and practitioners.
            </p>
            <p className={jysSectionTheme.programsCurrent.bodyParagraph}>
              Beyond the formal sessions, JYS 2026 is also a space to build long-term friendships
              and cross-border collaborations. Delegates will have the opportunity to present their
              ideas, receive constructive feedback, and turn their initiatives into real impact in
              their respective communities after the summit.
            </p>
            <p className={jysSectionTheme.programsCurrent.bodyParagraph}>
              The program also includes field visits, cultural immersion activities, and
              collaborative project sessions that allow participants to directly experience local
              contexts while sharpening their leadership, communication, and problem-solving skills.
              By the end of the summit, every delegate is expected to return home with a clearer
              action plan and a stronger international network to support their initiatives.
            </p>

            <div className={jysSectionTheme.programsCurrent.themeBlock}>
              <div>
                <h3 className={jysSectionTheme.programsCurrent.themeHeading}>Program Theme</h3>
                <p className={jysSectionTheme.programsCurrent.themeTitle}>
                  Collaboration in Diversity: Young Leaders Shaping a Sustainable Future
                </p>
              </div>
              <div>
                <h3 className={jysSectionTheme.programsCurrent.themeHeading}>Subthemes</h3>
                <div className={jysSectionTheme.programsCurrent.subthemesGrid}>
                  <div className={jysSectionTheme.programsCurrent.subthemeCard}>
                    Youth Leadership and Community Development
                  </div>
                  <div className={jysSectionTheme.programsCurrent.subthemeCard}>
                    Sustainable Tourism and Cultural Preservation
                  </div>
                  <div className={jysSectionTheme.programsCurrent.subthemeCard}>
                    Innovation, Digital Economy, and Social Entrepreneurship
                  </div>
                  <div className={jysSectionTheme.programsCurrent.subthemeCard}>
                    Global Networking and Cross-Cultural Collaboration
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kanan: kartu program seperti contoh */}
          <div className={jysSectionTheme.programsCurrent.rightCol}>
            <div className={jysSectionTheme.programsCurrent.rightCard}>
              {/* Gambar cover */}
              <div className={jysSectionTheme.programsCurrent.coverWrapper}>
                <Image
                  src="/img/jys26posters.png"
                  alt="Japan Youth Summit 2026 cover"
                  width={260}
                  height={360}
                  className={jysSectionTheme.programsCurrent.coverImage}
                  priority
                />
              </div>

              {/* Info program */}
              <div className={jysSectionTheme.programsCurrent.infoList}>
                <div className={jysSectionTheme.programsCurrent.infoRow}>
                  <MapPin className={jysSectionTheme.programsCurrent.infoIcon} />
                  <div>
                    <p className={jysSectionTheme.programsCurrent.infoLabel}>Location</p>
                    <p className={jysSectionTheme.programsCurrent.infoValue}>
                      Osaka &amp; Kyoto, Japan
                    </p>
                  </div>
                </div>

                <div className={jysSectionTheme.programsCurrent.infoGrid}>
                  <div className={jysSectionTheme.programsCurrent.infoRow}>
                    <CalendarDays className={jysSectionTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={jysSectionTheme.programsCurrent.infoLabel}>Duration</p>
                      <p className={jysSectionTheme.programsCurrent.infoValue}>5 Days</p>
                    </div>
                  </div>
                  <div className={jysSectionTheme.programsCurrent.infoRow}>
                    <Square className={jysSectionTheme.programsCurrent.infoIcon} />
                    <div>
                      <p className={jysSectionTheme.programsCurrent.infoLabel}>Program Format</p>
                      <p className={jysSectionTheme.programsCurrent.infoValue}>On-site in Japan</p>
                    </div>
                  </div>
                </div>

                <div className={jysSectionTheme.programsCurrent.infoRow}>
                  <Calendar className={jysSectionTheme.programsCurrent.infoIcon} />
                  <div>
                    <p className={jysSectionTheme.programsCurrent.infoLabel}>Event Dates</p>
                    <p className={jysSectionTheme.programsCurrent.infoValue}>
                      02 – 06 February 2026
                    </p>
                  </div>
                </div>
              </div>

              {/* Tombol guidebook */}
              <div className={jysSectionTheme.programsCurrent.guideButtonsWrapper}>
                <a
                  href="#guidebook-en"
                  className={`${jysSectionTheme.homeRegistration.guideSecondary} flex w-full items-center justify-center gap-2 text-sm`}
                >
                  <span className="text-lg">🇬🇧</span>
                  <span>Read Guidebook (Eng)</span>
                </a>
                <a
                  href="#guidebook-id"
                  className={`${jysSectionTheme.homeRegistration.guidePrimary} flex w-full items-center justify-center gap-2 text-sm`}
                >
                  <span className="text-lg">🇮🇩</span>
                  <span>Read Guidebook (Ind)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: 'calendar' | 'date' | 'pin' | 'format';
  label: string;
  value: string;
}) {
  const Icon = () => {
    switch (icon) {
      case 'calendar':
        return <CalendarDays className={jysSectionTheme.programsCurrent.infoItemIcon} />;
      case 'date':
        return <Calendar className={jysSectionTheme.programsCurrent.infoItemIcon} />;
      case 'pin':
        return <MapPin className={jysSectionTheme.programsCurrent.infoItemIcon} />;
      case 'format':
        return <Square className={jysSectionTheme.programsCurrent.infoItemIcon} />;
    }
  };
  return (
    <div className={jysSectionTheme.programsCurrent.infoItemCard}>
      <div className={jysSectionTheme.programsCurrent.infoItemHeader}>
        <Icon />
        <span className={jysSectionTheme.programsCurrent.infoItemLabel}>{label}</span>
      </div>
      <div className={jysSectionTheme.programsCurrent.infoItemValue}>{value}</div>
    </div>
  );
}
