/**
 * The /v1/events operations.
 *
 * No mapping: utils/types/events.ts mirrors the OpenAPI `Event` schema, so the
 * response body is already the type the UI uses. If these ever need a conversion
 * step, the types have drifted from the document and that is the thing to fix.
 */

import { get, post } from './client';
import type { Event } from '../utils/types/events';

/** Time window and organization filter for listEvents. All optional. */
export interface EventQuery {
  /** "YYYY-MM-DD" or RFC 3339. Defaults server-side to now, so past events are excluded unless asked for. */
  startDate?: string;
  /** "YYYY-MM-DD" or RFC 3339. Unbounded when omitted. Must be later than startDate. */
  endDate?: string;
  organizationId?: number;
}

/**
 * Widens a plain calendar date to the instant the API actually wants.
 *
 * The window comes from `<input type="date">` and from month arithmetic, so it
 * arrives as "YYYY-MM-DD". The document declares both parameters as
 * `format: date-time`, and the validator rejects a bare date with a 400 - so
 * passing the UI's value through untouched fails every request.
 *
 * A date range in a calendar is inclusive of both ends, which is why the two
 * ends resolve differently: the 1st means from its first instant, the 30th means
 * up to its last. Both are resolved in local time, so "June 30th" ends when it
 * ends for the person reading the page rather than in UTC.
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
 * Builds the query string, dropping empty values.
 *
 * The date inputs use "" to mean unset, and sending `startDate=` would fail
 * validation rather than be read as absent.
 */
function queryString(query: EventQuery = {}) {
  const params = new URLSearchParams();
  if (query.startDate) params.set('startDate', toTimestamp(query.startDate, 'start'));
  if (query.endDate) params.set('endDate', toTimestamp(query.endDate, 'end'));
  if (query.organizationId !== undefined) params.set('organizationId', String(query.organizationId));

  const search = params.toString();
  return search ? `?${search}` : '';
}

/**
 * GET /v1/events - events whose startsAt falls within the window, ordered by
 * startsAt.
 */
export const listEvents = (query?: EventQuery) => get<Event[]>(`/events${queryString(query)}`);

/** GET /v1/events/{eventId} */
export const getEvent = (eventId: number) => get<Event>(`/events/${eventId}`);

/**
 * The body `POST /v1/events` accepts - the `EventCreate` schema.
 *
 * Note what is *not* here. `ownerId` comes from the session cookie and
 * `organizationId` is derived from that owner, so neither can be sent; the
 * document rejects a body carrying them rather than ignoring them, which is what
 * stops a caller publishing as somebody else. `id` and `createdAt` are likewise
 * the server's to assign.
 */
export interface EventCreate {
  title: string;
  /** RFC 3339. */
  startsAt: string;
  location?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  registrationLink?: string | null;
  volunteerContact?: string | null;
}

/**
 * POST /v1/events - publishes an event owned by the signed-in user.
 *
 * Requires a session: throws ApiError 401 when there is none, or when the cookie
 * does not verify.
 */
export const createEvent = (input: EventCreate) => post<Event>('/events', input);
