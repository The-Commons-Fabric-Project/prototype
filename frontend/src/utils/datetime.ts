/**
 * Helper functions for parsing and formatting dates and times
 */

import { MONTHS, MONTHS_FULL, DOW, DOW_FULL, type RepeatFrequency } from "./types/dates";

// DATES
///////////////////////////////////////////

/** Parse YYYY-MM-DD as a LOCAL date (new Date(iso) would parse as UTC and shift the day). */
export function parseDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

/**
 * Splits an RFC 3339 timestamp into the "YYYY-MM-DD" and "HH:MM" strings the rest of
 * this file speaks, read in the viewer's timezone - `toISOString().slice(0, 10)`
 * would file an Ottawa evening event under tomorrow.
 */
export function toIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function toDateKey(iso: string): string {  return toIso(new Date(iso)); }

export function toTimeKey(iso: string): string {
  const dt = new Date(iso);
  return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

/**
 * The inverse of toDateKey/toTimeKey. Interpreted in the viewer's timezone, because
 * that is what they typed; returned as the UTC string the API stores.
 */
export function fromDateAndTime(date: string, time: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0).toISOString();
}

/** Start and end of the month containing `date`, as "YYYY-MM-DD" - the calendar's fetch window. */
export function monthBounds(date: Date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const key = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { start: key(first), end: key(last) };
}

export function fmtDateChip(d: string) { 
  const dt = parseDate(d); 
  
  return { 
    month: MONTHS[dt.getMonth()].toUpperCase(), 
    day: dt.getDate() 
  }; 
}

export function ordinal(n: number): string { 
  const s = ["th","st","nd","rd"]; 
  const v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); 
}

export function fmtMonthDate(d: string): string { 
  const dt = parseDate(d); 
  return `${MONTHS_FULL[dt.getMonth()]} ${dt.getDate()}`; 
}

/** "Saturday, June 20th, 2026" */
export function fmtPlainDate(d: string): string { 
  const dt = parseDate(d); 
  return `${DOW_FULL[dt.getDay()]}, ${MONTHS_FULL[dt.getMonth()]} ${ordinal(dt.getDate())}, ${dt.getFullYear()}`; 
}

export function fmtLongDate(d: string) { 
  const dt = parseDate(d); 
  return `${DOW[dt.getDay()]}, ${MONTHS_FULL[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`; 
}

// TIMES
///////////////////////////////////////////

/** "10:00" -> "10:00 AM" */
export function fmtTime(t: string): string { return fmtMinutes(minutesOf(t)); }

/** Takes the 12-hour string produced by fmtTime and drops a `:00`. */
export function fmtShortTime(time: string): string {
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return time;
  const [, h, m, period] = match;
  return m === '00' ? `${h} ${period.toUpperCase()}` : `${h}:${m} ${period.toUpperCase()}`;
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

/**
 * Event length in minutes. Prefers the explicit end date/time, supports
 * multi-day spans, then falls back to a per-event override or the seed table.
 * 
 * FIXME: new duration types and calendar event
 */
export function durationOf(e: CalendarEvent): number {
  if (e.endTime) {
    const spanDays =
      e.endDate && e.endDate !== e.date
        ? Math.round((parseDate(e.endDate).getTime() - parseDate(e.date).getTime()) / 86400000)
        : 0;
    return Math.max(15, minutesOf(e.endTime) + spanDays * 1440 - minutesOf(e.time));
  }
  return e.durationMin; //|| DURATIONS[e.id] || DEFAULT_DURATION_MIN;
}

/**
 * Expand a recurrence rule into ISO dates. Weekly/biweekly walk week blocks and
 * emit the selected weekdays; monthly repeats the same date. The start date is
 * always included. Capped at 60 occurrences.
 */
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
