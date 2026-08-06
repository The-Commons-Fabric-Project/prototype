import type { Request, Response, NextFunction } from 'express';

import { unauthorized } from '../utils/problems.js';
import { SESSION_COOKIE_NAME, verifySessionToken, type SessionPayload } from '../utils/userSessions.js';

/** Carries the verified session payload from requireAuth to the handler. */
declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionPayload;
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token: unknown = req.cookies?.[SESSION_COOKIE_NAME];

  if (typeof token !== 'string' || token.length === 0) {
    next(unauthorized('Authentication is required to access this resource.'));
    return;
  }

  const payload = verifySessionToken(token);
  if (!payload) {
    next(unauthorized('Session is invalid or has expired.'));
    return;
  }

  req.user = { userId: payload.userId };
  next();
}
