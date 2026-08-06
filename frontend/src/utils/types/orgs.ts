/**
 * Mirrors the CHECK on users.email in backend/src/docs/db/schema.dbml, and
 * EMAIL_PATTERN in backend/src/utils/constraints.ts.
 */
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const ORG_TAGS = [
  "Advocacy",
  "Civic",
  "Community",
  "Culture",
  "Education",
  "Equity",
  "Indigenous",
  "Makers",
  "Policy",
  "Research",
  "Seniors",
  "Settlement",
  "Tech",
  "Volunteer",
  "Youth",
] as const

export type OrgTag = typeof ORG_TAGS[number]

/**
 * Mirrors the `Organization` schema in backend/src/docs/api/openapi.yaml. Only `id`
 * and `name` are guaranteed; `tags` is absent rather than null when there are none.
 */
export type Org = {
  id: number;
  name: string;
  /** Server-relative path, e.g. ./public/organization_logos/example.jpg */
  logo: string | null;
  blurb: string | null;
  contact: string | null;
  website: string | null;
  tags?: OrgTag[];
};
