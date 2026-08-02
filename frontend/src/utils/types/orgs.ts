/**
 * Mirrors the CHECK on users.email in backend/src/docs/db/schema.dbml, and
 * EMAIL_PATTERN in backend/src/models/constraints.ts.
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

export type Org = {
  id: number;
  name: string;
  blurb: string;
  tags: OrgTag[];
  contact: string;
  website: string;
};
