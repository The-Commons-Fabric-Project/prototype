/**
 * Helper functions for parsing and formatting dates and times
 */

import { MONTHS, MONTHS_FULL, DOW, DOW_FULL } from "../types/dates";

export function parseDate(d: string) { 
  const [y, m, day] = d.split("-").map(Number); 
  return new Date(y, m - 1, day); 
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