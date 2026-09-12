import { PALETTE, SEED_ORGS } from "../data";
import { S, T } from "../tokens";
import { MONTHS, fmtTime, orgColorKey, orgInitials, parseDate } from "../utils";
import { LinkIcon, MailIcon } from "./Icons";
import type { CalendarEvent } from "../types";

interface Props {
  orgId: number;
  events: CalendarEvent[];
  onBack: () => void;
  onSelect: (id: number) => void;
}

/** Organization profile: identity card, contact links, upcoming event list. */
export function OrgProfileView({ orgId, events, onBack, onSelect }: Props) {
  const idx = Math.max(0, SEED_ORGS.findIndex((o) => o.id === orgId));
  const org = SEED_ORGS[idx];
  const pal = PALETTE[orgColorKey(idx)];

  const orgEvents = events
    .filter((e) => e.org === org.name)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <>
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", color: T.color.ink, fontSize: 13, fontWeight: 700, cursor: "pointer", marginBottom: 18, padding: 0, fontFamily: T.font }}
      >
        ‹ Back to directory
      </button>

      <div style={{ ...S.card, padding: 22, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap" }}>
          <div
            style={{
              width: 72,
              height: 72,
              flexShrink: 0,
              borderRadius: T.radius.md,
              background: `linear-gradient(180deg,${pal.tint},${T.color.surfaceAlt})`,
              borderTop: `3px solid ${pal.c1}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: pal.c1,
              fontSize: 20,
              fontWeight: 700,
              fontFamily: T.font,
            }}
          >
            {orgInitials(org.name)}
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <h1 style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.color.ink, margin: "0 0 10px", lineHeight: 1.2 }}>{org.name}</h1>
            <p style={{ fontSize: 13.5, color: T.color.body, lineHeight: 1.6, margin: "0 0 14px", maxWidth: 600 }}>{org.blurb}</p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 12 }}>
              <span style={{ color: T.color.body, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <MailIcon />
                <a href={`mailto:${org.contact}`} style={{ color: T.color.ink }}>{org.contact}</a>
              </span>
              <span style={{ color: T.color.body, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <LinkIcon />
                <a href={`https://${org.website}`} style={{ color: T.color.ink }}>{org.website}</a>
              </span>
            </div>
          </div>
        </div>
        <div style={{ height: 2, background: `linear-gradient(90deg,${pal.c1},${pal.c2},${T.color.surfaceAlt})` }} />
      </div>

      <h2 style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.color.ink, margin: "0 0 14px" }}>Upcoming events</h2>

      {!orgEvents.length ? (
        <div style={{ background: T.color.surfaceAlt, border: `1px solid ${T.color.line}`, borderRadius: T.radius.md, padding: 24, textAlign: "center", color: T.color.muted, fontSize: 12 }}>
          No upcoming events from this organization yet.
        </div>
      ) : (
        <div style={{ ...S.card, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {orgEvents.map((e) => {
            const d = parseDate(e.date);
            return (
              <div
                key={e.id}
                onClick={() => onSelect(e.id)}
                style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 18px", borderBottom: `1px solid ${T.color.line}`, cursor: "pointer" }}
              >
                <span style={{ width: 34, flexShrink: 0, fontSize: 9.5, fontWeight: 700, color: T.color.muted, lineHeight: 1.3, paddingTop: 2 }}>
                  {`${MONTHS[d.getMonth()]} ${d.getDate()}`}
                </span>
                <span style={{ width: 3, alignSelf: "stretch", background: `linear-gradient(180deg,${pal.c1},${pal.c2})`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.color.ink }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: T.color.muted, marginTop: 3 }}>{`${fmtTime(e.time)} · ${e.location}`}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
