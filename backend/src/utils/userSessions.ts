import jwt from 'jsonwebtoken';
import type { Response } from 'express';

/**
 * Signed-cookie session management. There is no server-side session store -
 * the information in the cookie verifies the session. This keeps auth stateless.
 * We might want to change this in the future
*/

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: number;
}

/** SESSION_SECRET is required so a session token can't be forged; fail fast rather than sign with `undefined`. */
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('[SERVER] SESSION_SECRET not set - required to sign session tokens');
  }
  return secret;
}

/** Signs a session token carrying `payload`, expiring after SESSION_DURATION_SECONDS. */
export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: SESSION_DURATION_SECONDS });
}

/** Verifies a session token, returning its payload, or null if it is missing, expired, or tampered with. */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

/** Signs a session token for `userId` and sets it as an httpOnly cookie on `res`. */
export function startSession(res: Response, userId: number): void {
  const token = signSessionToken({ userId });
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_SECONDS * 1000,
  });
}

/** Clears the session cookie, ending the session. */
export function endSession(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME };
