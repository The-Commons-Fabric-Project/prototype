import React, { useState, useEffect, useMemo, useRef } from "react";

// ============================================================================
// Commons Fabric Calendar — Grayscale Wireframe
// Black / white / grey, simple system fonts. No backend; in-memory only.
// ============================================================================

const C = {
  accent: "#2B2B2B",      // primary / dark actions & emphasis
  accentSoft: "#ECECEC",  // subtle fills / active chip
  ink: "#1A1A1A",         // headings / text
  muted: "#6E6E6E",       // secondary text
  line: "#CFCFCF",        // borders
  paper: "#F4F4F4",       // page background
  white: "#FFFFFF",       // cards
  danger: "#555555",      // errors (kept grayscale)
};

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const STYLES = `
* { box-sizing: border-box; }
@keyframes cf-pop { 0% { opacity: 0; transform: scale(0.96) translateY(6px);} 100% { opacity: 1; transform: scale(1) translateY(0);} }
@keyframes cf-fade { from { opacity: 0;} to { opacity: 1;} }
@keyframes cf-rise { 0% { opacity: 0; transform: translate(-50%, 14px);} 100% { opacity: 1; transform: translate(-50%, 0);} }
@keyframes cf-stagger { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
.cf-card-hover { transition: border-color .15s ease, box-shadow .15s ease; }
.cf-card-hover:hover { border-color: #9A9A9A; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
.cf-press { transition: transform .08s ease, background .15s ease, border-color .15s ease, color .15s ease; }
.cf-press:active { transform: translateY(1px); }
`;

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------
const SEED_ORGS = [
  { id: 1, name: "Rideau-Rockcliffe Community Resource Centre", blurb: "A neighbourhood anchor offering settlement, employment, family, and seniors programming across Ottawa's east end.", contact: "hello@rrcrc.example", website: "rrcrc.example" },
  { id: 2, name: "Council on Aging of Ottawa", blurb: "Advocacy and convening for older adults, championing age-friendly policy and connection across the city.", contact: "info@coaottawa.example", website: "coaottawa.example" },
  { id: 3, name: "Odawa Native Friendship Centre", blurb: "A welcoming gathering place delivering culturally grounded programs and supports for the urban Indigenous community.", contact: "reception@odawa.example", website: "odawa.example" },
  { id: 4, name: "Social Planning Council of Ottawa", blurb: "Research, policy, and community development working toward a more equitable and inclusive Ottawa.", contact: "spc@spcottawa.example", website: "spcottawa.example" },
  { id: 5, name: "STEAMakers Guild", blurb: "Hands-on science, tech, engineering, art, and math workshops for curious makers of every age.", contact: "build@steamakers.example", website: "steamakers.example" },
  { id: 6, name: "Ottawa Civic Tech", blurb: "Volunteers building open, public-interest technology with and for the Ottawa community.", contact: "hi@ottawacivictech.example", website: "ottawacivictech.example" },
];

