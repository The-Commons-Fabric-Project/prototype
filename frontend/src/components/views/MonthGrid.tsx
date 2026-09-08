import { type Event } from "../../api/events";
import { DOW as DAY_HEADERS } from "../../utils/types/dates";
import { fmtTime, toIso } from "../../utils/datetime";
import { paletteForID } from "../../utils/palette";

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
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  return (
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
  );
}
