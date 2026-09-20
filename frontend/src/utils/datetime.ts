/**
 * Date/time parsing and formatting, built on date-fns.
 *
 * OPEN API SPEC: "YYYY-MM-DD HH:MM:SS-ZZ:zz"
 *
 * The functions that take a timestamp accept either the raw API string or an
 * already-parsed Date, because callers hold one or the other depending on
 * whether they have gone through parseDate yet.
 */

import { endOfMonth, format, isValid, parse, startOfMonth } from "date-fns";

import type { DBTimestamp, Timespan } from "./types/dates";

/** The literal layout the API writes, read up to the minute. */
const WALL_CLOCK = "yyyy-MM-dd'T'HH:mm";
const DATE_ONLY = "yyyy-MM-dd";
const TIME_ONLY = "HH:mm";

/**
 * Only seconds and milliseconds are ever taken from the reference date - every
 * other field comes from the string being parsed - so a fixed epoch keeps the
 * result from depending on when it ran.
 */
const REFERENCE = new Date(0);

export function parseDate(d: DBTimestamp): Date {
  const parsed = d.includes("T")
    ? parse(d.slice(0, 16), WALL_CLOCK, REFERENCE)
    : parse(d.slice(0, 10), DATE_ONLY, REFERENCE);

  if (!isValid(parsed)) throw new Error(`timestamp parse failed on ${d}`);
  return parsed;
}

/** Accepts either end of the parse, so callers pass whichever they are holding. */
function asDate(d: Date | DBTimestamp): Date {
  return typeof d === "string" ? parseDate(d) : d;
}

/** inverse of parseDate, Date -> DB string to store WITH timezone offset */
export function toIso(d: Date): DBTimestamp {
  return format(d, `${WALL_CLOCK}XXX`);
}

/** "YYYY-MM-DD" */
export function toDateKey(d: Date | DBTimestamp): string {
  return format(asDate(d), DATE_ONLY);
}

/** "HH:MM" */
export function toTimeKey(d: Date | DBTimestamp): string {
  return format(asDate(d), TIME_ONLY);
}

/**
 * The inverse of toDateKey/toTimeKey. Interpreted in the viewer's timezone, because
 * that is what they typed; returned as the UTC string the API stores.
 */
export function fromDateAndTime(date: string, time: string): string {
  return parse(`${date}T${time}`, WALL_CLOCK, REFERENCE).toISOString();
}

/** Start and end of the month containing `date`, as "YYYY-MM-DD" - the calendar's fetch window. */
export function monthBounds(date: Date): Timespan {
  return { start: toDateKey(startOfMonth(date)), end: toDateKey(endOfMonth(date)) };
}

/** "JUN 16" */
export function fmtDateChip(dt: Date | DBTimestamp) {
  const d = asDate(dt);
  return { month: format(d, "MMM").toUpperCase(), day: format(d, "d") };
}

/** "June 16" */
export function fmtMonthDate(dt: Date | DBTimestamp): string {
  return format(asDate(dt), "MMMM d");
}

/** "Saturday, June 20th, 2026" */
export function fmtPlainDate(dt: Date | DBTimestamp): string {
  return format(asDate(dt), "EEEE, MMMM do, yyyy");
}

/**
 * "10:00 AM", from a full timestamp or the bare "HH:MM" a time input produces.
 * The bare form is tried first; a full timestamp fails it and falls through.
 */
export function fmtTime(t: Date | DBTimestamp): string {
  if (typeof t !== "string") return format(t, "h:mm a");

  const timeOnly = parse(t, TIME_ONLY, REFERENCE);
  return format(isValid(timeOnly) ? timeOnly : parseDate(t), "h:mm a");
}
