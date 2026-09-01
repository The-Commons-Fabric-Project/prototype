export type HostColorKey = "green" | "blue" | "purple" | "red" | "orange" | "yellow";

export interface HostPalette {
  /** Primary rail / border color */
  c1: string;
  /** Secondary gradient stop */
  c2: string;
  /** Pale surface tint (logo plate, timeblock fill) */
  tint: string;
  /** AA-safe text color on neutral surfaces */
  text: string;
  /** Four-stop ramp for modal top bars */
  stops: [string, string, string, string];
}

export interface Organization {
  id: number;
  name: string;
  blurb: string;
  contact: string;
  website: string;
}

export type RepeatFrequency = "weekly" | "biweekly" | "monthly";

export interface CalendarEvent {
  id: number;
  title: string;
  /** Must match an Organization.name — drives the host color assignment */
  org: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** 24h time, HH:MM */
  time: string;
  /** ISO date. Optional; defaults to `date`. */
  endDate?: string;
  /** 24h time. Optional on seed data; required by the create form. */
  endTime?: string;
  location: string;
  description: string;
  registrationRequired: boolean;
  registrationLink: string;
  volunteersNeeded: boolean;
  volunteerContact: string;
  /** Explicit duration override in minutes; used when endTime is absent. */
  durationMin?: number;
  recurring?: boolean;
  frequency?: RepeatFrequency;
  /** 0 = Sunday … 6 = Saturday */
  repeatDays?: number[];
  repeatUntil?: string;
  /** Shared by every occurrence generated from one submission */
  seriesId?: number;
  isRepeat?: boolean;
}

export interface Account {
  name: string;
  email: string;
  password: string;
}

export type AppView = "landing" | "directory" | "profile" | "about";
export type EventsView = "grid" | "calendar";
export type CalendarSpan = "day" | "week" | "month";
export type ModalKind = "createAccount" | "login" | "createEvent" | null;

export interface CreateEventForm {
  title: string;
  date: string;
  time: string;
  endDate: string;
  endTime: string;
  location: string;
  description: string;
  recurring: boolean;
  frequency: RepeatFrequency;
  repeatDays: number[];
  repeatUntil: string;
  registrationRequired: boolean;
  registrationLink: string;
  volunteersNeeded: boolean;
  volunteerContact: string;
}

export interface CommonsFabricCalendarProps {
  /** Primary accent. Design-system default #6F49E0. */
  accentColor?: string;
  /** Bars shown per day cell in month view before a "+N more" line. */
  calendarMaxEventsPerDay?: number;
  /** Show the host-color legend under the calendar. */
  showCalendarLegend?: boolean;
}
