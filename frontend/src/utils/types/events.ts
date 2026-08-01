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

export type Event = {
  id: string | number;
  title: string;
  date: string;
  time: string;
  org?: string;
  description?: string;
  location?: string;
  tags?: EventTag[];
  registrationRequired: boolean;
  volunteersNeeded: boolean;
  thumbnailUrl?: string;
  registrationLink?: string;
  registerUrl?: string;
  volunteerContact?: string;
  // [prop: string]: unknown; // in case we need to add other properties, ref: https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks
};
