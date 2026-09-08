/**
 * Built from the design team's HTML rather than react-big-calendar, which was
 * harder to theme. Revisit if we need Google Calendar/Outlook integration.
 */

import { useState, useMemo } from 'react'
import type { Event } from '../../api/events';

import { parseDate, fmtTime, toTimeKey, monthBounds } from '../../utils/datetime';
import { MONTHS_FULL as MONTH_NAMES, DOW as DAY_HEADERS } from '../../utils/types/dates';
import { paletteForID } from '../../utils/palette';

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

  const arrowButtonStyles = "cf-press font-semibold text-sm px-3 py-1.5 rounded-md cursor-pointer border border-line leading-tight tracking-tight bg-transparent text-primary";

  return (
    <div className="bg-white border border-line rounded-2xl p-4.5">
      <div className="flex justify-between items-center mb-3.5">
        <h3 className="font-display text-xl font-semibold text-ink m-0">
          {MONTH_NAMES[month]} {year}
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

      <div className="grid grid-cols-7 gap-1.5">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-muted tracking-[0.5px] pb-1 tracking">
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
                {(byDay[day] || []).map(e => {
                  const pal = paletteForID(e.organizationId);
                  const t = toTimeKey(e.startsAt);
                return (
                  <div key={e.id}>
                      <div
                        onClick={() => onSelect(e)}
                        title={`${fmtTime(t)} ${e.title}`}
                        style={{
                          background: `linear-gradient(90deg,${pal.c1},${pal.c2})`,
                          height: 5,
                          borderRadius: 2,
                          marginBottom: 2,
                          cursor: "pointer",
                        }}
                      />
                      <div style={{ fontSize: 8, color: "var(--color-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>
                        {`${fmtTime(t).replace(":00", "")} ${e.title}`}
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
