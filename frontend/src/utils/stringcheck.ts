export type Concat<A extends string, B extends string> = `${A}${B}`;

/**
 * Mirrors the CHECK on users.email in backend/src/docs/db/schema.dbml, and
 * EMAIL_PATTERN in backend/src/utils/constraints.ts.
 * 
 * stricter regex is from https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email#validation
 */ 
// const EMAIL_RE_BROWSER = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export type EmailAddress = string & { __type: "EmailAddress" };

export function isEmailAddress(str: string): asserts str is EmailAddress {
  if (!EMAIL_RE.test(str)) throw new Error(`${str} is not a valid email address.`)
}

/** "The Council on Aging of Ottawa" -> "TCAO" (max 4 letters) */
export function orgInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 4);
}


