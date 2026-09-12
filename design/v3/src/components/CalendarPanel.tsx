// has become a parent component to the calendar itself (prev version only had equiv of MonthGrid)
import { useMemo, useState } from "react";
import { PALETTE, SEED_ORGS } from "../data";
import { S, T } from "../tokens";
import { buildTimeline } from "../timeline";
import { DOW, DOW_FULL, MONTHS, MONTHS_FULL, orgColorKey } from "../utils";
import { MonthGrid } from "./MonthGrid";
import { TimelineGrid } from "./TimelineGrid";
import type { CalendarEvent, CalendarSpan } from "../types";

interface Props {
  events: CalendarEvent[];
  span: CalendarSpan;
  /** Anchor date. Month view uses year/month only; day/week also use day. */
  year: number;
  month: number;
  day: number;
  maxPerDay: number;
  showLegend: boolean;
  onShift: (direction: -1 | 1) => void;
  onSelect: (id: number) => void;
}

/**
 * Calendar card. The body is a fixed-height scroll box (T.calendarBodyHeight,
 * 496px — the natural height of the month grid) so switching spans never
 * changes the page layout; day and week scroll vertically inside it.
 */
export function CalendarPanel({ events, span, year, month, day, maxPerDay, showLegend, onShift, onSelect }: Props) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const anchor = new Date(year, month, Math.min(day, daysInMonth));

  const visibleDates = useMemo(() => {
    if (span === "day") return [anchor];
    if (span === "week") {
      const weekStart = new Date(anchor);
      weekStart.setDate(anchor.getDate() - anchor.getDay());
      return Array.from({ length: 7 }, (_, i) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i));
    }
    return [];
  }, [span, anchor.getTime()]);

  const timeline = useMemo(
    () => (span === "month" ? null : buildTimeline(visibleDates, events, span === "week")),
    [span, visibleDates, events],
  );

  const label = (() => {
    if (span === "day") {
      return `${DOW_FULL[anchor.getDay()].toUpperCase()}, ${MONTHS_FULL[anchor.getMonth()].toUpperCase()} ${anchor.getDate()}, ${anchor.getFullYear()}`;
    }
    if (span === "week") {
      const [a, b] = [visibleDates[0], visibleDates[6]];
      return `${MONTHS[a.getMonth()]} ${a.getDate()} – ${MONTHS[b.getMonth()]} ${b.getDate()}, ${b.getFullYear()}`;
    }
    return `${MONTHS_FULL[month].toUpperCase()} ${year}`;
  })();

  return (
    <div style={{ ...S.card, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, margin: 0, textTransform: "uppercase" }}>{label}</h3>
        <span style={{ display: "flex", gap: 8 }}>
          <StepButton onClick={() => onShift(-1)}>‹</StepButton>
          <StepButton onClick={() => onShift(1)}>›</StepButton>
        </span>
      </div>

      <div style={{ height: T.calendarBodyHeight, overflowY: "auto", overflowX: "hidden" }}>
        {timeline ? (
          <TimelineGrid timeline={timeline} onSelect={onSelect} />
        ) : (
          <MonthGrid year={year} month={month} events={events} maxPerDay={maxPerDay} onSelect={onSelect} />
        )}
      </div>

      {showLegend && (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.color.line}` }}>
          {SEED_ORGS.map((o, i) => {
            const pal = PALETTE[orgColorKey(i)];
            return (
              <span key={o.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 9.5, color: T.color.body }}>
                <span style={{ width: 14, height: 5, background: `linear-gradient(90deg,${pal.c1},${pal.c2})` }} />
                {o.name.split(" ").slice(0, 2).join(" ")}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StepButton({ onClick, children }: { onClick: () => void; children: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `1px solid ${hover ? "#9A9A9A" : T.color.line}`,
        background: T.color.surface,
        padding: "3px 10px",
        fontSize: 12,
        color: T.color.body,
        borderRadius: T.radius.sm,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

/** Day / Week / Month segmented control, right-aligned in the toolbar. */
export function SpanToggle({ span, accentColor, onChange }: { span: CalendarSpan; accentColor: string; onChange: (s: CalendarSpan) => void }) {
  const opts: CalendarSpan[] = ["day", "week", "month"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={S.eyebrow}>SHOW</span>
      <div style={{ display: "inline-flex", background: T.color.surface, border: `1px solid ${T.color.line}`, borderRadius: T.radius.pill, padding: 3 }}>
        {opts.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            style={{
              border: "none",
              cursor: "pointer",
              fontFamily: T.font,
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              padding: "7px 14px",
              borderRadius: T.radius.pill,
              background: span === o ? accentColor : "transparent",
              color: span === o ? "#fff" : T.color.body,
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export { DOW };
