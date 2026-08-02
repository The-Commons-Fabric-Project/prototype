import { Router, type Request, type Response, type NextFunction } from 'express';

import { prisma } from '../../db/client.js';
import { Prisma } from '../../generated/prisma/client.js';
import { hashPassword } from '../../utils/encryption.js';
import { conflict } from '../../utils/problems.js';
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
 * POST /v1/auth/create-user
 *
 * Body shape and constraints (email format, password minLength, unknown-property
 * rejection) enforced by express-openapi-validator.
 */
router.post('/auth/create-user', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullname, email, password, organizationId } = req.body as {
      fullname: string;
      email: string;
      password: string;
      organizationId: number;
    };

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { fullname, email, passwordHash, organizationId },
      select: { id: true, fullname: true, email: true, organizationId: true, createdAt: true },
    });

    startSession(res, user.id);
    res.status(201).location(`/v1/users/${user.id}`).json(toUser(user));
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      next(conflict(`A user with email ${(req.body as { email?: string }).email} already exists.`));
      return;
    }
    next(err);
  }
});

export default router;
