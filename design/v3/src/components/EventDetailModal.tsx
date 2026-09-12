import { S, T } from "../tokens";
import { DOW_FULL, FREQ_LABEL, durationOf, fmtMinutes, fmtPlainDate, minutesOf, paletteForOrgName } from "../utils";
import { CalendarIcon, ClockIcon, PersonIcon, PinIcon, RepeatIcon, TicketIcon } from "./Icons";
import { CloseButton } from "./ModalShell";
import type { CalendarEvent } from "../types";

interface Props {
  event: CalendarEvent;
  accentColor: string;
  onClose: () => void;
}

/**
 * Event detail. The top bar uses the host's four-stop ramp rather than the
 * purple default, so the modal is color-coded to the organization.
 */
export function EventDetailModal({ event, accentColor, onClose }: Props) {
  const pal = paletteForOrgName(event.org);
  const start = minutesOf(event.time);
  const timeRange = `${fmtMinutes(start)} – ${fmtMinutes(start + durationOf(event))}`;

  const repeatLabel = event.recurring
    ? `Repeats every ${FREQ_LABEL[event.frequency ?? "weekly"]}` +
      (event.frequency !== "monthly" && event.repeatDays?.length
        ? ` on ${[...event.repeatDays].sort((a, b) => a - b).map((i) => DOW_FULL[i]).join(", ")}`
        : "") +
      (event.repeatUntil ? `, until ${fmtPlainDate(event.repeatUntil)}` : "")
    : "";

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={S.modalOverlay}
    >
      <div style={{ ...S.modal(500), position: "relative" }}>
        <div style={{ display: "flex", gap: 2 }}>
          {pal.stops.map((c, i) => (
            <span key={i} style={{ flex: 1, height: 3, background: c }} />
          ))}
        </div>
        <CloseButton onClose={onClose} />

        <div style={{ padding: "22px 44px 0 24px" }}>
          <h2 style={{ fontFamily: T.font, fontSize: 19, fontWeight: 700, color: T.color.ink, margin: 0, lineHeight: 1.25 }}>{event.title}</h2>
          <p style={{ fontSize: 11, color: pal.text, fontWeight: 700, letterSpacing: "0.04em", margin: "6px 0 0", textTransform: "uppercase" }}>{event.org}</p>
        </div>

        <div style={{ padding: "18px 24px 24px" }}>
          {event.description && (
            <p style={{ fontSize: 13.5, color: T.color.ink, lineHeight: 1.6, margin: "0 0 16px" }}>{event.description}</p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18, borderTop: `1px solid ${T.color.line}`, paddingTop: 14 }}>
            <Row icon={<CalendarIcon />}>{fmtPlainDate(event.date)}</Row>
            <Row icon={<ClockIcon size={14} />}>{timeRange}</Row>
            {event.recurring && <Row icon={<RepeatIcon />}>{repeatLabel}</Row>}
            <Row icon={<PinIcon size={14} />}>{event.location}</Row>
            <Row icon={<TicketIcon />}>
              {event.registrationRequired ? (
                <span>
                  Registration required —{" "}
                  <a href={event.registrationLink || "#"} target="_blank" rel="noreferrer" style={{ color: T.color.ink, fontWeight: 700, wordBreak: "break-all" }}>
                    {event.registrationLink || "link to come"}
                  </a>
                </span>
              ) : (
                <span>No registration required — just show up</span>
              )}
            </Row>
            {event.volunteersNeeded && (
              <Row icon={<PersonIcon />}>
                <span>
                  Volunteers wanted —{" "}
                  <a href={`mailto:${event.volunteerContact}`} style={{ color: T.color.ink, fontWeight: 700 }}>
                    {event.volunteerContact}
                  </a>
                </span>
              </Row>
            )}
          </div>

          {event.registrationRequired && (
            <a href={event.registrationLink || "#"} target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "block" }}>
              <button style={{ ...S.btnPrimary(accentColor), width: "100%", padding: 10 }}>Register on host's site ↗</button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13, color: T.color.ink }}>
      <span style={{ flexShrink: 0, color: T.color.muted, marginTop: 1 }}>{icon}</span>
      {children}
    </div>
  );
}
