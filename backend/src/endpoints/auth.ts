import { Router, type Request, type Response, type NextFunction } from 'express';

import { prisma } from '../db/client.js';
import { Prisma } from '../generated/prisma/client.js';
import { requireAuth } from '../middleware/auth.js';
import { hashPassword, verifyPassword } from '../utils/encryption.js';
import { conflict, notFound, unauthorized } from '../utils/problems.js';
import { startSession, endSession } from '../utils/userSessions.js';


export const authRouter = Router();

/** The columns that make up the public `User` schema  */
const userSelect = {
  id: true,
  fullname: true,
  email: true,
  organizationId: true,
  createdAt: true,
} as const;

/**
 * Maps a row to the `User` schema.
 *
 * Rows carrying extra columns (login reads passwordHash alongside these) are
 * accepted and the extras are dropped, which is what keeps the hash out of
 * every response.
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
 * Creates a new user with a name, email, password and organization id
 */
authRouter.post('/auth/create-user', async (req: Request, res: Response, next: NextFunction) => {
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
      select: userSelect,
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

/**
 * POST /v1/auth/login
 *
 * Verifies email/password against the stored argon2id hash and logs user in
 */
authRouter.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await prisma.user.findUnique({
      where: { email },
      select: { ...userSelect, passwordHash: true },
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

/**
 * POST /v1/auth/logout
 *
 * Auth is stateless on the backend so only the client side cookie needs to be cleared
 * always returns true even if a session is not found
 */
authRouter.post('/auth/logout', (_req: Request, res: Response) => {
  endSession(res);
  res.status(200).json({ ok: true });
});

/**
 * GET /v1/auth/profile
 *
 * Returns the signed-in user. The id comes from the verified session payload
 * that comes from the requireAuth middleware
 */
authRouter.get('/auth/profile', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (userId === undefined) {
      next(unauthorized('Authentication is required to access this resource.'));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      next(notFound('The user for this session no longer exists.'));
      return;
    }

    res.status(200).json(toUser(user));
  } catch (err) {
    next(err);
  }
});
