/**
I used the html provided by the design team to create this. 
It was easier to create the calendar from scratch vs. using react-big-calendar for the themeing

Still unsure whether this is the right direction however, one of the pros of using AI is that you don't have to rely on dependencies as much.
This might be more of an issue once we have to integrate with Google Calendar/Outlook but for the demo it's probably fine.
**/

import { useState } from 'react'
import type { Event } from '../../types/events'
import EventDescription from '../popup/EventDescription'

type CalendarProps = {
  /** List of Events to view in the calendar */
  events: Event[];
};

const MONTH_ABBR = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatTimeShort(time: string): string {
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return time;
  const [, h, m, period] = match;
  return m === '00' ? `${h} ${period.toUpperCase()}` : `${h}:${m} ${period.toUpperCase()}`;
}

export function Calendar({ events }: CalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const goToPrev = () => {
    if (monthIndex === 0) { setMonthIndex(11); setYear(y => y - 1); }
    else { setMonthIndex(m => m - 1); }
  };

  const goToNext = () => {
    if (monthIndex === 11) { setMonthIndex(0); setYear(y => y + 1); }
    else { setMonthIndex(m => m + 1); }
  };

  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const currentMonthAbbr = MONTH_ABBR[monthIndex];
  const monthEvents: Record<number, Event[]> = {};
  for (const event of events) {
    if (event.month.toUpperCase() === currentMonthAbbr) {
      if (!monthEvents[event.day]) monthEvents[event.day] = [];
      monthEvents[event.day].push(event);
    }
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <>
    <div className="bg-white border border-sage-border rounded-[16px] p-[18px]">
      <div className="flex justify-between items-center mb-[14px]">
        <h3 className="font-fraunces text-[20px] font-semibold text-forest m-0">
          {MONTH_NAMES[monthIndex]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            className="cf-press font-semibold text-[14px] px-3 py-[6px] rounded-[10px] cursor-pointer border border-sage-border leading-[1.1] tracking-[0.1px] bg-transparent text-teal"
            onClick={goToPrev}
          >
            ‹
          </button>
          <button
            className="cf-press font-semibold text-[14px] px-3 py-[6px] rounded-[10px] cursor-pointer border border-sage-border leading-[1.1] tracking-[0.1px] bg-transparent text-teal"
            onClick={goToNext}
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-[6px]">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-sage-muted tracking-[0.5px] pb-1">
            {d}
          </div>
        ))}

        {cells.map((day, i) => (
          <div
            key={i}
            className={`min-h-[76px] min-w-0 rounded-[10px] p-[6px] border ${
              day === null
                ? 'border-transparent bg-transparent'
                : 'border-sage-border bg-cream'
            }`}
          >
            {day !== null && (
              <>
                <div className="text-xs font-semibold text-sage-muted mb-1">{day}</div>
                {(monthEvents[day] ?? []).map(event => (
                  <div
                    key={event.id}
                    className="cf-press bg-teal text-white text-[10.5px] font-semibold rounded-[6px] px-[6px] py-[3px] mb-[3px] cursor-pointer truncate max-w-full"
                    title={`${event.time} ${event.title}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    {formatTimeShort(event.time)} {event.title}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>

    {selectedEvent && (
      <EventDescription
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    )}
    </>
  );
}
