/**
 * The regex CHECK constraints from src/docs/db/schema.dbml, enforced in the
 * application layer because SQLite cannot run Postgres' `~*` operator.
 *
 * Exported as strings as well as RegExp because `RegExp.prototype.source` escapes
 * forward slashes, so it never compares equal to the JSON Schema `pattern` these
 * mirror. Both are case-sensitive, and so stricter than the DBML's `~*`.
 */

/** Mirrors the CHECK on users.email, organizations.contact and events.volunteer_contact. */
export const EMAIL_PATTERN = '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$';

/** Mirrors the CHECK on events.registration_link and organizations.website. */
export const URL_PATTERN = '^https?://[^\\s/$.?#].[^\\s]*$';

export const EMAIL_RE = new RegExp(EMAIL_PATTERN);
export const URL_RE = new RegExp(URL_PATTERN);
