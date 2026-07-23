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
