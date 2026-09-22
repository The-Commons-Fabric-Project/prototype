import { getDate, isSameMonth } from "date-fns";

import { type Event } from "../../api/events";
import { DOW as DAY_HEADERS } from "../../utils/types/dates";
import { fmtTime } from "../../utils/datetime";
import { classesForID } from "../../utils/palette";

interface MonthGridProps {
  year: number;
  month: number;
  events: Event[];
  maxPerDay: number;
  onSelect: (e: Event) => void;
}

export function MonthGrid({ year, month, events, maxPerDay, onSelect }: MonthGridProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Binned by the day each instant falls on for the viewer, which is the clock
  // fmtTime renders below.
  const byDay = new Map<number, Event[]>();
  events.forEach((e) => {
    if (!isSameMonth(e.startsAt, new Date(year, month, 1))) return;
    const day = getDate(e.startsAt);
    byDay.set(day, [...(byDay.get(day) ?? []), e]);
  });
  byDay.forEach((l) => l.sort((a, b) => +a.startsAt - +b.startsAt));

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="grid grid-cols-7 gap-px bg-line border border-line">
      {DAY_HEADERS.map(d => (
        <div key={d} className="text-center text-xs font-bold text-muted bg-surface-alt tracking-[0.5px] py-1 tracking items-center">
          {d.toUpperCase()}
        </div>
      ))}

      {cells.map((day, i) => {
        const dayEvents = day ? byDay.get(day) ?? [] : [];
        const shown = dayEvents.slice(0, maxPerDay);
      
        return (
          <div
            key={i}
            className={`min-h-19 min-w-0 p-1  ${
              day === null
                ? 'bg-surface-alt'
                : 'bg-surface'
            }`}
          >
            {day !== null && (
              <>
                <div className={`text-xs ${dayEvents.length ? "font-bold text-ink" : "font-semibold text-muted"} mb-1`}>{day}</div>
                {shown.map(e => {
                  const color = classesForID(e.organizationId);
                  const t = fmtTime(e.startsAt);
                  return (
                    <div key={e.id}>
                      <div
                        onClick={() => onSelect(e)}
                        title={`${t} ${e.title}`}
                        className={`h-1.25 rounded-xs mb-0.5 cursor-pointer ${color.railX}`}
                      />
                      <div className="text-[8px] text-muted overflow-hidden text-ellipsis whitespace-nowrap mb-0.5">
                        {`${t.replace(":00", "")} ${e.title}`}
                      </div>
                    </div>
                  )})}
                {dayEvents.length > maxPerDay && (
                  <div className="text-[8px] text-muted font-bold">
                    {`+${dayEvents.length - maxPerDay} more`}
                  </div>
                )}
              </>
            )}
          </div>
        )})}
    </div>
  );
}
