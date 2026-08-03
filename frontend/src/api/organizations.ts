/**
 * The /v1/organizations operations.
 *
 * As with events, no mapping: utils/types/orgs.ts mirrors the OpenAPI
 * `Organization` schema, so the response is already the type the UI uses.
 */

import { get } from './client';
import type { Org } from '../utils/types/orgs';

/** GET /v1/organizations - every participating organization, ordered by name. Unpaginated; the list is small. */
export const listOrganizations = () => get<Org[]>('/organizations');

/** GET /v1/organizations/{organizationId} */
export const getOrganization = (organizationId: number) => get<Org>(`/organizations/${organizationId}`);
