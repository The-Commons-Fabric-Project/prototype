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
 * Mirrors the `Event` schema in backend/src/docs/api/openapi.yaml. A
 * `GET /v1/events` response is this type with no conversion.
 *
 * An event is a single instant with no end time, at the UX team's decision. Use
 * toDateKey/toTimeKey in utils/datetime.ts for the "YYYY-MM-DD" and "HH:MM" strings
 * the formatters and DateChip expect.
 */
export type Event = {
  id: number;
  ownerId: number;
  /** Resolved server-side by following ownerId. */
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
 * Derived rather than stored: an event needs registration exactly when it has a link
 * to register through, so the two cannot fall out of sync.
 */
export const requiresRegistration = (event: Event) => Boolean(event.registrationLink);
export const needsVolunteers = (event: Event) => Boolean(event.volunteerContact);
