/**
 * Allowed values for organizations_tags.tag, restated from the `org_tags` enum in
 * src/docs/db/schema.dbml because SQLite has no enum type.
 *
 * To change the list: edit the DBML first, then this file, the OpenAPI
 * `OrganizationTag` enum, and a migration for the CHECK. test/schema-sync.test.ts
 * fails on drift.
 */
export const ORG_TAGS = [
  'Advocacy',
  'Civic',
  'Community',
  'Culture',
  'Education',
  'Equity',
  'Indigenous',
  'Makers',
  'Policy',
  'Research',
  'Seniors',
  'Settlement',
  'Tech',
  'Volunteer',
  'Youth',
] as const;

export type OrgTag = (typeof ORG_TAGS)[number];

export const isOrgTag = (value: unknown): value is OrgTag =>
  typeof value === 'string' && (ORG_TAGS as readonly string[]).includes(value);
