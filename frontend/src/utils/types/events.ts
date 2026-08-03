export const EVENT_TAGS = {
  "Registration": {
    label: "Registration",
    color: "rgb(80, 122, 189)",
    background: "rgb(231, 238, 247)",
  },
  "Volunteers wanted": {
    label: "Volunteers wanted",
    color: "rgb(242, 165, 65)",
    background: "rgba(242, 165, 65, 0.14)",
  },
} as const

export type EventTag = keyof typeof EVENT_TAGS
export type EventTagInfo = (typeof EVENT_TAGS)[EventTag]

/**
 * Mirrors the `Event` schema in backend/src/docs/api/openapi.yaml, which in turn
 * mirrors the `events` table in backend/src/docs/db/schema.dbml - the source of
 * truth for all of this. A `GET /v1/events` response is this type with no
 * conversion, which is the point: there is nowhere for the two shapes to drift.
 *
 * Two things the UI used to carry are deliberately absent:
 *
 *   - `date` and `time` are one `startsAt` timestamp. Use toDateKey/toTimeKey
 *     in utils/datetime.ts to get the "YYYY-MM-DD" and "HH:MM" strings the
 *     formatters and DateChip expect. There is no end time: events are a single
 *     instant on the calendar, at the UX team's decision.
 *   - `org` was the organization's *name*. Events carry `organizationId`; the
 *     name is resolved against the organization list (see hooks/useEvents.ts).
 */
export type Event = {
  id: number;
  /** The user who published the event. */
  ownerId: number;
  /** The publishing user's organization, resolved server-side by following ownerId. */
  organizationId: number;
  title: string;
  /** RFC 3339 timestamp. */
  startsAt: string;
  location: string | null;
  description: string | null;
  /** Server-relative path, e.g. ./public/event_images/example.jpg */
  thumbnail: string | null;
  registrationLink: string | null;
  volunteerContact: string | null;
  createdAt: string;
};

/**
 * Whether an event needs sign-up, and whether it wants volunteers.
 *
 * These were stored booleans that could disagree with the fields they described.
 * The database has no such columns - an event needs registration exactly when it
 * has a link to register through - so they are derived rather than stored, and
 * cannot fall out of sync.
 */
export const requiresRegistration = (event: Event) => Boolean(event.registrationLink);
export const needsVolunteers = (event: Event) => Boolean(event.volunteerContact);
