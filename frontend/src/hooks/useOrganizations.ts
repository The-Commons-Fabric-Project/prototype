/**
 * The organization directory, fetched once and shared by every component. No
 * provider: the query cache keyed by ['organizations'] already is the shared store.
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import { listOrganizations } from '../api/organizations';
import type { Org } from '../api/organizations';

const organizationsQueryKey = ['organizations'] as const;

export function useOrganizations() {
  return useQuery({
    queryKey: organizationsQueryKey,
    queryFn: listOrganizations,
    staleTime: 'static',
  });
}

export function useOrgLookup() {
  const { data } = useOrganizations();

  return useCallback(
    (organizationId: number): string | undefined =>
      data?.find((org: Org) => org.id === organizationId)?.name,
    [data],
  );
}
