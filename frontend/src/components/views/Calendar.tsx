/**
I used the html provided by the design team to create this. 
It was easier to create the calendar from scratch vs. using react-big-calendar for the themeing

Still unsure whether this is the right direction however, one of the pros of using AI is that you don't have to rely on dependencies as much.
This might be more of an issue once we have to integrate with Google Calendar/Outlook but for the demo it's probably fine.
**/

import { useState, useMemo } from 'react'
import type { Event } from '../../utils/types/events'

import { parseDate, fmtTime } from '../../utils/datetime';
import { MONTHS_FULL as MONTH_NAMES, DOW as DAY_HEADERS } from '../../utils/types/dates';

type CalendarViewProps = {
  /** List of Events to view in the calendar */
  events: Event[];
  /** callback for selected event */
  onSelect: (event: Event) => void;
};

function formatTimeShort(time: string): string {
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return time;
  const [, h, m, period] = match;
  return m === '00' ? `${h} ${period.toUpperCase()}` : `${h}:${m} ${period.toUpperCase()}`;
}

export function CalendarView({ events, onSelect }: CalendarViewProps) {
  const [cursor, setCursor] = useState(() => parseDate(events[0]?.date || "2026-06-01"));
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay = useMemo(() => {
    const map: Event[][] = [];
    events.forEach((e) => {
      const d = parseDate(e.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        (map[d.getDate()] = map[d.getDate()] || []).push(e);
      }
    });
    Object.values(map).forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [events, year, month]);

  const goToPrev = () => {setCursor(new Date(year, month - 1, 1))};

  const goToNext = () => {setCursor(new Date(year, month + 1, 1))};

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="bg-white border border-line rounded-2xl p-4.5">
      <div className="flex justify-between items-center mb-3.5">
        <h3 className="font-display text-[20px] font-semibold text-ink m-0">
          {MONTH_NAMES[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            className="cf-press font-semibold text-[14px] px-3 py-1.5 rounded-md cursor-pointer border border-line leading-[1.1] tracking-[0.1px] bg-transparent text-primary"
            onClick={goToPrev}
          >
            ‹
          </button>
          <button
            className="cf-press font-semibold text-[14px] px-3 py-1.5 rounded-md cursor-pointer border border-line leading-[1.1] tracking-[0.1px] bg-transparent text-primary"
            onClick={goToNext}
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-muted tracking-[0.5px] pb-1">
            {d}
          </div>
        ))}

        {cells.map((day, i) => (
          <div
            key={i}
            className={`min-h-19 min-w-0 rounded-md p-1.5 border ${
              day === null
                ? 'border-transparent bg-transparent'
                : 'border-line bg-paper'
            }`}
          >
            {day !== null && (
              <>
                <div className="text-xs font-semibold text-muted mb-1">{day}</div>
                {(byDay[day] || []).map(event => (
                  <div
                    key={event.id}
                    className="cf-press bg-primary text-white text-[10.5px] font-semibold rounded-sm px-1.5 py-0.75 mb-0.75 cursor-pointer truncate max-w-full"
                    title={`${fmtTime(event.time)} ${event.title}`}
                    onClick={() => onSelect(event)} // setSelectedEvent(event)}
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
  );
}
