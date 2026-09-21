/**
 * Built from the design team's HTML rather than react-big-calendar, which was
 * harder to theme. Revisit if we need Google Calendar/Outlook integration.
 */

import { useState, useMemo } from 'react'
import type { Event } from '../../api/events';

import { addMonths, format, getDate, getDay, getDaysInMonth, isSameMonth, startOfMonth, subMonths } from 'date-fns';

import { fromDateKey, fmtTime, monthBounds } from '../../utils/datetime';
import { DOW as DAY_HEADERS, type DateKey } from '../../utils/types/dates';
import { classesForID } from '../../utils/palette';

type CalendarViewProps = {
  events: Event[];
  onSelect: (event: Event) => void;
  /**
   * Start of the calendar's own fetch window, "YYYY-MM-DD". Owned by
   * routes/index.tsx and separate from the card grid's range. Falls back to today.
   */
  rangeStart: DateKey;
  /** Asks the route to fetch a new month. Called on every month navigation. */
  onWindowChange: (start: DateKey, end: DateKey) => void;
};

export function CalendarView({ events, onSelect, rangeStart, onWindowChange }: CalendarViewProps) {
  // Seeded from the current window, falling back to today. The month decides which
  // data is fetched, so it cannot be derived from the events.
  
  const [cursor, setCursor] = useState(() => (rangeStart ? fromDateKey(rangeStart) : new Date()));
  const firstDay = getDay(startOfMonth(cursor));
  const daysInMonth = getDaysInMonth(cursor);

  const byDay = useMemo(() => {
    const map: Event[][] = [];
    events.forEach((e) => {
      // In the viewer's timezone: getDate/isSameMonth read local fields, which is
      // the same clock fmtTime renders below, so a cell and its labels agree.
      if (isSameMonth(e.startsAt, cursor)) {
        const day = getDate(e.startsAt);
        (map[day] = map[day] || []).push(e);
      }
    });
    Object.values(map).forEach((list) => list.sort((a, b) => +a.startsAt - +b.startsAt));
    return map;
  }, [events, cursor]);

  // Moving the cursor also moves the fetch window.
  const goToMonth = (next: Date) => {
    setCursor(next);
    const { start, end } = monthBounds(next);
    onWindowChange(start, end);
  };

  const goToPrev = () => { goToMonth(startOfMonth(subMonths(cursor, 1))) };
  const goToNext = () => { goToMonth(startOfMonth(addMonths(cursor, 1))) };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const arrowButtonStyles = "cf-press font-semibold text-sm px-3 py-1.5 rounded-md cursor-pointer border border-line leading-tight tracking-tight bg-transparent text-primary";

  return (
    <div className="bg-white border border-line rounded-2xl p-4.5">
      <div className="flex justify-between items-center mb-3.5">
        <h3 className="font-display text-xl font-semibold text-ink m-0">
          {format(cursor, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button
            className={arrowButtonStyles}
            onClick={goToPrev}
          >
            ‹
          </button>
          <button
            className={arrowButtonStyles}
            onClick={goToNext}
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-line border border-line">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-muted bg-surface-alt tracking-[0.06em] px-1.25 tracking">
            {d}
          </div>
        ))}

        {cells.map((day, i) => (
          <div
            key={i}
            className={`min-h-19 min-w-0 p-1.5 ${
              day === null ? 'bg-transparent' : 'bg-surface'
            }`}
          >
            {day !== null && (
              <>
                <div className="text-xs font-semibold text-muted">{day}</div>
                {(byDay[day] || []).map(e => {
                  const color = classesForID(e.organizationId);
                  const t = fmtTime(e.startsAt);
                return (
                  <div key={e.id}>
                      <div
                        onClick={() => onSelect(e)}
                        title={`${t} ${e.title}`}
                        className={`h-[5px] rounded-[2px] mb-[2px] cursor-pointer ${color.railX}`}
                      />
                      <div className="text-[8px] text-muted overflow-hidden text-ellipsis whitespace-nowrap mb-[2px]">
                        {`${t.replace(":00", "")} ${e.title}`}
                      </div>
                    </div>
                )})}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
