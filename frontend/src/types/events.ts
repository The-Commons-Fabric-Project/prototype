export const EVENT_TAGS = {
  "Registration": {
    label: "Registration",
    color: "rgb(15, 110, 92)",
    background: "rgb(227, 240, 236)",
  },
  "Volunteers wanted": {
    label: "Volunteers wanted",
    color: "rgb(200, 133, 43)",
    background: "rgba(200, 133, 43, 0.14)",
  },
} as const

export type EventTagKey = keyof typeof EVENT_TAGS
export type EventTag = (typeof EVENT_TAGS)[EventTagKey]

export type Event = {
  id: string | number;
  month: string;
  day: number;
  year: number;
  title: string;
  time: string;
  organization?: string;
  description?: string;
  location?: string;
  tags?: EventTagKey[];
  thumbnailUrl?: string;
  registrationInfo?: string;
  registerUrl?: string;
};
