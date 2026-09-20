import { type Event } from "../../api/events";
import { DOW as DAY_HEADERS } from "../../utils/types/dates";
import { fmtTime, toIso, toTimeKey } from "../../utils/datetime";
import { classesForID } from "../../utils/palette";

export interface MonthGridProps {
  year: number;
  month: number;
  events: Event[];
  maxPerDay: number;
  onSelect: (id: number) => void;
}

export function MonthGrid({ year, month, events, maxPerDay, onSelect }: MonthGridProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byIso = new Map<string, Event[]>();
  events.forEach((e) => {
    const list = byIso.get(e.startsAt) ?? [];
    list.push(e);
    byIso.set(e.startsAt, list);
  });
  byIso.forEach((l) => l.sort((a, b) => a.time.localeCompare(b.time)));
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
              {(byDay[day] || []).map(e => {
                const color = classesForID(e.organizationId);
                const t = toTimeKey(e.startsAt);
              return (
                <div key={e.id}>
                    <div
                      onClick={() => onSelect(e)}
                      title={`${fmtTime(t)} ${e.title}`}
                      className={`h-[5px] rounded-[2px] mb-[2px] cursor-pointer ${color.railX}`}
                    />
                    <div className="text-[8px] text-muted overflow-hidden text-ellipsis whitespace-nowrap mb-[2px]">
                      {`${fmtTime(t).replace(":00", "")} ${e.title}`}
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
