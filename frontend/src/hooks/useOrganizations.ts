/**
 * The organization directory, fetched once and shared by every component.
 *
 * There is no context provider here on purpose. A query cache keyed by
 * ['organizations'] already *is* a shared global store: every caller of this
 * hook, on any route, reads the same entry and only the first one causes a
 * request. Wrapping that in a provider would duplicate the cache rather than
 * add anything.
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { listOrganizations } from '../api/organizations';
import type { Org } from '../utils/types/orgs';

export const organizationsQueryKey = ['organizations'] as const;

export function useOrganizations() {
  return useQuery({
    queryKey: organizationsQueryKey,
    queryFn: listOrganizations,
    // The directory changes about as often as the list of participating
    // organizations does, which is to say rarely and never mid-session. 'static'
    // means it is fetched once and then never refetched without an explicit
    // invalidation - the closest thing to the "load it up front and hold it"
    // model, without a provider.
    staleTime: 'static',
  });
}

/**
 * Resolves an organizationId to its name.
 *
 * Events carry only `organizationId`; the components that display an
 * organization want its name. Rather than have each one fetch, they take a
 * resolved name as a prop and their parent uses this - so the presentational
 * components stay free of data dependencies and keep working in Storybook.
 *
 * Returns undefined while the directory is still loading, or for an id that is
 * not in it. Callers should render a fallback rather than an empty string.
 */
export function useOrgLookup() {
  const { data } = useOrganizations();

  return useCallback(
    (organizationId: number): string | undefined =>
      data?.find((org: Org) => org.id === organizationId)?.name,
    [data],
  );
}
