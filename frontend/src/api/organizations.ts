/**
 * The /v1/organizations operations. No mapping - utils/types/orgs.ts mirrors the
 * OpenAPI `Organization` schema.
 */

import { get } from './client';
import type { Org } from '../utils/types/orgs';

/** GET /v1/organizations - ordered by name, unpaginated. */
export const listOrganizations = () => get<Org[]>('/organizations');

/** GET /v1/organizations/{organizationId} */
export const getOrganization = (organizationId: number) => get<Org>(`/organizations/${organizationId}`);
