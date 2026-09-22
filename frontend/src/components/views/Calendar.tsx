/**
 * Built from the design team's HTML rather than react-big-calendar, which was
 * harder to theme. Revisit if we need Google Calendar/Outlook integration.
 */

import { useState } from 'react'
import type { Event } from '../../api/events';

import { addMonths, format, startOfMonth, subMonths } from 'date-fns';

import { fromDateKey, monthBounds } from '../../utils/datetime';
import { type DateKey } from '../../utils/types/dates';
import { MonthGrid } from './MonthGrid';

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

  // Moving the cursor also moves the fetch window.
  const goToMonth = (next: Date) => {
    setCursor(next);
    const { start, end } = monthBounds(next);
    onWindowChange(start, end);
  };

  const goToPrev = () => { goToMonth(startOfMonth(subMonths(cursor, 1))) };
  const goToNext = () => { goToMonth(startOfMonth(addMonths(cursor, 1))) };

  const arrowButtonStyles = "cf-press font-semibold text-sm px-3 py-1.5 rounded-md cursor-pointer border border-line leading-tight tracking-tight bg-transparent text-primary";

  return (
    <div className="bg-white border border-line rounded-2xl p-4.5">
      <div className="flex justify-between items-center mb-3.5">
        <h3 className="font-display text-sm font-bold text-ink m-0">
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

{/* TODO: add day/week views, make maxPerDay a const config value somewhere else */}
      <MonthGrid year={cursor.getFullYear()} month={cursor.getMonth()} events={events} maxPerDay={3} onSelect={onSelect} />
    </div>
  )
}
