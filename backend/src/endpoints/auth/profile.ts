import { Router, type Request, type Response, type NextFunction } from 'express';

import { prisma } from '../../db/client.js';
import { requireAuth } from '../../middleware/auth.js';
import { notFound, unauthorized } from '../../utils/problems.js';

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
 * GET /v1/auth/profile
 *
 * Returns the signed-in user. The id comes from the verified session payload
 * that comes from the requireAuth middleware 
 */
router.get('/auth/profile', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (userId === undefined) {
      next(unauthorized('Authentication is required to access this resource.'));
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullname: true, email: true, organizationId: true, createdAt: true },
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

export default router;
