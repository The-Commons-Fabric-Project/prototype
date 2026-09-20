export type Concat<A extends string, B extends string> = `${A}${B}`;

/**
 * Mirrors the CHECK on users.email in backend/src/docs/db/schema.dbml, and
 * EMAIL_PATTERN in backend/src/utils/constraints.ts.
 */
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** "The Council on Aging of Ottawa" -> "TCAO" (max 4 letters) */
export function orgInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 4);
}


