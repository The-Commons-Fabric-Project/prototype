import { Router, Request, Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../db/client.js';
import { parseCommonsFabricUser, dbUpsertCommonsFabricUser, CommonsFabricUserValidationError } from '../models/CommonsFabricUser.js';

/**
 * Routes for the `users` table. Mounted under /users in app.ts.
 */
export const usersRouter = Router();

/**
 * GET /users/count
 * Returns the total number of users in the database.
 */
usersRouter.get('/count', async (_req: Request, res: Response) => {
  const count = await prisma.user.count();
  res.json({ count });
});

/**
 * POST /users
 * Creates a new user.
 *
 * Body: { fullname, email, password, organizationId }
 *
 * NOTE: `password` is stored as-is here. Before this is used for anything real
 * it must be hashed (e.g. bcrypt/argon2) - the column is meant to hold a hash,
 * not plaintext.
 */
usersRouter.post('/', async (req: Request, res: Response) => {
  try {
    const newUser = parseCommonsFabricUser(req.body);
    const user = await dbUpsertCommonsFabricUser(newUser);
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof CommonsFabricUserValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaErrors: Record<string, { status: number; message: string }> = {
        P2002: { status: 409, message: 'A user with that email already exists' },
        P2003: { status: 400, message: 'organizationId does not reference an existing organization' },
      };
      const mapped = prismaErrors[err.code];
      if (mapped) {
        res.status(mapped.status).json({ error: mapped.message });
        return;
      }
    }
    res.status(500).json({ error: 'server failed' });
  }
});
