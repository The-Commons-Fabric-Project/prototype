import { Router, type Request, type Response } from 'express';

import { endSession } from '../../utils/userSessions.js';

const router = Router();

/**
 * POST /v1/auth/logout
 *
 * Clears the session cookie. Succeeds even when the caller has no session.
 */
router.post('/auth/logout', (_req: Request, res: Response) => {
  endSession(res);
  res.status(200).json({ ok: true });
});

export default router;
