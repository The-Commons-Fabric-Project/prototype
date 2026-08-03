import { Router, type Request, type Response, type NextFunction } from 'express';

import { prisma } from '../db/client.js';
import { Prisma } from '../generated/prisma/client.js';
import { requireAuth } from '../middleware/auth.js';
import { badRequest, notFound, unauthorized } from '../utils/problems.js';

/**
 * Routes for the `events` table. Mounted under /v1 in app.ts.
 *
 * Request shapes are not re-checked here - express-openapi-validator has already
 * rejected anything the document does not allow, and has coerced query and path
 * parameters to their declared types. What is left is the rules JSON Schema cannot
 * express (endsAt > startsAt) and resolving the owner's organization.
 */
export const eventsRouter = Router();

/** Prisma row plus the joined column that `organizationId` is derived from. */
type EventRow = Awaited<ReturnType<typeof prisma.event.findMany>>[number] & {
  owner: { organizationId: number };
};

/**
 * Maps a row to the `Event` schema.
 *
 * Timestamps are converted explicitly: response validation inspects the object
 * handed to res.json rather than the serialised JSON, so a Date would fail
 * `type: string` even though it would have serialised to a valid date-time.
 *
 * `organizationId` is the DBML relationship events.owner_id -> users.organization_id
 * resolved server-side. The events table has no organization column, so this
 * follows the owner's current organization.
 */
const toEvent = (row: EventRow) => ({
  id: row.id,
  ownerId: row.ownerId,
  organizationId: row.owner.organizationId,
  title: row.title,
  startsAt: row.startsAt.toISOString(),
  endsAt: row.endsAt.toISOString(),
  location: row.location,
  description: row.description,
  thumbnail: row.thumbnail,
  registrationLink: row.registrationLink,
  volunteerContact: row.volunteerContact,
  createdAt: row.createdAt.toISOString(),
});

/** One query, one join - never a lookup per event. */
const withOwnerOrganization = { owner: { select: { organizationId: true } } } as const;

/**
 * GET /v1/events
 * Events overlapping a time window, ordered by startsAt.
 */
eventsRouter.get('/events', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, organizationId } = req.query as {
      startDate?: string;
      endDate?: string;
      organizationId?: number;
    };

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : undefined;

    // The schema cannot compare two fields, so the document promises the server
    // enforces this and answers 400. Mirrors the ends_at > starts_at CHECK.
    if (end && end <= start) {
      throw badRequest('endDate must be later than startDate.', '/query/endDate');
    }

    // Overlap, not containment: an event that began before the window but is still
    // running belongs in it. endsAt >= start AND startsAt <= end.
    const rows = await prisma.event.findMany({
      where: {
        endsAt: { gte: start },
        ...(end ? { startsAt: { lte: end } } : {}),
        ...(organizationId !== undefined ? { owner: { organizationId } } : {}),
      },
      orderBy: { startsAt: 'asc' },
      include: withOwnerOrganization,
    });

    res.json(rows.map(toEvent));
  } catch (err) {
    next(err);
  }
});

/** The body EventCreate admits. Optional fields are absent or null, never undefined-as-a-value. */
type EventCreateBody = {
  title: string;
  startsAt: string;
  endsAt: string;
  location?: string | null;
  description?: string | null;
  thumbnail?: string | null;
  registrationLink?: string | null;
  volunteerContact?: string | null;
};

/**
 * POST /v1/events
 *
 * The owner is the signed-in user and nothing else: requireAuth resolves it from
 * the signed session cookie, and EventCreate's `unevaluatedProperties: false`
 * rejects a body that tries to name a different one. Fields are copied across by
 * name rather than spreading req.body - the schema is what makes the spread safe
 * today, and picking fields explicitly is what keeps it safe if the schema ever
 * loosens.
 */
eventsRouter.post('/events', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ownerId = req.user?.userId;
    if (ownerId === undefined) {
      next(unauthorized('Authentication is required to access this resource.'));
      return;
    }

    const body = req.body as EventCreateBody;
    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(body.endsAt);

    // The schema cannot compare two fields, so the document promises the server
    // enforces this and answers 400. Mirrors the ends_at > starts_at CHECK, which
    // would otherwise surface as an opaque 500 from the database.
    if (endsAt <= startsAt) {
      throw badRequest('endsAt must be later than startsAt.', '/body/endsAt');
    }

    const row = await prisma.event.create({
      data: {
        title: body.title,
        ownerId,
        startsAt,
        endsAt,
        location: body.location ?? null,
        description: body.description ?? null,
        thumbnail: body.thumbnail ?? null,
        registrationLink: body.registrationLink ?? null,
        volunteerContact: body.volunteerContact ?? null,
      },
      include: withOwnerOrganization,
    });

    res.status(201).location(`/v1/events/${row.id}`).json(toEvent(row));
  } catch (err) {
    // The session is signed and unexpired, but names a user who has since been
    // deleted - so events.owner_id has nothing to point at. That is a dead
    // session rather than a bad request, hence 401 and not 500.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      next(unauthorized('The user for this session no longer exists.'));
      return;
    }
    next(err);
  }
});

/**
 * GET /v1/events/{eventId}
 */
eventsRouter.get('/events/:eventId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Already validated and coerced to an integer >= 1 by the document.
    const eventId = Number(req.params.eventId);

    const row = await prisma.event.findUnique({
      where: { id: eventId },
      include: withOwnerOrganization,
    });

    if (!row) throw notFound(`No event with id ${eventId}.`);

    res.json(toEvent(row));
  } catch (err) {
    next(err);
  }
});
