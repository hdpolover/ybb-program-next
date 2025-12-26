import { Calendar, Clock3, Hourglass, Check } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { jysSectionTheme } from '@/lib/theme/jys-components';

interface ActivityDay {
  date: string;
  time: string;
  duration: string;
  dayLabel: string;
  title: string;
  bullets: string[];
  description: string;
}

const DAYS: ActivityDay[] = [
  {
    date: 'Feb 02, 2026',
    time: '12:11 PM - 01:12 PM',
    duration: 'Duration: 1h 1m',
    dayLabel: 'First Day:',
    title: 'Arrival of the Delegates',
    bullets: [
      'Airport assistance',
      'Registration (Hotel Check In)',
      'Opening Ceremony',
      'Gala Dinner',
    ],
    description:
      'Airport Assistance will be provided exclusively at Osaka International Airport, with an estimated pickup session at approximately 12:00 PM local time.',
  },
  {
    date: 'Feb 03, 2026',
    time: '11:15 AM - 05:20 PM',
    duration: 'Duration: 6h 5m',
    dayLabel: 'Day 2:',
    title: 'City Tour and University Visit',
    bullets: ['International Symposium with Global Experts'],
    description:
      'A meaningful opportunity to experience Japanese culture and daily life through city tours and university visits, gaining both cultural insights and academic perspectives.',
  },
  {
    date: 'Feb 04, 2026',
    time: '11:19 AM - 05:22 PM',
    duration: 'Duration: 6h 3m',
    dayLabel: 'Day 3:',
    title: 'Project Presentations, Awards, and Cultural Night',
    bullets: [
      'Project Group Presentations',
      'Awarding Night and Cultural Night',
      'Closing Ceremony',
    ],
    description:
      'Each delegate will be assigned to a distribution group based on the SDGs they have selected. Groups consist of 70 members per project batch.',
  },
  {
    date: 'Feb 05, 2026',
    time: '11:23 AM - 01:24 PM',
    duration: 'Duration: 2h 1m',
    dayLabel: 'Day 4:',
    title: 'Closing Chapter as Delegates Return to Their Countries',
    bullets: ['Certificate claims', 'Hotel Check Out', 'Airport Assistance'],
    description:
      'The Airport Assistance service for departure at Osaka International Airport will be available at 12:00 PM local time.',
  },
];

export default function ProgramActivities() {
  return (
    <section className={jysSectionTheme.programsActivities.sectionWrapper}>
      <div className={jysSectionTheme.programsActivities.overlay} />
      <div className={jysSectionTheme.programsActivities.container}>
        <SectionHeader
          eyebrow="Program Rundown"
          title="Japan Youth Summit 2026 Activity"
          align="center"
        />

        <div className={jysSectionTheme.programsActivities.cardsGrid}>
          {DAYS.map(day => (
            <article key={day.title} className={jysSectionTheme.programsActivities.card}>
              {/* Top meta row */}
              <div className={jysSectionTheme.programsActivities.metaRow}>
                <div className={jysSectionTheme.programsActivities.metaItem}>
                  <Calendar className={jysSectionTheme.programsActivities.metaIcon} />
                  <span>{day.date}</span>
                </div>
                <div className={jysSectionTheme.programsActivities.metaItem}>
                  <Clock3 className={jysSectionTheme.programsActivities.metaIcon} />
                  <span>{day.time}</span>
                </div>
                <div className={jysSectionTheme.programsActivities.metaItem}>
                  <Hourglass className={jysSectionTheme.programsActivities.metaIcon} />
                  <span>{day.duration}</span>
                </div>
              </div>

              {/* Title + bullets */}
              <div className={jysSectionTheme.programsActivities.titleWrapper}>
                <h3 className={jysSectionTheme.programsActivities.title}>
                  <span className={jysSectionTheme.programsActivities.dayLabel}>
                    {day.dayLabel}
                  </span>{' '}
                  {day.title}
                </h3>

                <div className={jysSectionTheme.programsActivities.bulletsGrid}>
                  {day.bullets.map(item => (
                    <div key={item} className={jysSectionTheme.programsActivities.bulletRow}>
                      <span className={jysSectionTheme.programsActivities.bulletIconWrapper}>
                        <Check className={jysSectionTheme.programsActivities.bulletIcon} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <p className={jysSectionTheme.programsActivities.description}>{day.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className={jysSectionTheme.programsActivities.note}>
          <span className={jysSectionTheme.programsActivities.noteEmphasis}>Note:</span> This
          rundown is an estimation only. The final schedule will be updated closer to the program
          date. Please check back regularly for the most accurate information.
        </p>
      </div>
    </section>
  );
}
