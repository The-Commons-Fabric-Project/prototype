/**
 * The /v1/events operations. No mapping - utils/types/events.ts mirrors the OpenAPI
 * `Event` schema, so a conversion step here would mean the two have drifted.
 */

import { get, post } from './client';
import type { Event } from '../utils/types/events';
import type { components } from './openapi';

/**
 * Time window and organization filter for listEvents. Timestamps in "YYYY-MM-DD" or
 * RFC 3339 format; startDate defaults server-side to now, endDate is unbounded.
 */
export interface EventQuery {
  startDate?: string;
  endDate?: string;
  organizationId?: number;
}

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
function queryString(query: EventQuery = {}) {
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
 * The body `POST /v1/events` accepts. `ownerId`, `organizationId`, `id` and
 * `createdAt` are the server's to assign, and sending them is rejected.
 */
export type EventCreate = components["schemas"]["EventCreate"];
// {
//   title: string;
//   /** RFC 3339. */
//   startsAt: string;
//   location?: string | null;
//   description?: string | null;
//   thumbnail?: string | null;
//   registrationLink?: string | null;
//   volunteerContact?: string | null;
// }

/**
 * POST /v1/events - publishes an event owned by the signed-in user. Throws ApiError
 * 401 without a session, or when the cookie does not verify.
 */
export const createEvent = (input: EventCreate) => post<Event>('/events', input);
