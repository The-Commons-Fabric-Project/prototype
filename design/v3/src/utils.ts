import { DEFAULT_DURATION_MIN, DURATIONS, HOST_ORDER, PALETTE, SEED_ORGS } from "./data";
import type { CalendarEvent, HostColorKey, HostPalette, RepeatFrequency } from "./types";

export const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const MONTHS_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const DOW_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const EMAIL_RE = /\S+@\S+\.\S+/;
export const FREQ_LABEL: Record<RepeatFrequency, string> = { weekly: "week", biweekly: "two weeks", monthly: "month" }; // added

/** Parse YYYY-MM-DD as a LOCAL date (new Date(iso) would parse as UTC and shift the day). */
// no change
export function parseDate(d: string): Date {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

// added
export function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// no change
export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** "Saturday, June 20th, 2026" */
// no change
export function fmtPlainDate(d: string): string {
  const dt = parseDate(d);
  return `${DOW_FULL[dt.getDay()]}, ${MONTHS_FULL[dt.getMonth()]} ${ordinal(dt.getDate())}, ${dt.getFullYear()}`;
}

export function minutesOf(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** 690 -> "11:30 AM" */
export function fmtMinutes(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Compact form for narrow week columns: 690 -> "11:30a", 720 -> "12p" */
export function fmtShortMinutes(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const suffix = h >= 12 ? "p" : "a";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}${m ? ":" + String(m).padStart(2, "0") : ""}${suffix}`;
}

/** "10:00" -> "10:00 AM" */
export function fmtTime(t: string): string {
  return fmtMinutes(minutesOf(t));
}

/**
 * Event length in minutes. Prefers the explicit end date/time, supports
 * multi-day spans, then falls back to a per-event override or the seed table.
 */
export function durationOf(e: CalendarEvent): number {
  if (e.endTime) {
    const spanDays =
      e.endDate && e.endDate !== e.date
        ? Math.round((parseDate(e.endDate).getTime() - parseDate(e.date).getTime()) / 86400000)
        : 0;
    return Math.max(15, minutesOf(e.endTime) + spanDays * 1440 - minutesOf(e.time));
  }
  return e.durationMin || DURATIONS[e.id] || DEFAULT_DURATION_MIN;
}

export function orgColorKey(idx: number): HostColorKey {
  return HOST_ORDER[idx % HOST_ORDER.length];
}

/** "The Council on Aging of Ottawa" -> "TCAO" (max 4 letters) */
export function orgInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 4);
}

export function paletteForOrgName(name: string): HostPalette {
  const idx = SEED_ORGS.findIndex((o) => o.name === name);
  return PALETTE[orgColorKey(idx < 0 ? 0 : idx)];
}

export function linearGradient(dir: string, from: string, to: string): string {
  return `linear-gradient(${dir},${from},${to})`;
}

/**
 * Expand a recurrence rule into ISO dates. Weekly/biweekly walk week blocks and
 * emit the selected weekdays; monthly repeats the same date. The start date is
 * always included. Capped at 60 occurrences.
 */
// added
export function occurrenceDates(f: {
  date: string;
  recurring: boolean;
  frequency: RepeatFrequency;
  repeatDays: number[];
  repeatUntil: string;
}): string[] {
  if (!f.recurring || !f.repeatUntil) return [f.date];
  const start = parseDate(f.date);
  const until = parseDate(f.repeatUntil);
  const out: string[] = [];

  if (f.frequency === "monthly") {
    const d = new Date(start);
    while (d <= until && out.length < 60) {
      out.push(toIso(d));
      d.setMonth(d.getMonth() + 1);
    }
  } else {
    const step = f.frequency === "biweekly" ? 14 : 7;
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() - start.getDay());
    for (let w = 0; out.length < 60; w += step) {
      const base = new Date(weekStart);
      base.setDate(weekStart.getDate() + w);
      if (base > until) break;
      [...f.repeatDays].sort((a, b) => a - b).forEach((dow) => {
        const d = new Date(base);
        d.setDate(base.getDate() + dow);
        if (d >= start && d <= until) out.push(toIso(d));
      });
    }
  }

  if (!out.includes(f.date)) out.push(f.date);
  return out.sort();
}
