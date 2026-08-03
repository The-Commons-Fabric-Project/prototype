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

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createEvent, listEvents, type EventCreate, type EventQuery } from '../api/events';

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

/**
 * Publishes an event, then invalidates every cached window.
 *
 * Invalidating all of them rather than the one on screen is deliberate: a new
 * event lands in whichever windows contain its start date, and the caller has no
 * way to know which of the cached ones those are. The alternative - pushing the
 * created event into the active window's list - would leave every other cached
 * window quietly wrong until it expired. Windows that are not being rendered
 * refetch lazily, so the cost of the broad invalidation is one request for the
 * view the user is actually looking at.
 */
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: EventCreate) => createEvent(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}
