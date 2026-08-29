/**
 * The /v1/organizations operations. No mapping - utils/types/orgs.ts mirrors the
 * OpenAPI `Organization` schema.
 */

import { get } from './client';
import type { components as c } from "./openapi.gen";

/**
 * Mirrors the `Organization` schema in backend/src/docs/api/openapi.yaml. Only `id`
 * and `name` are guaranteed; `tags` is absent rather than null when there are none. `logo` is a server-relative path, e.g. ./public/organization_logos/example.jpg
 */
export type Org = c["schemas"]["Organization"];
export type OrgTag = c["schemas"]["OrganizationTag"];
export type OrgId = c["schemas"]["OrganizationId"];

/** GET /v1/organizations - ordered by name, unpaginated. */
export const listOrganizations = () => get<Org[]>('/organizations');

/** GET /v1/organizations/{organizationId} */
export const getOrganization = (organizationId: OrgId) => get<Org>(`/organizations/${organizationId}`);
