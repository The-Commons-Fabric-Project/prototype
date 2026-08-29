/**
 * The /v1/events operations. No mapping - utils/types/events.ts mirrors the OpenAPI
 * `Event` schema, so a conversion step here would mean the two have drifted.
 */

import { get, post, type QueryString } from './client';
import type { components as c, operations as op } from './openapi.gen';

/**
 * Mirrors the `Event` schema in `backend/src/docs/api/openapi.yaml`. A `GET /v1/events` response is this type with no conversion.
 * 
 * - `organizationId`: resolved server-side thru `ownerId`
 * - `thumbnail`: server-relative path, e.g. `./public/event_images/example.jpg`
 *
 * Use `toDateKey`/`toTimeKey` in utils/datetime.ts for the `YYYY-MM-DD` and `HH:MM` strings the formatters and DateChip expect.
 */
export type Event = c["schemas"]["Event"];
export type EventId = c["schemas"]["EventId"];
export type Timestamp = c["schemas"]["Timestamp"];

export const EVENT_TAGS = {
  "Registration": {
    label: "Registration",
    color: "rgb(80, 122, 189)",
    background: "rgb(231, 238, 247)",
  },
  "Volunteers wanted": {
    label: "Volunteers wanted",
    color: "rgb(242, 165, 65)",
    background: "rgba(242, 165, 65, 0.14)",
  },
} as const

export type EventTag = keyof typeof EVENT_TAGS
export type EventTagInfo = (typeof EVENT_TAGS)[EventTag]

/**
 * Derived rather than stored: an event needs registration exactly when it has a link
 * to register through, so the two cannot fall out of sync.
 */
export const requiresRegistration = (event: Event) => Boolean(event.registrationLink);
export const needsVolunteers = (event: Event) => Boolean(event.volunteerContact);


/**
 * Time window and organization filter for listEvents. Timestamps in "YYYY-MM-DD" or
 * RFC 3339 format; startDate defaults server-side to now (current date), endDate is unbounded.
 */
export type EventQuery = op["listEvents"]["parameters"]["query"];

/**
 * Widens a "YYYY-MM-DD" date to the full timestamp the document requires.
 *
 * The two ends resolve differently because a calendar range includes both: the
 * start from its first instant, the end up to its last. Local time, so a day ends
 * when it ends for the reader rather than in UTC.
 */
function toTimestamp(value: string, edge: 'start' | 'end') {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value; // already a full timestamp

  const [y, m, d] = value.split('-').map(Number);
  const date =
    edge === 'start'
      ? new Date(y, m - 1, d, 0, 0, 0, 0)
      : new Date(y, m - 1, d, 23, 59, 59, 999);
  return date.toISOString();
}

/**
 * Builds the query string, dropping empty values - the date inputs use "" to mean
 * unset, and `startDate=` would fail validation rather than read as absent.
 */
function queryString(query: EventQuery = {}): QueryString | '' {
  const params = new URLSearchParams();
  if (query.startDate) params.set('startDate', toTimestamp(query.startDate, 'start'));
  if (query.endDate) params.set('endDate', toTimestamp(query.endDate, 'end'));
  if (query.organizationId !== undefined) params.set('organizationId', String(query.organizationId));

  const search = params.toString();
  return search ? `?${search}` : '';
}

/** GET /v1/events - events whose startsAt falls in the window, in that order. */
export const listEvents = (query?: EventQuery) => get<Event[]>(`/events${queryString(query)}`);

/** GET /v1/events/{eventId} */
export const getEvent = (eventId: number) => get<Event>(`/events/${eventId}`);

/**
 * The body `POST /v1/events` accepts. 
 * - `ownerId`, `organizationId`, `id` and
 * `createdAt` are the server's to assign, and sending them is rejected.
 * - `startsAt` RFC 3339 timestamp
 */
export type EventCreate = c["schemas"]["EventCreate"];

/**
 * POST /v1/events - publishes an event owned by the signed-in user. Throws ApiError
 * 401 without a session, or when the cookie does not verify.
 */
export const createEvent = (input: EventCreate) => post<Event>('/events', input);
