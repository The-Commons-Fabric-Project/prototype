/**
 * Built from the design team's HTML rather than react-big-calendar, which was
 * harder to theme. Revisit if we need Google Calendar/Outlook integration.
 */

import { useState, useMemo } from 'react'
import type { Event } from '../../utils/types/events'

import { parseDate, fmtTime, toTimeKey, monthBounds } from '../../utils/datetime';
import { MONTHS_FULL as MONTH_NAMES, DOW as DAY_HEADERS } from '../../utils/types/dates';

type CalendarViewProps = {
  events: Event[];
  onSelect: (event: Event) => void;
  /**
   * Start of the calendar's own fetch window, "YYYY-MM-DD". Owned by
   * routes/index.tsx and separate from the card grid's range. Falls back to today.
   */
  rangeStart: string;
  /** Asks the route to fetch a new month. Called on every month navigation. */
  onWindowChange: (start: string, end: string) => void;
};

/** Takes the 12-hour string produced by fmtTime and drops a `:00`. */
function formatTimeShort(time: string): string {
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return time;
  const [, h, m, period] = match;
  return m === '00' ? `${h} ${period.toUpperCase()}` : `${h}:${m} ${period.toUpperCase()}`;
}

export function CalendarView({ events, onSelect, rangeStart, onWindowChange }: CalendarViewProps) {
  // Seeded from the current window, falling back to today. The month decides which
  // data is fetched, so it cannot be derived from the events.
  const [cursor, setCursor] = useState(() => (rangeStart ? parseDate(rangeStart) : new Date()));
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay = useMemo(() => {
    const map: Event[][] = [];
    events.forEach((e) => {
      const d = new Date(e.startsAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        (map[d.getDate()] = map[d.getDate()] || []).push(e);
      }
    });
    Object.values(map).forEach((list) => list.sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
    return map;
  }, [events, year, month]);

  // Moving the cursor also moves the fetch window.
  const goToMonth = (next: Date) => {
    setCursor(next);
    const { start, end } = monthBounds(next);
    onWindowChange(start, end);
  };

  const goToPrev = () => { goToMonth(new Date(year, month - 1, 1)) };

  const goToNext = () => { goToMonth(new Date(year, month + 1, 1)) };

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
                    title={`${fmtTime(toTimeKey(event.startsAt))} ${event.title}`}
                    onClick={() => onSelect(event)} // setSelectedEvent(event)}
                  >
                    {/* formatTimeShort matches a 12-hour string, so it needs fmtTime's
                        output. It used to be handed the raw 24-hour value, where the
                        regex never matched and "18:30" was rendered unformatted. */}
                    {formatTimeShort(fmtTime(toTimeKey(event.startsAt)))} {event.title}
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
