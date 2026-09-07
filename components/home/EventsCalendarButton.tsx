// components/home/EventsCalendarButton.tsx
//
// Trigger for the home page events calendar. Sits directly below the
// registration countdown banner (rendered by RegistrationCountdownGate in
// app/layout.tsx, right above page content), so this is the first thing
// app/page.tsx renders after the hero.
'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CalendarDays } from 'lucide-react';
import type { RegistrationCalendarEvent } from '@/lib/registration/calendarEvents';

// Dynamically imported: the grid, portal, and schedule-fetch logic must cost
// the home page nothing until a visitor actually opens the calendar.
const EventsCalendarModal = dynamic(() => import('./EventsCalendarModal'), { ssr: false });

type Props = {
  programId: string;
  programName: string;
  programDates?: { start: string | null; end: string | null };
  registrationEvents: RegistrationCalendarEvent[];
};

export default function EventsCalendarButton({ programId, programName, programDates, registrationEvents }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="mx-auto flex max-w-7xl justify-center px-4 pt-4 sm:justify-end sm:px-6 lg:px-8">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-primary/5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
      >
        <CalendarDays className="h-4 w-4" />
        View events calendar
      </button>
      {open && (
        <EventsCalendarModal
          programId={programId}
          programName={programName}
          programDates={programDates}
          registrationEvents={registrationEvents}
          onClose={() => setOpen(false)}
          triggerRef={triggerRef}
        />
      )}
    </div>
  );
}
