/**
 * Date/time formatting, built on date-fns.
 *
 * Every formatter here takes a `Date` - an absolute instant - and renders it in
 * the viewer's own timezone, which is what date-fns `format` does by default.
 * Timestamps arrive from the API as RFC 3339 strings with an offset and are
 * resolved into `Date`s once, at the api/ boundary, so no timestamp string is
 * parsed in this file.
 *
 * The date-key and form helpers at the bottom are the exception: the values an
 * `<input type="date">` or `<input type="time">` produces carry no offset, so
 * they are read in the viewer's timezone - the clock they typed against.
 */

import { endOfDay, endOfMonth, format, isValid, parse, startOfDay, startOfMonth } from "date-fns";

import type { DateKey, DBTimestamp, Timespan } from "./types/dates";

const DATE_ONLY = "yyyy-MM-dd";
const TIME_ONLY = "HH:mm";
const WALL_CLOCK = `${DATE_ONLY}'T'${TIME_ONLY}`;

/**
 * Only seconds and milliseconds are ever taken from the reference date - every
 * other field comes from the string being parsed - so a fixed epoch keeps the
 * result from depending on when it ran.
 */
const REFERENCE = new Date(0);

/** "JUN 16" */
export function fmtDateChip(d: Date) {
  return { month: format(d, "MMM").toUpperCase(), day: format(d, "d") };
}

/** "June 16" */
export function fmtMonthDate(d: Date): string {
  return format(d, "MMMM d");
}

/** "Saturday, June 20th, 2026" */
export function fmtPlainDate(d: Date): string {
  return format(d, "EEEE, MMMM do, yyyy");
}

/** "10:00 AM" */
export function fmtTime(d: Date): string {
  return format(d, "h:mm a");
}

/** "YYYY-MM-DD", the day this instant falls on for the viewer. */
export function toDateKey(d: Date): DateKey {
  return format(d, DATE_ONLY);
}

/** Inverse of toDateKey: midnight on that day in the viewer's timezone. */
export function fromDateKey(key: DateKey): Date {
  const day = parse(key, DATE_ONLY, REFERENCE);
  if (!isValid(day)) throw new Error(`expected a YYYY-MM-DD date key, got ${key}`);
  return day;
}

/**
 * Widens one edge of a day-granular window into the instant the API filters on.
 * The day is bounded in the viewer's timezone, so the window covers exactly the
 * days they picked rather than a UTC day that straddles two of them.
 */
export function dayEdge(key: DateKey, edge: "start" | "end"): DBTimestamp {
  const day = fromDateKey(key);
  return (edge === "start" ? startOfDay(day) : endOfDay(day)).toISOString();
}

/** Start and end of the month containing `date` - the calendar's fetch window. */
export function monthBounds(date: Date): Timespan {
  return { start: toDateKey(startOfMonth(date)), end: toDateKey(endOfMonth(date)) };
}

/** The create-event form's two inputs read as one instant in the viewer's timezone. */
export function localDateTime(date: DateKey, time: string): Date {
  const d = parse(`${date}T${time}`, WALL_CLOCK, REFERENCE);
  if (!isValid(d)) throw new Error(`could not read ${date} ${time} as a date and time`);
  return d;
}

/** That instant as the RFC 3339 string the API stores. */
export function fromDateAndTime(date: DateKey, time: string): DBTimestamp {
  return localDateTime(date, time).toISOString();
}
