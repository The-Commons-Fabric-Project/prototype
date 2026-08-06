import jwt from 'jsonwebtoken';
import type { Response } from 'express';

/**
 * Signed-cookie session management. There is no server-side session store - the
 * cookie's signature is what verifies the session, which keeps auth stateless.
 */

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  userId: number;
}

/** Fails fast rather than signing with `undefined`, which would let a token be forged. */
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('[SERVER] SESSION_SECRET not set - required to sign session tokens');
  }
  return secret;
}

export function signSessionToken(payload: SessionPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: SESSION_DURATION_SECONDS });
}

/** Returns the payload, or null if the token is expired or tampered with. */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

/** Signs a session token for `userId` and sets it as an httpOnly cookie. */
export function startSession(res: Response, userId: number): void {
  const token = signSessionToken({ userId });
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_SECONDS * 1000,
  });
}

export function endSession(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME);
}

export { SESSION_COOKIE_NAME };
