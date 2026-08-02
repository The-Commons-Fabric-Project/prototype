import { Router, type Request, type Response, type NextFunction } from 'express';

import { prisma } from '../db/client.js';
import { notFound } from '../utils/problems.js';

/**
 * Routes for the `organizations` table. Mounted under /v1 in app.ts.
 *
 * The frontend loads this list once and holds it, then resolves each event's
 * organizationId against it - which is why Event carries an id rather than an
 * embedded organization, and why neither of these routes is paginated.
 */
export const organizationsRouter = Router();

/** Prisma row plus its joined tag rows. */
type OrganizationRow = Awaited<ReturnType<typeof prisma.organization.findMany>>[number] & {
  tags: { tag: string }[];
};

/**
 * Maps a row to the `Organization` schema.
 *
 * organizations_tags is a join table keyed on (organization_id, tag); the API
 * exposes it as a flat array of the tag values. An organization with no tags gets
 * an empty array rather than a missing field.
 */
const toOrganization = (row: OrganizationRow) => ({
  id: row.id,
  name: row.name,
  logo: row.logo,
  blurb: row.blurb,
  contact: row.contact,
  website: row.website,
  tags: row.tags.map((tag) => tag.tag),
});

const withTags = { tags: { select: { tag: true } } } as const;

/**
 * GET /v1/organizations
 * Every participating organization, ordered by name.
 */
organizationsRouter.get('/organizations', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await prisma.organization.findMany({
      orderBy: { name: 'asc' },
      include: withTags,
    });

    res.json(rows.map(toOrganization));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /v1/organizations/{organizationId}
 */
organizationsRouter.get('/organizations/:organizationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Already validated and coerced to an integer >= 1 by the document.
    const organizationId = Number(req.params.organizationId);

    const row = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: withTags,
    });

    if (!row) throw notFound(`No organization with id ${organizationId}.`);

    res.json(toOrganization(row));
  } catch (err) {
    next(err);
  }
});
