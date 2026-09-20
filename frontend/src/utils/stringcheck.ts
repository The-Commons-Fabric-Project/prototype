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

/** Turns number `n` into a string with length `places`. 
 * 1 -> "01". Default num places = 2. 
 * If `n` has more digits than `places`, digits to the left get dropped.
 */
export function padNumString(n: number, places = 2): string {
  const num = n % Math.pow(10, places);
  return String(num).padStart(places, "0");
}


