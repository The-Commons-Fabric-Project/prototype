/**
 * DONE 
 */

import { S, T } from "../tokens";
import { MONTHS_FULL, fmtTime, paletteForOrgName, parseDate } from "../utils";
import { useHoverStyle } from "../useHoverStyle";
import { ClockIcon, PinIcon } from "./Icons";
import type { CalendarEvent } from "../types";

interface Props {
  events: CalendarEvent[];
  onSelect: (id: number) => void;
}

/** Responsive card grid, auto-fill at a 290px minimum column. */
export function EventCardGrid({ events, onSelect }: Props) {
  if (!events.length) {
    return (
      <div
        style={{
          background: T.color.surfaceAlt,
          border: `1px solid ${T.color.line}`,
          borderRadius: T.radius.md,
          padding: 36,
          textAlign: "center",
          color: T.color.muted,
          fontSize: 12,
        }}
      >
        No events fall within this date range.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
      {events.map((e) => (
        <EventCard key={e.id} event={e} onSelect={onSelect} />
      ))}
    </div>
  );
}

function EventCard({ event, onSelect }: { event: CalendarEvent; onSelect: (id: number) => void }) {
  const hover = useHoverStyle({ borderColor: "#9A9A9A" });
  const pal = paletteForOrgName(event.org);
  const d = parseDate(event.date);

  return (
    <div
      {...hover.bind}
      onClick={() => onSelect(event.id)}
      style={{
        ...S.card,
        cursor: "pointer",
        display: "flex",
        gap: 14,
        padding: 18,
        animation: "cf-fade .3s ease",
        ...hover.style,
      }}
    >
      <span style={{ width: 3, alignSelf: "stretch", flexShrink: 0, background: `linear-gradient(180deg,${pal.c1},${pal.c2})` }} />

      <div style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {(event.registrationRequired || event.volunteersNeeded) && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {event.registrationRequired && (
              <Tag color="#4C6DC5" border="#94BFFE" fill="linear-gradient(180deg,#F5F5F5,#EAF0FB)">
                Registration
              </Tag>
            )}
            {event.volunteersNeeded && (
              <Tag color="#C4551F" border="#F39A6B" fill="linear-gradient(180deg,#F5F5F5,#FBEDE4)">
                Volunteers wanted
              </Tag>
            )}
          </div>
        )}

        <div>
          <span style={{ display: "block", fontSize: 9.5, fontWeight: 700, color: T.color.muted, letterSpacing: "0.06em", marginBottom: 4 }}>
            {`${MONTHS_FULL[d.getMonth()]} ${d.getDate()}`}
          </span>
          <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.color.ink, margin: 0, lineHeight: 1.3 }}>
            {event.title}
          </h3>
          <p style={{ fontSize: 11.5, color: T.color.muted, fontWeight: 700, margin: "4px 0 0" }}>{event.org}</p>
        </div>

        <p
          style={{
            fontSize: 12.5,
            color: T.color.body,
            lineHeight: 1.5,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {event.description}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            fontSize: 11.5,
            color: T.color.muted,
            borderTop: `1px solid ${T.color.line}`,
            paddingTop: 10,
            marginTop: "auto",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <ClockIcon />
            {fmtTime(event.time)}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, minWidth: 0 }}>
            <PinIcon />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.location}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Tag({ color, border, fill, children }: { color: string; border: string; fill: string; children: string }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        textTransform: "uppercase",
        color,
        border: `1px solid ${border}`,
        padding: "2px 6px",
        borderRadius: T.radius.sm,
        background: fill,
      }}
    >
      {children}
    </span>
  );
}
