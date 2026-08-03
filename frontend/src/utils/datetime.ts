/**
 * Helper functions for parsing and formatting dates and times
 */

import { MONTHS, MONTHS_FULL, DOW, DOW_FULL } from "./types/dates";

export function parseDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

/**
 * Splits an RFC 3339 timestamp into the two strings the rest of this file - and
 * DateChip, InlineDate and the calendar - already speak.
 *
 * Both read the date in the *viewer's* timezone rather than UTC. That matters:
 * an Ottawa event at 20:00 is 00:00 or 01:00 the next day in UTC, so
 * `toISOString().slice(0, 10)` would file every evening event under tomorrow.
 */
export function toDateKey(iso: string) {
  const dt = new Date(iso);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

export function toTimeKey(iso: string) {
  const dt = new Date(iso);
  return `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`;
}

/**
 * The inverse of toDateKey/toTimeKey: builds an RFC 3339 timestamp from the
 * separate date and time an <input type="date"> and <input type="time"> produce.
 *
 * Interpreted in the viewer's timezone, because that is what they typed - "the
 * 14th at 7pm" means 7pm where the person entering it is. The returned string is
 * UTC, which is what the API stores.
 */
export function fromDateAndTime(date: string, time: string) {
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

export function ordinal(n: number) { 
  const s = ["th","st","nd","rd"]; 
  const v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); 
}

export function fmtMonthDate(d: string) { 
  const dt = parseDate(d); 
  return `${MONTHS_FULL[dt.getMonth()]} ${dt.getDate()}`; 
}

export function fmtPlainDate(d: string) { 
  const dt = parseDate(d); 
  return `${DOW_FULL[dt.getDay()]}, ${MONTHS_FULL[dt.getMonth()]} ${ordinal(dt.getDate())}, ${dt.getFullYear()}`; 
}

export function fmtLongDate(d: string) { 
  const dt = parseDate(d); 
  return `${DOW[dt.getDay()]}, ${MONTHS_FULL[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`; 
}

export function fmtTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}