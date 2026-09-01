import { T } from "../tokens";
import { DOW, fmtTime, paletteForOrgName, toIso } from "../utils";
import type { CalendarEvent } from "../types";

interface Props {
  year: number;
  month: number;
  events: CalendarEvent[];
  maxPerDay: number;
  onSelect: (id: number) => void;
}

/**
 * Month grid. 7 columns, 1px gaps over a #D1D1D1 background so the gaps read as
 * rules. Leading and trailing cells are padded blank so the last row is filled.
 */
export function MonthGrid({ year, month, events, maxPerDay, onSelect }: Props) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byIso = new Map<string, CalendarEvent[]>();
  events.forEach((e) => {
    const list = byIso.get(e.date) ?? [];
    list.push(e);
    byIso.set(e.date, list);
  });
  byIso.forEach((l) => l.sort((a, b) => a.time.localeCompare(b.time)));

  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 1, background: T.color.line, border: `1px solid ${T.color.line}` }}>
      {DOW.map((d) => (
        <div
          key={d}
          style={{
            background: T.color.surfaceAlt,
            fontSize: 9,
            textAlign: "center",
            padding: "5px 0",
            color: T.color.muted,
            fontWeight: 700,
            letterSpacing: "0.06em",
          }}
        >
          {d}
        </div>
      ))}

      {cells.map((day, i) => {
        const dayEvents = day ? byIso.get(toIso(new Date(year, month, day))) ?? [] : [];
        const shown = dayEvents.slice(0, maxPerDay);
        return (
          <div key={i} style={{ background: T.color.surface, minHeight: 78, minWidth: 0, padding: 5, fontSize: 10, color: T.color.muted }}>
            {day && (
              <>
                <div style={{ fontSize: 10, fontWeight: 700, color: dayEvents.length ? T.color.ink : T.color.muted, marginBottom: 3 }}>
                  {day}
                </div>
                {shown.map((e) => {
                  const pal = paletteForOrgName(e.org);
                  return (
                    <div key={e.id}>
                      <div
                        onClick={() => onSelect(e.id)}
                        title={`${fmtTime(e.time)} ${e.title}`}
                        style={{
                          background: `linear-gradient(90deg,${pal.c1},${pal.c2})`,
                          height: 5,
                          borderRadius: 2,
                          marginBottom: 2,
                          cursor: "pointer",
                        }}
                      />
                      <div style={{ fontSize: 8, color: T.color.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 2 }}>
                        {`${fmtTime(e.time).replace(":00", "")} ${e.title}`}
                      </div>
                    </div>
                  );
                })}
                {dayEvents.length > maxPerDay && (
                  <div style={{ fontSize: 8, color: T.color.muted, fontWeight: 700 }}>
                    {`+${dayEvents.length - maxPerDay} more`}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
