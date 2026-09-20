/**
 * The /v1/events operations. No mapping - utils/types/events.ts mirrors the OpenAPI
 * `Event` schema, so a conversion step here would mean the two have drifted.
 */

import { endOfDay, parse, startOfDay } from 'date-fns';

import { get, post, type QueryString } from './client';
import type { components as c, operations as op } from './openapi.gen';


export type Event = c["schemas"]["Event"];
export type Timestamp = c["schemas"]["Timestamp"];
export const requiresRegistration = (event: Event) => Boolean(event.registrationLink);
export const needsVolunteers = (event: Event) => Boolean(event.volunteerContact);


export type EventQuery = op["listEvents"]["parameters"]["query"];


function toTimestamp(value: string, edge: 'start' | 'end'): Timestamp {
  const day = parse(value, 'yyyy-MM-dd', new Date(0));
  return (edge === 'start' ? startOfDay(day) : endOfDay(day)).toISOString();
}

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

export type EventCreate = c["schemas"]["EventCreate"];

/**
 * POST /v1/events - publishes an event owned by the signed-in user. Throws ApiError
 * 401 without a session, or when the cookie does not verify.
 */
export const createEvent = (input: EventCreate) => post<Event>('/events', input);
