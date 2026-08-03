/**
 * The regex CHECK constraints from src/docs/db/schema.dbml.
 *
 * SQLite cannot run Postgres' `~*` operator, so these CHECKs were not carried into
 * the initial migration and are enforced in the application layer instead (see the
 * header of prisma/schema.prisma). They are restated as `pattern` keywords in
 * src/docs/api/openapi.yaml, which is where request validation applies them;
 * test/schema-sync.test.ts asserts the two stay in agreement.
 *
 * Exported as strings as well as RegExp because `RegExp.prototype.source` escapes
 * forward slashes (`^https?:\/\/...`), so it never compares equal to the JSON
 * Schema `pattern` these mirror. The string is the canonical form.
 *
 * Both are case-sensitive while the DBML CHECKs use the case-insensitive `~*`, so
 * these are stricter than the database: `HTTPS://example.com` is rejected here but
 * Postgres would accept it. Normalise the scheme before insert rather than assuming
 * the two layers agree.
 */

/** Mirrors the CHECK on users.email, organizations.contact and events.volunteer_contact. */
export const EMAIL_PATTERN = '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$';

/** Mirrors the CHECK on events.registration_link and organizations.website. */
export const URL_PATTERN = '^https?://[^\\s/$.?#].[^\\s]*$';

export const EMAIL_RE = new RegExp(EMAIL_PATTERN);
export const URL_RE = new RegExp(URL_PATTERN);