const SEED_EVENTS = [
  { id: 1, title: "Newcomer Welcome Morning", org: "Rideau-Rockcliffe Community Resource Centre", date: "2026-06-16", time: "10:00", location: "RCH Room 1", description: "A relaxed drop-in for newcomers to the neighbourhood. Meet settlement workers, learn what programs are running this summer, and connect with other families over coffee.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "volunteer@rrcrc.example" },
  { id: 2, title: "Age-Friendly Ottawa Town Hall", org: "Council on Aging of Ottawa", date: "2026-06-19", time: "13:30", location: "RCH Main Hall", description: "An open conversation about making Ottawa more age-friendly. Bring your ideas on transit, housing, and connection — your input shapes this year's advocacy priorities.", registrationRequired: true, registrationLink: "https://example.com/townhall-rsvp", volunteersNeeded: false, volunteerContact: "" },
  { id: 3, title: "Odawa Annual Powwow (Day 1)", org: "Odawa Native Friendship Centre", date: "2026-06-20", time: "11:00", location: "RCH Grounds", description: "Day one of our annual powwow — a celebration of culture, dance, and community. Grand entry at noon, followed by drumming, dancing, craft and food vendors. All are welcome.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "events@odawa.example" },
  // ---- Busy day: June 20 has 4 events to preview a full calendar cell ----
  { id: 8, title: "Community Potluck Lunch", org: "Rideau-Rockcliffe Community Resource Centre", date: "2026-06-20", time: "12:30", location: "RCH Main Hall", description: "Bring a dish to share and meet your neighbours over a relaxed community lunch. Vegetarian and halal options always welcome.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "volunteer@rrcrc.example" },
  { id: 9, title: "Youth Coding Drop-in", org: "Ottawa Civic Tech", date: "2026-06-20", time: "14:00", location: "RCH Room 2", description: "An afternoon drop-in for youth aged 12+ to tinker with code, games, and hardware alongside friendly mentors. No experience required.", registrationRequired: true, registrationLink: "https://example.com/coding-rsvp", volunteersNeeded: false, volunteerContact: "" },
  { id: 10, title: "Evening Craft Circle", org: "STEAMakers Guild", date: "2026-06-20", time: "18:30", location: "RCH Workshop", description: "Wind down the day with a laid-back making session — bring a project or start something new. Materials provided while they last.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "build@steamakers.example" },
  // ------------------------------------------------------------------------
  { id: 7, title: "Odawa Annual Powwow (Day 2)", org: "Odawa Native Friendship Centre", date: "2026-06-21", time: "11:00", location: "RCH Grounds", description: "Day two of our annual powwow, closing on National Indigenous Peoples Day. Grand entry at noon, special performances, honour songs, and a community feast to close the weekend.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "events@odawa.example" },
  { id: 4, title: "Poverty & Policy Briefing", org: "Social Planning Council of Ottawa", date: "2026-06-23", time: "12:00", location: "RCH Room 2", description: "A lunchtime briefing on the latest local data around income, housing, and food security, with time for discussion on where research can drive change.", registrationRequired: true, registrationLink: "https://example.com/briefing-rsvp", volunteersNeeded: false, volunteerContact: "" },
  { id: 5, title: "Family Maker Lab: Circuits", org: "STEAMakers Guild", date: "2026-06-26", time: "15:30", location: "RCH Workshop", description: "Hands-on electronics for curious makers aged 8 and up. Build a working circuit you can take home — no experience needed, just bring your curiosity.", registrationRequired: true, registrationLink: "https://example.com/makerlab-rsvp", volunteersNeeded: true, volunteerContact: "build@steamakers.example" },
  { id: 6, title: "Commons Fabric Meetup", org: "Ottawa Civic Tech", date: "2026-06-18", time: "18:00", location: "RCH Room 2", description: "Monthly working session for the Commons Fabric project. Newcomers welcome — we'll walk through the calendar prototype and pick up open tasks together.", registrationRequired: false, registrationLink: "", volunteersNeeded: true, volunteerContact: "volunteer@ottawacivictech.example" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DOW_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function parseDate(d) { const [y, m, day] = d.split("-").map(Number); return new Date(y, m - 1, day); }
function ordinal(n) { const s = ["th","st","nd","rd"]; const v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
function fmtMonthDate(d) { const dt = parseDate(d); return `${MONTHS_FULL[dt.getMonth()]} ${dt.getDate()}`; }
function fmtPlainDate(d) { const dt = parseDate(d); return `${DOW_FULL[dt.getDay()]}, ${MONTHS_FULL[dt.getMonth()]} ${ordinal(dt.getDate())}, ${dt.getFullYear()}`; }
function fmtTime(t) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}
const EMAIL_RE = /\S+@\S+\.\S+/;

// ---------------------------------------------------------------------------
// Icons (grayscale, stroke = currentColor)
// ---------------------------------------------------------------------------
const svgBase = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
function ClockIcon({ size = 14 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>); }
function PinIcon({ size = 14 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.4" /></svg>); }
function CalendarIcon({ size = 14 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><rect x="3" y="4.5" width="18" height="16.5" rx="2" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>); }
function TicketIcon({ size = 14 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" /><path d="M13 6v12" /></svg>); }
function UserIcon({ size = 14 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></svg>); }
function MailIcon({ size = 14 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>); }
function LinkIcon({ size = 14 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" /></svg>); }
function SearchIcon({ size = 15 }) { return (<svg width={size} height={size} viewBox="0 0 24 24" {...svgBase} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.2-3.2" /></svg>); }

// ---------------------------------------------------------------------------
// Brand mark (grayscale)
// ---------------------------------------------------------------------------
function CFLogo({ size = 24, color = C.ink }) {
  return (
    <svg viewBox="0 0 1859.55 1546.66" width={size} height={size * (1546.66 / 1859.55)} aria-hidden="true" style={{ display: "block" }}>
      <g fill={color}>
        <path d="M965.49,1017.38h-106.23c-8.94,0-16.2,7.25-16.2,16.2s7.25,16.2,16.2,16.2h106.23c8.94,0,16.2-7.25,16.2-16.2s-7.25-16.2-16.2-16.2Z"/>
        <path d="M1151.4,1017.38h-106.23c-8.94,0-16.2,7.25-16.2,16.2s7.25,16.2,16.2,16.2h106.23c8.94,0,16.2-7.25,16.2-16.2s-7.25-16.2-16.2-16.2Z"/>
        <path d="M620.12,1120.54l-80.18,69.69c-6.75,5.87-7.47,16.1-1.6,22.85,3.2,3.69,7.71,5.57,12.23,5.57,3.77,0,7.55-1.31,10.62-3.97l80.18-69.69c6.75-5.87,7.47-16.1,1.6-22.85-5.87-6.75-16.1-7.47-22.85-1.6Z"/>
        <path d="M779.58,1017.38h-34.72c-3.91,0-7.68,1.41-10.63,3.97l-53.98,46.92c-6.75,5.87-7.47,16.1-1.6,22.85,3.2,3.68,7.71,5.57,12.23,5.57,3.77,0,7.55-1.31,10.62-3.97l49.41-42.94h28.66c8.94,0,16.2-7.25,16.2-16.2s-7.25-16.2-16.2-16.2Z"/>
        <path d="M479.8,1242.51l-17.63,15.33v-23.36c0-8.95-7.25-16.2-16.2-16.2s-16.2,7.25-16.2,16.2v58.9c0,6.35,3.71,12.11,9.48,14.74,2.15.98,4.44,1.46,6.72,1.46,3.83,0,7.62-1.36,10.63-3.97l44.46-38.64c6.75-5.87,7.47-16.1,1.6-22.85-5.87-6.75-16.1-7.47-22.85-1.6Z"/>
        <path d="M445.97,718.18c8.94,0,16.2-7.25,16.2-16.2v-125.29c0-8.95-7.25-16.2-16.2-16.2s-16.2,7.25-16.2,16.2v125.29c0,8.95,7.25,16.2,16.2,16.2Z"/>
        <path d="M445.97,1156.7c8.94,0,16.2-7.25,16.2-16.2v-125.29c0-8.95-7.25-16.2-16.2-16.2s-16.2,7.25-16.2,16.2v125.29c0,8.95,7.25,16.2,16.2,16.2Z"/>
        <path d="M445.97,937.44c8.94,0,16.2-7.25,16.2-16.2v-125.29c0-8.95-7.25-16.2-16.2-16.2s-16.2,7.25-16.2,16.2v125.29c0,8.95,7.25,16.2,16.2,16.2Z"/>
        <path d="M504.88,407.62h-58.9c-8.94,0-16.2,7.25-16.2,16.2v58.9c0,8.95,7.25,16.2,16.2,16.2s16.2-7.25,16.2-16.2v-42.7h42.7c8.94,0,16.2-7.25,16.2-16.2s-7.25-16.2-16.2-16.2Z"/>
        <path d="M581.85,440.02h102.63c8.94,0,16.2-7.25,16.2-16.2s-7.25-16.2-16.2-16.2h-102.63c-8.94,0-16.2,7.25-16.2,16.2s7.25,16.2,16.2,16.2Z"/>
        <path d="M761.45,440.02h102.63c8.94,0,16.2-7.25,16.2-16.2s-7.25-16.2-16.2-16.2h-102.63c-8.94,0-16.2,7.25-16.2,16.2s7.25,16.2,16.2,16.2Z"/>
        <path d="M941.05,440.02h58.9c8.94,0,16.2-7.25,16.2-16.2s-7.25-16.2-16.2-16.2h-58.9c-8.94,0-16.2,7.25-16.2,16.2s7.25,16.2,16.2,16.2Z"/>
        <path d="M1305.84,728.63c58.08-36.35,123.9-77.54,123.94-188.79.02-51.71-20.85-101.24-61.15-146.71l10.75-8.55c36.88-32.37,48.79-79.1,26.61-104.38-22.18-25.27-70.06-19.52-106.95,12.85l-23.75,22.99c-3.32-2.1-6.69-4.18-10.11-6.24-79.29-47.87-157.35-71.08-160.63-72.05-8.6-2.53-17.58,2.39-20.1,10.97-2.53,8.58,2.39,17.58,10.97,20.11,1.53.45,79.46,23.96,155.76,70.55l-626.61,606.46-13.25,11.63c-9.22,8.09-12.2,19.78-6.65,26.09,5.55,6.32,17.52,4.88,26.74-3.21l13.25-11.63,698.66-555.48c32.1,35.6,54.09,77.77,54.07,126.57-.03,93.32-52.83,126.36-108.73,161.34-51,31.92-103.74,64.92-107.39,143.33-3.7,79.5,37.42,139.63,67.84,172.88h-18.02c-8.94,0-16.2,7.25-16.2,16.2s7.25,16.2,16.2,16.2h58.9c.61,0,1.21-.04,1.8-.1.04,0,.07-.01.11-.02.56-.07,1.12-.16,1.66-.28.07-.02.15-.04.22-.06.51-.12,1.01-.27,1.5-.44.09-.03.18-.07.27-.1.47-.17.94-.37,1.39-.58.09-.04.19-.09.28-.14.47-.24.93-.5,1.38-.78.06-.04.12-.07.17-.1,1.05-.68,2.02-1.48,2.89-2.38,0,0,0,0,.01-.01.44-.46.84-.94,1.23-1.44.01-.02.03-.03.04-.04,0-.01.01-.02.02-.03.64-.85,1.19-1.77,1.66-2.74.01-.02.02-.05.03-.07.44-.93.78-1.9,1.04-2.91,0-.03.02-.07.03-.1.24-.96.38-1.95.44-2.97,0-.05,0-.1,0-.16.01-.25.04-.49.04-.74,0-.77-.07-1.52-.18-2.26,0-.02,0-.05-.01-.07-.15-1.02-.39-2.01-.71-2.96,0-.02-.01-.03-.02-.05-.34-.96-.76-1.88-1.26-2.75-.03-.05-.06-.11-.1-.16-.5-.85-1.08-1.64-1.72-2.38-.07-.08-.14-.15-.21-.23-.66-.73-1.37-1.39-2.15-1.99-.05-.04-.08-.08-.13-.12-.91-.69-90.95-69.74-86.08-174.62,2.86-61.46,44.26-87.37,92.21-117.37ZM1342.65,303.62c6.05-5.32,18.11-1.49,26.92,8.55,8.81,10.04,11.05,22.49,4.99,27.8l-31.27,27.44c-11.55-10.6-24.23-20.94-38.01-31l37.37-32.8ZM1259.27,441.17c-6.06,5.32-18.11,1.49-26.92-8.55-8.81-10.04-11.05-22.49-4.99-27.8l52.86-46.39c13.39,9.42,26.39,19.59,38.57,30.5l-59.52,52.24Z"/>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------
function Button({ variant = "primary", children, style, ...props }) {
  const base = {
    fontFamily: SANS, fontWeight: 600, fontSize: 14,
    padding: "9px 16px", borderRadius: 6, cursor: "pointer", border: "1px solid transparent",
    lineHeight: 1.1,
  };
  const variants = {
    primary: { background: C.accent, color: C.white, borderColor: C.accent },
    ghost: { background: C.white, color: C.ink, borderColor: C.line },
    subtle: { background: C.accentSoft, color: C.ink, borderColor: C.line },
    danger: { background: C.white, color: C.danger, borderColor: C.line },
  };
  return (
    <button className="cf-press" style={{ ...base, ...variants[variant], ...style }} {...props}>
      {children}
    </button>
  );
}

function Tag({ children, tone = "solid" }) {
  const tones = {
    solid: { background: C.accentSoft, color: C.ink, border: `1px solid ${C.line}` },
    outline: { background: C.white, color: C.ink, border: `1px solid ${C.muted}` },
  };
  return (
    <span style={{
      display: "inline-block", padding: "3px 8px", borderRadius: 4, fontSize: 10.5,
      fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
      fontFamily: SANS, ...tones[tone],
    }}>{children}</span>
  );
}

// Inline, screen-reader-friendly date: shows "June 16", announces the full date.
function InlineDate({ date, style }) {
  return (
    <span aria-label={fmtPlainDate(date)} style={style}>{fmtMonthDate(date)}</span>
  );
}

function Field({ label, error, children }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 6, fontFamily: SANS }}>{label}</span>
      {children}
      {error && <span style={{ display: "block", marginTop: 5, fontSize: 12, color: C.danger, fontWeight: 600 }}>{error}</span>}
    </label>
  );
}

const inputStyle = (err) => ({
  width: "100%", padding: "9px 11px", borderRadius: 6, fontSize: 14,
  border: `1px solid ${err ? C.danger : C.line}`, background: C.white, color: C.ink,
  fontFamily: SANS, outline: "none",
});

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14, padding: "12px 14px", background: C.white, border: `1px solid ${C.line}`, borderRadius: 6, marginBottom: 14 }}>
      <div>
        <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.ink, fontFamily: SANS }}>{label}</span>
        {hint && <span style={{ display: "block", fontSize: 12, color: C.muted, marginTop: 2 }}>{hint}</span>}
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="cf-press" style={{
        flexShrink: 0, width: 44, height: 25, borderRadius: 999, border: `1px solid ${checked ? C.accent : C.line}`, cursor: "pointer", position: "relative",
        background: checked ? C.accent : C.white, transition: "background .18s ease", marginTop: 1,
      }}>
        <span style={{ position: "absolute", top: 2, left: checked ? 21 : 2, width: 19, height: 19, borderRadius: "50%", background: C.white, border: `1px solid ${C.line}`, transition: "left .18s ease" }} />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal shell
// ---------------------------------------------------------------------------
function Modal({ children, onClose, width = 460 }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center",
        justifyContent: "center", padding: 20, background: "rgba(26,26,26,0.45)",
        animation: "cf-fade .16s ease",
      }}
    >
      <div
        role="dialog" aria-modal="true"
        style={{
          width: "100%", maxWidth: width, maxHeight: "88vh", overflowY: "auto",
          background: C.white, borderRadius: 10, border: `1px solid ${C.line}`,
          boxShadow: "0 16px 40px rgba(0,0,0,0.2)", animation: "cf-pop .18s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, onClose, subtitle }) {
  return (
    <div style={{ padding: "20px 24px 0", position: "relative", borderBottom: `1px solid ${C.line}`, paddingBottom: 16 }}>
      <button onClick={onClose} aria-label="Close" className="cf-press" style={{
        position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: 6,
        border: `1px solid ${C.line}`, background: C.white, cursor: "pointer", color: C.muted, fontSize: 16, lineHeight: 1,
      }}>×</button>
      <h2 style={{ fontFamily: SANS, fontSize: 20, fontWeight: 700, color: C.ink, margin: 0, paddingRight: 32 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: C.muted, margin: "6px 0 0", fontFamily: SANS }}>{subtitle}</p>}
    </div>
  );
}

// ===========================================================================
// Auth modals
// ===========================================================================
function CreateAccountModal({ onClose, onCreate, toast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Organization name is required.";
    if (!EMAIL_RE.test(form.email)) e.email = "Enter a valid email address.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Create account" onClose={onClose}
        subtitle={step === 1 ? "Register your organization to publish events." : "Confirm your details."} />
      <div style={{ padding: "18px 24px 24px" }}>
        {step === 1 ? (
          <>
            <Field label="Organization name" error={errors.name}>
              <input style={inputStyle(errors.name)} value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ottawa Civic Tech" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input style={inputStyle(errors.email)} value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@org.example" />
            </Field>
            <Field label="Password" error={errors.password}>
              <input type="password" style={inputStyle(errors.password)} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" />
            </Field>
            <Button style={{ width: "100%", marginTop: 4 }} onClick={() => { if (validate()) setStep(2); }}>Continue</Button>
          </>
        ) : (
          <>
            <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 6, padding: 16, marginBottom: 16 }}>
              <Summary label="Organization" value={form.name} />
              <Summary label="Email" value={form.email} last />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: "0 0 14px" }}>Is this information correct?</p>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>No, edit</Button>
              <Button style={{ flex: 1 }} onClick={() => {
                onCreate({ name: form.name, email: form.email, password: form.password });
                toast("Account created — check your email to confirm.");
                onClose();
              }}>Yes, create</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

function Summary({ label, value, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, paddingBottom: last ? 0 : 8, marginBottom: last ? 0 : 8, borderBottom: last ? "none" : `1px solid ${C.line}` }}>
      <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13.5, color: C.ink, fontWeight: 500, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function LoginModal({ onClose, accounts, onLogin, toast }) {
  const [mode, setMode] = useState("login");
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [newVal, setNewVal] = useState("");

  const doLogin = () => {
    const acct = accounts.find((a) => a.email === creds.email && a.password === creds.password);
    if (!acct) { setErr("Email or password not recognized."); return; }
    onLogin(acct);
    toast(`Welcome back, ${acct.name}`);
    onClose();
  };

  if (mode !== "login") {
    const isPw = mode === "password";
    return (
      <Modal onClose={onClose} width={420}>
        <ModalHeader title={isPw ? "Change password" : "Change email"} onClose={onClose}
          subtitle={isPw ? undefined : "We'll send a confirmation link to the new address."} />
        <div style={{ padding: "18px 24px 24px" }}>
          <Field label={isPw ? "New password" : "New email"}>
            <input type={isPw ? "password" : "text"} style={inputStyle(false)} value={newVal}
              onChange={(e) => setNewVal(e.target.value)} placeholder={isPw ? "At least 6 characters" : "you@org.example"} />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost" style={{ flex: 1 }} onClick={() => { setMode("login"); setNewVal(""); }}>Back</Button>
            <Button style={{ flex: 1 }} onClick={() => {
              toast(isPw ? "Password updated." : "Confirmation email sent.");
              setMode("login"); setNewVal("");
            }}>Save</Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose} width={420}>
      <ModalHeader title="Log in" onClose={onClose} />
      <div style={{ padding: "18px 24px 24px" }}>
        <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 6, padding: "9px 12px", marginBottom: 16, fontSize: 12.5, color: C.ink }}>
          Demo hint: use <strong>hi@ottawacivictech.example</strong> / <strong>demo123</strong>
        </div>
        <Field label="Email" error={err ? " " : ""}>
          <input style={inputStyle(!!err)} value={creds.email}
            onChange={(e) => { setCreds({ ...creds, email: e.target.value }); setErr(""); }} placeholder="you@org.example" />
        </Field>
        <Field label="Password" error={err}>
          <input type="password" style={inputStyle(!!err)} value={creds.password}
            onChange={(e) => { setCreds({ ...creds, password: e.target.value }); setErr(""); }} placeholder="Your password" />
        </Field>
        <Button style={{ width: "100%" }} onClick={doLogin}>Log in</Button>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 16 }}>
          <button onClick={() => setMode("password")} style={linkBtn}>Change password</button>
          <button onClick={() => setMode("email")} style={linkBtn}>Change email</button>
        </div>
      </div>
    </Modal>
  );
}

const linkBtn = { background: "none", border: "none", color: C.muted, fontSize: 12.5, cursor: "pointer", fontFamily: SANS, textDecoration: "underline", padding: 0 };

// ===========================================================================
// Create event modal (Org Admin only)
// ===========================================================================
function CreateEventModal({ onClose, session, onCreate, toast }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", date: "", time: "", location: "", description: "",
    registrationRequired: false, registrationLink: "",
    volunteersNeeded: false, volunteerContact: "",
  });
  const [errors, setErrors] = useState({});

  const setF = (patch) => setForm((f) => ({ ...f, ...patch }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.date) e.date = "Event date is required.";
    if (!form.time) e.time = "Event time is required.";
    if (!form.location.trim()) e.location = "Location is required.";
    if (form.registrationRequired && !form.registrationLink.trim()) e.registrationLink = "Add the link people register through.";
    if (form.volunteersNeeded && !EMAIL_RE.test(form.volunteerContact)) e.volunteerContact = "Add a valid contact email for volunteers.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <Modal onClose={onClose} width={500}>
      <ModalHeader title="Create event" onClose={onClose}
        subtitle={`Hosting as ${session.name}`} />
      <div style={{ padding: "18px 24px 24px" }}>
        {step === 1 ? (
          <>
            <Field label="Title" error={errors.title}>
              <input style={inputStyle(errors.title)} value={form.title}
                onChange={(e) => setF({ title: e.target.value })} placeholder="Event title" />
            </Field>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <Field label="Event date" error={errors.date}>
                  <input type="date" style={inputStyle(errors.date)} value={form.date}
                    onChange={(e) => setF({ date: e.target.value })} />
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="Event time" error={errors.time}>
                  <input type="time" style={inputStyle(errors.time)} value={form.time}
                    onChange={(e) => setF({ time: e.target.value })} />
                </Field>
              </div>
            </div>
            <Field label="Location" error={errors.location}>
              <input style={inputStyle(errors.location)} value={form.location}
                onChange={(e) => setF({ location: e.target.value })} placeholder="e.g. RCH Room 2" />
            </Field>
            <Field label="Description (optional)">
              <textarea style={{ ...inputStyle(false), minHeight: 80, resize: "vertical" }} value={form.description}
                onChange={(e) => setF({ description: e.target.value })} placeholder="What's happening?" />
            </Field>

            <Toggle label="Registration required?" hint="Members register on your platform of choice. (ex. Eventbrite, Meetup, etc)"
              checked={form.registrationRequired}
              onChange={(v) => setF({ registrationRequired: v, ...(v ? {} : { registrationLink: "" }) })} />
            {form.registrationRequired && (
              <Field label="Registration link" error={errors.registrationLink}>
                <input style={inputStyle(errors.registrationLink)} value={form.registrationLink}
                  onChange={(e) => setF({ registrationLink: e.target.value })} placeholder="https://…" />
              </Field>
            )}

            <Toggle label="Volunteers needed?" hint="Recruiting volunteers for this event."
              checked={form.volunteersNeeded}
              onChange={(v) => setF({ volunteersNeeded: v, ...(v ? {} : { volunteerContact: "" }) })} />
            {form.volunteersNeeded && (
              <Field label="Volunteer contact email" error={errors.volunteerContact}>
                <input style={inputStyle(errors.volunteerContact)} value={form.volunteerContact}
                  onChange={(e) => setF({ volunteerContact: e.target.value })} placeholder="staff@org.example" />
              </Field>
            )}

            <Button style={{ width: "100%", marginTop: 4 }} onClick={() => { if (validate()) setStep(2); }}>Continue</Button>
          </>
        ) : (
          <>
            <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 6, padding: 16, marginBottom: 16 }}>
              <Summary label="Title" value={form.title} />
              <Summary label="When" value={`${fmtPlainDate(form.date)} · ${fmtTime(form.time)}`} />
              <Summary label="Where" value={form.location} />
              <Summary label="Host" value={session.name} />
              <Summary label="Registration" value={form.registrationRequired ? form.registrationLink : "Not required"} />
              <Summary label="Volunteers" value={form.volunteersNeeded ? form.volunteerContact : "Not recruiting"} last />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.ink, margin: "0 0 14px" }}>Is this information correct?</p>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>No, edit</Button>
              <Button style={{ flex: 1 }} onClick={() => {
                onCreate({ ...form, org: session.name });
                toast("Event created and confirmed.");
                onClose();
              }}>Yes, publish</Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

// ===========================================================================
// Event detail modal
// ===========================================================================
function EventDetailModal({ event, onClose, toast }) {
  return (
    <Modal onClose={onClose} width={520}>
      <div style={{ position: "relative" }}>
        <button onClick={onClose} aria-label="Close" className="cf-press" style={{
          position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: 6, zIndex: 2,
          border: `1px solid ${C.line}`, background: C.white, cursor: "pointer", color: C.muted, fontSize: 16,
        }}>×</button>
        <div style={{ padding: "24px 24px 0", paddingRight: 40 }}>
          <h2 style={{ fontFamily: SANS, fontSize: 23, fontWeight: 700, color: C.ink, margin: 0, lineHeight: 1.2 }}>{event.title}</h2>
          <p style={{ fontSize: 13.5, color: C.muted, fontWeight: 600, margin: "6px 0 0" }}>{event.org}</p>
        </div>
        <div style={{ padding: "18px 24px 24px" }}>
          {event.description && <p style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.6, margin: "0 0 16px" }}>{event.description}</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18, borderTop: `1px solid ${C.line}`, paddingTop: 16 }}>
            <DetailRow icon={<CalendarIcon size={15} />} text={fmtPlainDate(event.date)} />
            <DetailRow icon={<ClockIcon size={15} />} text={fmtTime(event.time)} />
            <DetailRow icon={<PinIcon size={15} />} text={event.location} />
            <DetailRow icon={<TicketIcon size={15} />} text={
              event.registrationRequired ? (
                <>Registration required — <a href={event.registrationLink || "#"} target="_blank" rel="noreferrer" onClick={(e) => { if (!event.registrationLink) e.preventDefault(); }} style={{ color: C.ink, fontWeight: 600, textDecoration: "underline", wordBreak: "break-all" }}>{event.registrationLink || "link to come"}</a></>
              ) : "No registration required — just show up"
            } />
            {event.volunteersNeeded && (
              <DetailRow icon={<UserIcon size={15} />} text={<>Volunteers wanted — <a href={`mailto:${event.volunteerContact}`} style={{ color: C.ink, fontWeight: 600, textDecoration: "underline" }}>{event.volunteerContact}</a></>} />
            )}
          </div>
          {event.registrationRequired && (
            <a href={event.registrationLink || "#"} target="_blank" rel="noreferrer"
              onClick={(e) => { if (!event.registrationLink) e.preventDefault(); toast("Opening registration…"); }}
              style={{ textDecoration: "none" }}>
              <Button style={{ width: "100%" }}>Register on host's site ↗</Button>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}

function DetailRow({ icon, text }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: C.ink, lineHeight: 1.45 }}>
      <span style={{ flexShrink: 0, color: C.muted, marginTop: 1 }}>{icon}</span><span>{text}</span>
    </div>
  );
}

// ===========================================================================
// Event card
// ===========================================================================
function EventCard({ event, onClick, idx }) {
  return (
    <div onClick={onClick} className="cf-card-hover" style={{
      background: C.white, border: `1px solid ${C.line}`, borderRadius: 8,
      cursor: "pointer", display: "flex", flexDirection: "column",
      animation: `cf-stagger .35s ease ${idx * 0.04}s both`, padding: 18, gap: 10,
    }}>
      {/* Tags now live inside the card (no image) */}
      {(event.registrationRequired || event.volunteersNeeded) && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {event.registrationRequired && <Tag>Registration</Tag>}
          {event.volunteersNeeded && <Tag tone="outline">Volunteers wanted</Tag>}
        </div>
      )}

      <div style={{ minWidth: 0 }}>
        <InlineDate date={event.date} style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: C.muted, marginBottom: 4, letterSpacing: 0.3 }} />
        <h3 style={{ fontFamily: SANS, fontSize: 17, fontWeight: 700, color: C.ink, margin: 0, lineHeight: 1.25 }}>{event.title}</h3>
        <p style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, margin: "4px 0 0" }}>{event.org}</p>
      </div>

      {event.description && <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5, margin: 0,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{event.description}</p>}

      {/* Time left, location right-aligned in the same row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: 12.5, color: C.muted, borderTop: `1px solid ${C.line}`, paddingTop: 10, marginTop: "auto" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ClockIcon /> {fmtTime(event.time)}</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, textAlign: "right", minWidth: 0 }}>
          <PinIcon /> <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.location}</span>
        </span>
      </div>
    </div>
  );
}

// ===========================================================================
// Month-grid calendar view
// ===========================================================================
function CalendarView({ events, onSelect }) {
  const [cursor, setCursor] = useState(() => parseDate(events[0]?.date || "2026-06-01"));
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay = useMemo(() => {
    const map = {};
    events.forEach((e) => {
      const d = parseDate(e.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        (map[d.getDate()] = map[d.getDate()] || []).push(e);
      }
    });
    Object.values(map).forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [events, year, month]);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ fontFamily: SANS, fontSize: 19, fontWeight: 700, color: C.ink, margin: 0 }}>
          {MONTHS_FULL[month]} {year}
        </h3>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" style={{ padding: "6px 12px" }} onClick={() => setCursor(new Date(year, month - 1, 1))}>‹</Button>
          <Button variant="ghost" style={{ padding: "6px 12px" }} onClick={() => setCursor(new Date(year, month + 1, 1))}>›</Button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {DOW.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 0.5, paddingBottom: 4 }}>{d}</div>
        ))}
        {cells.map((d, i) => (
          <div key={i} style={{
            minHeight: 84, minWidth: 0, borderRadius: 6, padding: 6,
            border: d ? `1px solid ${C.line}` : "1px solid transparent",
            background: d ? C.paper : "transparent",
          }}>
            {d && <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 4 }}>{d}</div>}
            {d && (byDay[d] || []).map((e) => (
              <div key={e.id} onClick={() => onSelect(e)} className="cf-press" title={`${fmtTime(e.time)} ${e.title}`} style={{
                background: C.accent, color: C.white, fontSize: 10.5, fontWeight: 600,
                borderRadius: 4, padding: "3px 6px", marginBottom: 3, cursor: "pointer",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%",
              }}>{fmtTime(e.time).replace(":00", "")} {e.title}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// Directory + profile
// ===========================================================================
function LogoPlaceholder({ size = 72, radius = 6 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: C.paper, border: `1px dashed ${C.muted}`,
      display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
      color: C.muted, fontSize: Math.max(8.5, size * 0.12), fontWeight: 600, lineHeight: 1.2,
      letterSpacing: 0.2, padding: 4, fontFamily: SANS,
    }}>[logo placeholder]</div>
  );
}

function OrgCard({ org, onClick, idx }) {
  return (
    <div onClick={onClick} className="cf-card-hover" style={{
      background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: 20, cursor: "pointer",
      animation: `cf-stagger .35s ease ${idx * 0.04}s both`,
      display: "flex", gap: 18, alignItems: "flex-start",
    }}>
      <LogoPlaceholder size={72} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontFamily: SANS, fontSize: 18, fontWeight: 700, color: C.ink, margin: "0 0 6px", lineHeight: 1.25 }}>{org.name}</h3>
        <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.5, margin: 0 }}>{org.blurb}</p>
      </div>
    </div>
  );
}

function ProfileView({ org, events, onBack, onSelectEvent }) {
  const orgEvents = events.filter((e) => e.org === org.name);
  return (
    <div style={{ animation: "cf-fade .3s ease" }}>
      <button onClick={onBack} style={{ ...linkBtn, textDecoration: "none", marginBottom: 18, fontSize: 14, color: C.ink, fontWeight: 600 }}>‹ Back to directory</button>
      <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: 28, marginBottom: 24, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <LogoPlaceholder size={104} radius={8} />
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontFamily: SANS, fontSize: 28, fontWeight: 700, color: C.ink, margin: "0 0 12px", lineHeight: 1.2 }}>{org.name}</h1>
          <p style={{ fontSize: 15, color: C.ink, lineHeight: 1.6, margin: "0 0 18px", maxWidth: 640 }}>{org.blurb}</p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 13.5 }}>
            <span style={{ color: C.muted, display: "inline-flex", alignItems: "center", gap: 6 }}><MailIcon /> <a href={`mailto:${org.contact}`} style={{ color: C.ink, textDecoration: "underline" }}>{org.contact}</a></span>
            <span style={{ color: C.muted, display: "inline-flex", alignItems: "center", gap: 6 }}><LinkIcon /> <a href="#" onClick={(e) => e.preventDefault()} style={{ color: C.ink, textDecoration: "underline" }}>{org.website}</a></span>
          </div>
        </div>
      </div>
      <h2 style={{ fontFamily: SANS, fontSize: 21, fontWeight: 700, color: C.ink, margin: "0 0 14px" }}>Upcoming events</h2>
      {orgEvents.length === 0 ? (
        <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: "24px", textAlign: "center", color: C.muted, fontSize: 14 }}>
          No upcoming events from this organization yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orgEvents.map((e) => (
            <div key={e.id} onClick={() => onSelectEvent(e)} className="cf-press" style={{
              background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: 14,
              display: "flex", gap: 14, alignItems: "center", cursor: "pointer",
            }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: SANS, fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>{e.title}</h4>
                <p style={{ fontSize: 12.5, color: C.muted, margin: "4px 0 0" }}>
                  <InlineDate date={e.date} /> · {fmtTime(e.time)} · {e.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// Header
// ===========================================================================
function Header({ view, setView, session, onLogin, onCreateAccount, onLogout }) {
  const navItem = (label, target) => {
    const active = view === target;
    return (
      <button onClick={() => setView(target)} style={{
        background: "none", border: "none", cursor: "pointer", fontFamily: SANS,
        fontSize: 14.5, fontWeight: 600, color: active ? C.ink : C.muted, padding: "4px 0",
        borderBottom: active ? `2px solid ${C.accent}` : "2px solid transparent",
      }}>{label}</button>
    );
  };
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: C.white, borderBottom: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <button onClick={() => setView("landing")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 0 }}>
          <CFLogo size={38} color={C.ink} />
          <span style={{ textAlign: "left", lineHeight: 1.1 }}>
            <span style={{ display: "block", fontFamily: SANS, fontSize: 16, fontWeight: 700, color: C.ink }}>Commons Fabric</span>
            <span style={{ display: "block", fontSize: 11, color: C.muted, fontWeight: 500 }}>Community Calendar</span>
          </span>
        </button>
        <nav style={{ display: "flex", gap: 22, marginLeft: "auto", marginRight: 8 }}>
          {navItem("Events", "landing")}
          {navItem("Directory", "directory")}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {session ? (
            <>
              <span style={{ fontSize: 13, color: C.ink, fontWeight: 600, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.name}</span>
              <Button variant="ghost" onClick={onLogout} style={{ padding: "8px 14px" }}>Log out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onLogin} style={{ padding: "8px 14px" }}>Log in</Button>
              <Button onClick={onCreateAccount} style={{ padding: "8px 14px" }}>Create account</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ===========================================================================
// Toast
// ===========================================================================
function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 200,
      background: C.ink, color: C.white, padding: "12px 22px", borderRadius: 6, fontSize: 14, fontWeight: 500,
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)", animation: "cf-rise .3s ease",
      maxWidth: "90vw", textAlign: "center", fontFamily: SANS,
    }}>{message}</div>
  );
}

// ===========================================================================
// App
// ===========================================================================
export default function App() {
  const [view, setView] = useState("landing");
  const [eventsView, setEventsView] = useState("grid");
  const [events, setEvents] = useState(SEED_EVENTS);
  const [orgs] = useState(SEED_ORGS);
  const [accounts, setAccounts] = useState([
    { name: "Ottawa Civic Tech", email: "hi@ottawacivictech.example", password: "demo123" },
  ]);
  const [session, setSession] = useState(null);
  const [activeOrg, setActiveOrg] = useState(null);
  const [modal, setModal] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(null);

  // Grid date-range filter
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  // Directory search + sort
  const [orgSearch, setOrgSearch] = useState("");
  const [orgSort, setOrgSort] = useState("az");

  const toast = (msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2600);
  };

  const addEvent = (e) => setEvents((prev) => [{ ...e, id: Date.now() }, ...prev]);
  const openProfile = (org) => { setActiveOrg(org); setView("profile"); window.scrollTo(0, 0); };

  const gridEvents = useMemo(() => {
    return events.filter((e) => {
      if (rangeStart && e.date < rangeStart) return false;
      if (rangeEnd && e.date > rangeEnd) return false;
      return true;
    }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [events, rangeStart, rangeEnd]);

  const visibleOrgs = useMemo(() => {
    const q = orgSearch.trim().toLowerCase();
    let list = orgs.filter((o) => !q || o.name.toLowerCase().includes(q) || o.blurb.toLowerCase().includes(q));
    list = [...list].sort((a, b) =>
      orgSort === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return list;
  }, [orgs, orgSearch, orgSort]);

  const selectBase = {
    padding: "8px 11px", borderRadius: 6, fontSize: 13.5, border: `1px solid ${C.line}`,
    background: C.white, color: C.ink, fontFamily: SANS, outline: "none", cursor: "pointer",
  };

  return (
    <div style={{ background: C.paper, minHeight: "100vh", color: C.ink, fontFamily: SANS }}>
      <style>{STYLES}</style>

      <Header
        view={view} setView={(v) => { setView(v); setActiveOrg(null); }}
        session={session}
        onLogin={() => setModal("login")}
        onCreateAccount={() => setModal("createAccount")}
        onLogout={() => { setSession(null); toast("Logged out."); }}
      />

      <main style={{ maxWidth: 1040, margin: "0 auto", padding: "36px 24px 80px" }}>
        {view === "landing" && (
          <>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontFamily: SANS, fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: C.ink, margin: "0 0 10px", lineHeight: 1.1 }}>
                What's happening at the Hub
              </h1>
              <p style={{ fontSize: 16, color: C.muted, margin: 0, maxWidth: 560, lineHeight: 1.5 }}>
                One shared place to discover and share events across the Rideau Community Hub network.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ display: "inline-flex", background: C.white, border: `1px solid ${C.line}`, borderRadius: 6, padding: 3 }}>
                  {["grid", "calendar"].map((m) => (
                    <button key={m} onClick={() => setEventsView(m)} style={{
                      border: "none", cursor: "pointer", fontFamily: SANS, fontSize: 13, fontWeight: 600,
                      padding: "7px 16px", borderRadius: 4,
                      background: eventsView === m ? C.accent : "transparent", color: eventsView === m ? C.white : C.muted,
                    }}>{m === "grid" ? "Card grid" : "Calendar"}</button>
                  ))}
                </div>
                {session && (
                  <Button onClick={() => setModal("createEvent")}>+ Create an event</Button>
                )}
              </div>
            </div>

            {/* Date range filter — grid view only */}
            {eventsView === "grid" && (
              <div style={{
                display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: "12px 14px", marginBottom: 18,
              }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, letterSpacing: 0.3 }}>FILTER BY DATE</span>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: C.muted }}>
                  From
                  <input type="date" value={rangeStart} onChange={(e) => setRangeStart(e.target.value)} style={{ ...selectBase, padding: "7px 9px" }} />
                </label>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: C.muted }}>
                  To
                  <input type="date" value={rangeEnd} onChange={(e) => setRangeEnd(e.target.value)} style={{ ...selectBase, padding: "7px 9px" }} />
                </label>
                {(rangeStart || rangeEnd) && (
                  <Button variant="ghost" style={{ padding: "7px 12px" }} onClick={() => { setRangeStart(""); setRangeEnd(""); }}>Clear</Button>
                )}
                <span style={{ marginLeft: "auto", fontSize: 12.5, color: C.muted }}>
                  {gridEvents.length} event{gridEvents.length === 1 ? "" : "s"}
                </span>
              </div>
            )}

            {eventsView === "grid" ? (
              gridEvents.length === 0 ? (
                <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: "36px", textAlign: "center", color: C.muted, fontSize: 14 }}>
                  No events fall within this date range.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
                  {gridEvents.map((e, i) => (
                    <EventCard key={e.id} event={e} idx={i} onClick={() => setSelectedEvent(e)} />
                  ))}
                </div>
              )
            ) : (
              <CalendarView events={events} onSelect={(e) => setSelectedEvent(e)} />
            )}
          </>
        )}

        {view === "directory" && (
          <>
            <div style={{ marginBottom: 22 }}>
              <h1 style={{ fontFamily: SANS, fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: C.ink, margin: "0 0 10px", lineHeight: 1.1 }}>
                Organization directory
              </h1>
              <p style={{ fontSize: 16, color: C.muted, margin: 0, maxWidth: 560, lineHeight: 1.5 }}>
                The non-profits and community groups sharing space at the Rideau Community Hub.
              </p>
            </div>

            {/* Search + sort */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
              <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
                <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.muted, pointerEvents: "none" }}><SearchIcon /></span>
                <input
                  value={orgSearch}
                  onChange={(e) => setOrgSearch(e.target.value)}
                  placeholder="Search organizations…"
                  style={{ ...selectBase, width: "100%", paddingLeft: 34, cursor: "text" }}
                />
              </div>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: C.muted }}>
                Sort
                <select value={orgSort} onChange={(e) => setOrgSort(e.target.value)} style={selectBase}>
                  <option value="az">A → Z</option>
                  <option value="za">Z → A</option>
                </select>
              </label>
            </div>

            {visibleOrgs.length === 0 ? (
              <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: "36px", textAlign: "center", color: C.muted, fontSize: 14 }}>
                No organizations match “{orgSearch}”.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {visibleOrgs.map((o, i) => (
                  <OrgCard key={o.id} org={o} idx={i} onClick={() => openProfile(o)} />
                ))}
              </div>
            )}
          </>
        )}

        {view === "profile" && activeOrg && (
          <ProfileView org={activeOrg} events={events}
            onBack={() => { setView("directory"); setActiveOrg(null); }}
            onSelectEvent={(e) => setSelectedEvent(e)} />
        )}
      </main>

      {/* Modals */}
      {modal === "createAccount" && (
        <CreateAccountModal onClose={() => setModal(null)} toast={toast}
          onCreate={(acct) => setAccounts((prev) => [...prev, acct])} />
      )}
      {modal === "login" && (
        <LoginModal onClose={() => setModal(null)} accounts={accounts} toast={toast}
          onLogin={(acct) => setSession(acct)} />
      )}
      {modal === "createEvent" && session && (
        <CreateEventModal onClose={() => setModal(null)} session={session} toast={toast} onCreate={addEvent} />
      )}
      {selectedEvent && (
        <EventDetailModal event={events.find((e) => e.id === selectedEvent.id) || selectedEvent}
          onClose={() => setSelectedEvent(null)} toast={toast} />
      )}

      <Toast message={toastMsg} />
    </div>
  );
}
