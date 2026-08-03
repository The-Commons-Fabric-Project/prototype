/**
 * Events for a time window, refetched whenever that window changes.
 *
 * The window is part of the query key, which is what makes this safe to drive
 * from a control the user clicks quickly. Paging through calendar months fires a
 * request per month; each is cached under its own key, and a response that
 * arrives after the user has already moved on belongs to a key that is no longer
 * being rendered, so it cannot overwrite the current view. Hand-rolled fetching
 * in an effect has to solve that with an AbortController or a cancelled flag.
 */

import { useQuery } from '@tanstack/react-query';

import { listEvents, type EventQuery } from '../api/events';

/**
 * The key for a window. Empty strings from the date inputs are normalised away
 * so that "" and undefined do not produce two cache entries for one window.
 */
export function eventsQueryKey(query: EventQuery = {}) {
  return [
    'events',
    {
      startDate: query.startDate || undefined,
      endDate: query.endDate || undefined,
      organizationId: query.organizationId,
    },
  ] as const;
}

export function useEvents(query: EventQuery = {}) {
  const key = eventsQueryKey(query);

  return useQuery({
    queryKey: key,
    queryFn: () => listEvents(key[1]),
    // Keep the previous window's events on screen while the next one loads, so
    // paging through months does not blank the calendar on every click.
    placeholderData: (previous) => previous,
  });
}
