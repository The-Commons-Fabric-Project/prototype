/**
 * The organization directory, fetched once and shared by every component. No
 * provider: the query cache keyed by ['organizations'] already is the shared store.
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { listOrganizations } from '../api/organizations';
import type { Org } from '../api/orgs';

export const organizationsQueryKey = ['organizations'] as const;

export function useOrganizations() {
  return useQuery({
    queryKey: organizationsQueryKey,
    queryFn: listOrganizations,
    staleTime: 'static',
  });
}

/**
 * Resolves an organizationId to its name, for parents to pass down as a prop -
 * which keeps the presentational components working in Storybook.
 *
 * Returns undefined while the directory loads, or for an unknown id.
 */
export function useOrgLookup() {
  const { data } = useOrganizations();

  return useCallback(
    (organizationId: number): string | undefined =>
      data?.find((org: Org) => org.id === organizationId)?.name,
    [data],
  );
}
