import { Router, type Request, type Response, type NextFunction } from 'express';

import { prisma } from '../../db/client.js';
import { verifyPassword } from '../../utils/encryption.js';
import { unauthorized } from '../../utils/problems.js';
import { startSession } from '../../utils/userSessions.js';

const router = Router();

/**
 * Maps a row to the `User` schema.
 */
const toUser = (row: {
  id: number;
  fullname: string;
  email: string;
  organizationId: number;
  createdAt: Date;
}) => ({
  id: row.id,
  fullname: row.fullname,
  email: row.email,
  organizationId: row.organizationId,
  createdAt: row.createdAt.toISOString(),
});

/**
 * POST /v1/auth/login
 *
 * Verifies email/password against the stored argon2id hash
 */
router.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, fullname: true, email: true, organizationId: true, createdAt: true, passwordHash: true },
    });

    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      next(unauthorized('Email or password is incorrect.'));
      return;
    }

    startSession(res, user.id);
    res.status(200).json(toUser(user));
  } catch (err) {
    next(err);
  }
});

export default router;
