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
  onSelect: (id: number) => void;
}

export function MonthGrid({ year, month, events, onSelect }: MonthGridProps) {
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
  return (
    <div className="grid grid-cols-7 gap-1.5">
      {DAY_HEADERS.map(d => (
        <div key={d} className="text-center text-xs font-bold text-muted tracking-[0.5px] pb-1 tracking">
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
              {(byDay.get(day) ?? []).map(e => {
                const color = classesForID(e.organizationId);
                const t = fmtTime(e.startsAt);
              return (
                <div key={e.id}>
                    <div
                      onClick={() => onSelect(e.id)}
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
  );
}
