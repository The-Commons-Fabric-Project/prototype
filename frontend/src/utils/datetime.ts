/**
 * Helper functions for parsing and formatting dates and times
 * 
 * OPEN API SPEC: "YYYY-MM-DD HH:MM:SS-ZZ:zz"
 * in the works - adding timezone as UTC offset https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
 */

import { MONTHS, MONTHS_FULL, DOW, DOW_FULL } from "./types/dates";
import type { RepeatFrequency, ParsedTimestamp, DBTimestamp, Timespan } from "./types/dates";
import { padNumString } from "./stringcheck";
import type { Event } from "../api/events";

/** YYYY-MM-DD */
const DATE_RE = /([12]\d{3})-(0\d|1[012])-([0-3]\d)/;
/** 24 hour time HH:MM */
const TIME_RE = /([01]\d|2[0-3]):([0-5]\d)/;
const AMPMTIME_RE = /^(\d+):(\d+)\s*(AM|PM)$/i;
const TIMESTAMP_RE = new RegExp(`${DATE_RE.source}T${TIME_RE.source}`)
// /([12]\d{3})-(0\d|1[012])-([0-3]\d)T([01]\d|2[0-3]):([0-5]\d)/;

/** 
 * Parse a timestamp from the database into a Date object (in UTC but not adjusted with offset) 
 */
export function parseDate(d: DBTimestamp): ParsedTimestamp {
  if (TIMESTAMP_RE.test(d)) {
    const matches = TIMESTAMP_RE.exec(d) as RegExpExecArray;
    // always skip the first match for the whole regex
    const [,y, m, day, hr, min] = matches.map(Number);
    return new Date(y, m - 1, day, hr, min);
  } else if (DATE_RE.test(d)) {
    const matches = DATE_RE.exec(d) as RegExpExecArray;
    const [,y, m, day] = matches.map(Number);
    return new Date(y, m-1, day);
  } else {
    throw new Error(`timestamp regex failed on ${d}`);
  }
}

/**
 * inverse of parseDate, Date -> DB string to store WITH timezone offset
 */
export function toIso(d: ParsedTimestamp): DBTimestamp {
  const tz = d.getTimezoneOffset();
  const offset = tz > 0 ? 
    `-${padNumString(Math.floor(tz/60))}:${padNumString(tz % 60)}` : 
    `+${padNumString(Math.floor(-tz/60))}:${padNumString((-tz) % 60)}`;
  return `${toDateKey(d)}T${toTimeKey(d)}${offset}`;
}

/** "YYYY-MM-DD" */
export function toDateKey(d: Date): string {  
  return `${d.getFullYear()}-${padNumString(d.getMonth() + 1)}-${padNumString(d.getDate())}`; 
}

/** "HH:SS" */
export function toTimeKey(d: Date): string {
  return `${padNumString(d.getHours())}:${padNumString(d.getMinutes())}`;
}

export function toDateTime(d: Date): string {
  return `${toDateKey(d)} ${toTimeKey(d)}`
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
export function monthBounds(date: Date): Timespan {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start: toDateKey(first), end: toDateKey(last) };
}

/** "JUN 16" */
export function fmtDateChip(dt: string) { 
  const d = parseDate(dt); 
  
  return { 
    month: MONTHS[d.getMonth()].toUpperCase(), 
    day: d.getDate() 
  }; 
}

export function ordinal(n: number): string { 
  const s = ["th","st","nd","rd"]; 
  const v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); 
}

export function fmtMonthDate(dt: string): string { 
  const d = parseDate(dt); 
  return `${MONTHS_FULL[d.getMonth()]} ${d.getDate()}`; 
}

/** "Saturday, June 20th, 2026" */
export function fmtPlainDate(dt: string): string { 
  const d = parseDate(dt); 
  return `${DOW_FULL[d.getDay()]}, ${MONTHS_FULL[d.getMonth()]} ${ordinal(d.getDate())}, ${d.getFullYear()}`; 
}

export function fmtLongDate(dt: string) { 
  const d = parseDate(dt); 
  return `${DOW[d.getDay()]}, ${MONTHS_FULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; 
}

/** "10:00" -> "10:00 AM" */
export function fmtTime(t: string): string { return fmtMinutes(minutesOf(t)); }

/** Takes the 12-hour string produced by fmtTime and drops a `:00`. */
export function fmtShortTime(time: string): string {
  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return time;
  const [, h, m, period] = match;
  return m === '00' ? `${h} ${period.toUpperCase()}` : `${h}:${m} ${period.toUpperCase()}`;
}

/** Converts a time to a length in minutes "11:30 AM -> 690" */
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
export function durationOf(e: Event): number {
  if (e.endsAt) {
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
