/**
 * Allowed values for organizations_tags.tag.
 *
 * The authoritative list is the `org_tags` enum in src/docs/db/schema.dbml. SQLite
 * has no enum type, so that list has to be restated wherever it is enforced: as an
 * IN (...) CHECK in the initial migration, as the OpenAPI `OrganizationTag` enum,
 * and as this array for the application layer. Those copies are in three different
 * languages and cannot import one another.
 *
 * test/schema-sync.test.ts asserts that this array and the OpenAPI enum still
 * agree with the DBML, so drift fails CI rather than production. To change the
 * list: edit the DBML first, run `npm test` to see what no longer matches, then
 * update this file, the OpenAPI enum, and add a migration for the CHECK.
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

/** Narrows an arbitrary value to an OrgTag. */
export const isOrgTag = (value: unknown): value is OrgTag =>
  typeof value === 'string' && (ORG_TAGS as readonly string[]).includes(value);
